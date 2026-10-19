import {
  type Config,
  getConnectorClient,
  sendTransaction as wagmi_sendTransaction,
  type SendTransactionParameters,
  signMessage,
  signTransaction as wagmi_signTransaction,
  type SignTransactionParameters,
} from "@wagmi/core";
import { neoxMainnet } from "viem/chains";
import {
  neoXAntiMevMainnetNetwork,
  neoXAntiMevTestnetNetwork,
} from "./networks.js";
import type { ChainIdParameter, Compute } from "@wagmi/core/internal";
import {
  type Chain,
  concat,
  createPublicClient,
  getChainContractAddress,
  type Hex,
  http,
  keccak256,
  pad,
  parseTransaction,
  type PublicClient,
  toBytes,
  toHex,
} from "viem";
import { governanceAbi } from "./abis/governance.js";
import { keyManagementAbi } from "./abis/key-management.js";
import { getConsensusThreshold, getScaler, PublicKey } from "neox-tpke";
import type { AppKitNetwork } from "@reown/appkit-common";

export type GetCachedTransactionParameters<config extends Config = Config> =
  Compute<
    ChainIdParameter<config> & {
      nonce: number;
      signature: string;
    }
  >;

export function getAntiMevNetwork(chainId: number | string) {
  return chainId === neoxMainnet.id
    ? neoXAntiMevMainnetNetwork
    : neoXAntiMevTestnetNetwork;
}

export function isAntiMevNetwork(network: AppKitNetwork) {
  const antiMevNetwork = getAntiMevNetwork(network.id);

  return (
    network.rpcUrls.default.http[0] === antiMevNetwork.rpcUrls.default.http[0]
  );
}

function createAntiMevPublicClient(chain: Chain) {
  const antiMevNetwork = getAntiMevNetwork(chain.id);

  return createPublicClient({
    chain,
    transport: http(antiMevNetwork.rpcUrls.default.http[0]),
  });
}

function requestCachedTransaction(
  publicClient: PublicClient,
  nonce: number,
  signature: string,
) {
  return publicClient.request<{ ReturnType: Hex }>({
    method: "eth_getCachedTransaction",
    params: [toHex(nonce), signature],
  });
}

export async function getCachedTransaction<config extends Config>(
  config: config,
  parameters: GetCachedTransactionParameters<config>,
) {
  const { nonce, signature, chainId } = parameters;

  const client = await getConnectorClient(config, { chainId });
  const publicClient = createAntiMevPublicClient(client.chain);

  return await requestCachedTransaction(publicClient, nonce, signature);
}

export async function buildAntiMevTransaction(
  wagmiConfig: Config,
  transactionData: SendTransactionParameters,
) {
  const client = await getConnectorClient(wagmiConfig);

  if (!client?.chain) throw new Error("No chain found in client");
  if (!client.account) throw new Error("No account found in client");

  const publicClient = createAntiMevPublicClient(client.chain);

  const nonce = await publicClient.getTransactionCount({
    blockTag: "pending",
    address: client.account.address,
  });

  try {
    await wagmi_sendTransaction(wagmiConfig, {
      chainId: client.chain.id,
      nonce,
      ...transactionData,
    });
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.includes("transaction cached")
    ) {
      throw error;
    }
  }

  const signature = await signMessage(wagmiConfig, {
    message: nonce.toString(),
  });

  const cachedTransaction = await requestCachedTransaction(
    publicClient,
    nonce,
    signature,
  );

  const consensusSize = await publicClient.readContract({
    address: getChainContractAddress({
      chain: client.chain,
      contract: "governance",
    }),
    abi: governanceAbi,
    functionName: "consensusSize",
  });

  const roundNumber = await publicClient.readContract({
    address: getChainContractAddress({
      chain: client.chain,
      contract: "keyManagement",
    }),
    abi: keyManagementAbi,
    functionName: "roundNumber",
  });

  const aggregatedCommitment = await publicClient.readContract({
    address: getChainContractAddress({
      chain: client.chain,
      contract: "keyManagement",
    }),
    abi: keyManagementAbi,
    functionName: "aggregatedCommitments",
    args: [roundNumber],
  });

  const publicKey = PublicKey.fromAggregatedCommitment(
    toBytes(aggregatedCommitment),
    getScaler(consensusSize, getConsensusThreshold(consensusSize)),
  );

  const { encryptedKey, encryptedMsg } = publicKey.encrypt(
    toBytes(cachedTransaction),
  );

  const transactionObject = parseTransaction(cachedTransaction);

  const envelopeData = concat([
    new Uint8Array([0xff, 0xff, 0xff, 0xff]),
    pad(toBytes(roundNumber), { size: 4 }),
    pad(toBytes(transactionObject.gas!), { size: 4 }),
    toBytes(keccak256(cachedTransaction)),
    encryptedKey,
    encryptedMsg,
  ]);

  return {
    chainId: client.chain.id,
    account: client.account,
    to: getChainContractAddress({
      chain: client.chain,
      contract: "governanceReward",
    }),
    data: toHex(envelopeData),
  };
}

export async function signTransaction(
  wagmiConfig: Config,
  transactionData: SignTransactionParameters,
) {
  const client = await getConnectorClient(wagmiConfig);

  if (!client?.chain) throw new Error("No chain found in client");

  return await wagmi_signTransaction(wagmiConfig, transactionData as any);
}

export async function signAntiMevTransaction(
  wagmiConfig: Config,
  transactionData: SignTransactionParameters,
) {
  const antiMevTransactionData = await buildAntiMevTransaction(
    wagmiConfig,
    transactionData,
  );

  return await wagmi_signTransaction(wagmiConfig, antiMevTransactionData);
}

export async function sendTransaction(
  wagmiConfig: Config,
  transactionData: SendTransactionParameters,
) {
  const client = await getConnectorClient(wagmiConfig);

  if (!client?.chain) throw new Error("No chain found in client");

  return await wagmi_sendTransaction(wagmiConfig, transactionData);
}

export async function sendAntiMevTransaction(
  wagmiConfig: Config,
  transactionData: SendTransactionParameters,
) {
  const antiMevTransactionData = await buildAntiMevTransaction(
    wagmiConfig,
    transactionData,
  );

  return await wagmi_sendTransaction(wagmiConfig, antiMevTransactionData);
}
