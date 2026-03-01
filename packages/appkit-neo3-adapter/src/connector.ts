import {
  ChainController,
  WalletConnectConnector,
  WcHelpersUtil,
  type Provider,
  type RequestArguments,
} from "@reown/appkit-controllers";

import type {
  InvokeResult,
  CalculateFee,
  SignMessagePayload,
  SignedMessage,
  EncryptedPayload,
  DecryptFromArrayResult,
  BuiltTransaction,
  ContractInvocationMulti,
} from "@cityofzion/neon-dappkit-types";
import { ProviderEventEmitter } from "./emitter.js";
import type { SessionTypes } from "@walletconnect/types";
import type { CaipNetwork } from "@reown/appkit";

type WalletInfo = {
  isLedger: boolean;
};

export class Neo3Connector extends WalletConnectConnector implements Provider {
  private readonly eventEmitter = new ProviderEventEmitter();
  public readonly emit = this.eventEmitter.emit.bind(this.eventEmitter);
  public readonly on = this.eventEmitter.on.bind(this.eventEmitter);
  public readonly removeListener = this.eventEmitter.removeListener.bind(
    this.eventEmitter,
  );

  public get session(): SessionTypes.Struct | undefined {
    return this.provider.session;
  }

  private get sessionChains() {
    return WcHelpersUtil.getChainsFromNamespaces(
      this.provider.session?.namespaces,
    );
  }

  public override get chains() {
    return this.sessionChains
      .map((chainId) =>
        this.caipNetworks.find((chain) => chain.caipNetworkId === chainId),
      )
      .filter(Boolean) as CaipNetwork[];
  }

  async connect(): Promise<string> {
    const { session } = await super.connectWalletConnect();
    const account = session.namespaces[this.chain]?.accounts[0];
    const address = account?.split(":")[2];

    if (!address) {
      throw new Error("No account found in session");
    }

    this.emit("connect", address);

    return address;
  }

  async request<T>(args: RequestArguments): Promise<T> {
    const caipNetwork = ChainController.getCaipNetworkByNamespace(this.chain);
    return await this.provider.request(args, caipNetwork?.caipNetworkId);
  }

  /**
   * This method is used to sign a transaction.
   * @param params the contract invocation options
   * @return the call result promise
   */
  async signTransaction(
    params: ContractInvocationMulti | BuiltTransaction,
  ): Promise<BuiltTransaction> {
    const resp = await this.request({
      method: "signTransaction",
      params,
    });
    return resp as BuiltTransaction;
  }

  /**
   * Sends an 'invokeFunction' request to the Wallet and it will communicate with the blockchain. It will consume gas and persist data to the blockchain.
   *
   * ```
   * const invocations: ContractInvocation[] = [
   *   {
   *     scriptHash: '0x010101c0775af568185025b0ce43cfaa9b990a2a',
   *     operation: 'getStream',
   *     abortOnFail: true, // if 'getStream' returns false the next invocation will not be made
   *     args: [
   *       { type: 'Integer', value: 17 }
   *     ]
   *   },
   *   {
   *     scriptHash: '0x010101c0775af568185025b0ce43cfaa9b990a2a',
   *     operation: 'transfer',
   *     args: [
   *       { type: 'Address', value: senderAddress },
   *       { type: 'Address', value: 'NbnjKGMBJzJ6j5PHeYhjJDaQ5Vy5UYu4Fv' },
   *       { type: 'Integer', value: 100000000 },
   *       { type: 'Array', value: [] }
   *     ]
   *   }
   * ]
   *
   * const signer: Signer[] = [
   *   {
   *     scopes: 'Global'
   *   }
   * ]
   *
   * const formattedRequest: ContractInvocationMulti = {
   *   signer,
   *   invocations
   * }
   * const resp = await invokeFunction(formattedRequest)
   * ```
   *
   * @param params the contract invocation options
   * @return the call result promise. It might only contain the transactionId, another call to the blockchain might be necessary to check the result.
   */
  async invokeFunction(params: ContractInvocationMulti): Promise<string> {
    const resp = await this.request({ method: "invokeFunction", params });
    return resp as string;
  }

  /**
   * This method is used to calculate a fee.
   * @param params the contract invocation options
   * @return the call result promise
   */
  async calculateFee(params: ContractInvocationMulti): Promise<CalculateFee> {
    const resp = await this.request({ method: "calculateFee", params });
    return resp as CalculateFee;
  }

  /**
   * Sends a `testInvoke` request to the Wallet and it will communicate with the blockchain.
   * It will not consume any gas but it will also not persist any data, this is often used to retrieve SmartContract information or check how much gas an invocation will cost.
   * Also, the wallet might choose to not ask the user authorization for test invocations making them easy to use.
   *
   * ```
   * const signers: Signer[] = [
   *   {
   *     scopes: 'None'
   *   }
   * ]
   *
   * const invocations: ContractInvocation[] = [
   *   {
   *     scriptHash: '0x010101c0775af568185025b0ce43cfaa9b990a2a',
   *     operation: 'getStream',
   *     abortOnFail: true, // if 'getStream' returns false the next invocation will not be made
   *     args: [
   *       { type: 'Integer', value: 17 }
   *         ],
   *   },
   *   {
   *     scriptHash: '0x010101c0775af568185025b0ce43cfaa9b990a2a',
   *     operation: 'balanceOf',
   *     args: [
   *       { type: 'Address', value: senderAddress }
   *     ]
   *   }
   * ]
   *
   * const formattedRequest: ContractInvocationMulti = {
   *   signers,
   *   invocations
   * }
   * const resp = await testInvoke(formattedRequest)
   * ```
   *
   * @param params the contract invocation options
   * @return the call result promise
   */
  async testInvoke(params: ContractInvocationMulti): Promise<InvokeResult> {
    const resp = await this.request({ method: "testInvoke", params });
    return resp as InvokeResult;
  }

  /**
   * Sends a `signMessage` request to the Wallet.
   * Signs a message
   * @param params the params to send the request
   * @return the signed message object
   */
  async signMessage(params: SignMessagePayload): Promise<SignedMessage> {
    const resp = await this.request({ method: "signMessage", params });
    return resp as SignedMessage;
  }

  /**
   * Sends a `verifyMessage` request to the Wallet.
   * Checks if the signedMessage is true
   * @param params an object that represents a signed message
   * @return true if the signedMessage is acknowledged by the account
   */
  async verifyMessage(params: SignedMessage): Promise<boolean> {
    const resp = await this.request({ method: "verifyMessage", params });
    return resp as boolean;
  }

  /**
   * Retrieves information about the user's wallet
   * @return wallet information
   */
  async getWalletInfo(): Promise<WalletInfo> {
    const resp = await this.request({ method: "getWalletInfo", params: [] });
    return resp as WalletInfo;
  }

  async encrypt(
    message: string,
    publicKeys?: string[],
  ): Promise<EncryptedPayload[]> {
    const resp = await this.request({
      method: "encrypt",
      params: [message, publicKeys].filter(Boolean),
    });
    return resp as EncryptedPayload[];
  }

  async decrypt(payload: EncryptedPayload): Promise<string> {
    const resp = await this.request({ method: "encrypt", params: [payload] });
    return resp as string;
  }

  async decryptFromArray(
    payloads: EncryptedPayload[],
  ): Promise<DecryptFromArrayResult> {
    const resp = await this.request({
      method: "decryptFromArray",
      params: [payloads],
    });
    return resp as DecryptFromArrayResult;
  }
}
