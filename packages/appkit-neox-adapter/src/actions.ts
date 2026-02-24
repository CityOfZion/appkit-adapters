import {
  getConnectorClient,
  getTransactionCount,
  readContract,
  sendTransaction as wagmi_sendTransaction,
  signTransaction as wagmi_signTransaction,
  signMessage,
  type Config,
  type SendTransactionParameters,
  type SignTransactionParameters,
} from "@wagmi/core";
import { neoxMainnet } from "viem/chains";
import {
  neoXAntiMevMainnetNetwork,
  neoXAntiMevTestnetNetwork,
} from "./networks.js";
import type { ChainIdParameter, Compute } from "@wagmi/core/internal";
import {
  createPublicClient,
  http,
  type Hex,
  toBytes,
  toHex,
  getChainContractAddress,
  pad,
  keccak256,
  concat,
} from "viem";
import { governanceAbi } from "./abis/governance.js";
import { keyManagementAbi } from "./abis/key-management.js";
import { getConsensusThreshold, getScaler, PublicKey } from "neox-tpke";
import { parseTransaction } from "viem/celo";
import type { AppKitNetwork } from "@reown/appkit-common";

export type GetCachedTransactionParameters<config extends Config = Config> =
  Compute<
    ChainIdParameter<config> & {
      nonce: number;
      signature: string;
    }
  >;

export function isAntiMevNetwork(network: AppKitNetwork) {
  const antiMevNetwork =
    network.id === neoxMainnet.id
      ? neoXAntiMevMainnetNetwork
      : neoXAntiMevTestnetNetwork;

  if (
    network.rpcUrls.default.http[0] === antiMevNetwork.rpcUrls.default.http[0]
  ) {
    return true;
  }

  return false;
}

export async function getCachedTransaction<config extends Config>(
  config: config,
  parameters: GetCachedTransactionParameters<config>,
) {
  const { nonce, signature, chainId } = parameters;

  const client = await getConnectorClient(config, { chainId });

  const publicClient = createPublicClient({
    chain: client.chain,
    transport: http(),
  });

  const transaction = await publicClient.request<{ ReturnType: Hex }>({
    method: "eth_getCachedTransaction",
    params: [toHex(nonce), signature],
  });

  return transaction;
}

export async function buildAntiMevTransaction(
  wagmiConfig: Config,
  transactionData: SendTransactionParameters,
) {
  const client = await getConnectorClient(wagmiConfig);

  if (!client?.chain || !client.account)
    throw new Error("No chain found in client");

  const nonce = await getTransactionCount(wagmiConfig, {
    chainId: client.chain.id,
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

  const cachedTransaction = await getCachedTransaction(wagmiConfig, {
    chainId: client.chain.id,
    nonce,
    signature,
  });

  const consensusSize = await readContract(wagmiConfig, {
    chainId: client.chain.id,
    address: getChainContractAddress({
      chain: client.chain,
      contract: "governance",
    }),
    abi: governanceAbi,
    functionName: "consensusSize",
  });

  const roundNumber = await readContract(wagmiConfig, {
    chainId: client.chain.id,
    address: getChainContractAddress({
      chain: client.chain,
      contract: "keyManagement",
    }),
    abi: keyManagementAbi,
    functionName: "roundNumber",
  });

  const aggregatedCommitment = await readContract(wagmiConfig, {
    chainId: client.chain.id,
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

  if (!isAntiMevNetwork(client.chain)) {
    return await wagmi_signTransaction(wagmiConfig, transactionData as any);
  }

  const buildTransaction = await buildAntiMevTransaction(
    wagmiConfig,
    transactionData,
  );

  return await wagmi_signTransaction(wagmiConfig, buildTransaction);
}

export async function sendTransaction(
  wagmiConfig: Config,
  transactionData: SendTransactionParameters,
) {
  const client = await getConnectorClient(wagmiConfig);

  if (!client?.chain) throw new Error("No chain found in client");

  if (!isAntiMevNetwork(client.chain)) {
    return await wagmi_sendTransaction(wagmiConfig, transactionData);
  }

  const buildTransaction = await buildAntiMevTransaction(
    wagmiConfig,
    transactionData,
  );

  return await wagmi_sendTransaction(wagmiConfig, buildTransaction);
}
