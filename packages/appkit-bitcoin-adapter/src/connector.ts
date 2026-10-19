import {
  ChainController,
  WalletConnectConnector,
  WcHelpersUtil,
  type Provider,
} from "@reown/appkit-controllers";

import type UniversalProvider from "@walletconnect/universal-provider";
import type { RequestArguments } from "@walletconnect/universal-provider";
import { ProviderEventEmitter } from "./emitter.js";
import type { CaipNetwork } from "@reown/appkit-common";

export type TBitcoinConnectorGetAccountAddressesParams = {
  intentions?: string[];
};

export type TBitcoinConnectorAccountAddress = {
  address: string;
  publicKey?: string;
  path?: string;
  intention?: string;
};

export type TBitcoinConnectorSignMessageParams = {
  message: string;
  address?: string;
  protocol?: "ecdsa";
};

export type TBitcoinConnectorSignMessageResponse = {
  address: string;
  signature: string;
  messageHash?: string;
};

export type TBitcoinConnectorSignPsbtParams = {
  psbt: string;
  signInputs?: {
    address: string;
    index: number;
    sighashTypes?: number[];
  }[];
  broadcast?: boolean;
};

export type TBitcoinConnectorSignPsbtResponse = {
  psbt: string;
  txid?: string;
};

export type TBitcoinConnectorSendTransferParams = {
  recipientAddress: string;
  amount: string;
  changeAddress?: string;
  memo?: string;
};

export type TBitcoinConnectorSendTransferResponse = {
  txid: string;
};

export class BitcoinConnector
  extends WalletConnectConnector
  implements Provider
{
  private readonly eventEmitter = new ProviderEventEmitter();
  public readonly emit = this.eventEmitter.emit.bind(this.eventEmitter);
  public readonly on = this.eventEmitter.on.bind(this.eventEmitter);

  public readonly removeListener = this.eventEmitter.removeListener.bind(
    this.eventEmitter,
  );

  public get session(): UniversalProvider["session"] {
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

  private getAccount(): string {
    const caipNetwork = ChainController.getCaipNetworkByNamespace(this.chain);
    const accounts = this.provider.session?.namespaces[this.chain]?.accounts;

    const account =
      accounts?.find((item) =>
        item.startsWith(`${caipNetwork?.caipNetworkId}:`),
      ) || accounts?.[0];

    const address = account?.split(":")[2];

    if (!address) {
      throw new Error("No account found in session");
    }

    return address;
  }

  async getAccountAddresses(
    params: TBitcoinConnectorGetAccountAddressesParams = {},
  ): Promise<TBitcoinConnectorAccountAddress[]> {
    return await this.request<TBitcoinConnectorAccountAddress[]>({
      method: "getAccountAddresses",
      params: { ...params, account: this.getAccount() },
    });
  }

  async signMessage(
    params: TBitcoinConnectorSignMessageParams,
  ): Promise<TBitcoinConnectorSignMessageResponse> {
    return await this.request<TBitcoinConnectorSignMessageResponse>({
      method: "signMessage",
      params: { ...params, account: this.getAccount() },
    });
  }

  async signPsbt(
    params: TBitcoinConnectorSignPsbtParams,
  ): Promise<TBitcoinConnectorSignPsbtResponse> {
    return await this.request<TBitcoinConnectorSignPsbtResponse>({
      method: "signPsbt",
      params: { ...params, account: this.getAccount() },
    });
  }

  async sendTransfer(
    params: TBitcoinConnectorSendTransferParams,
  ): Promise<TBitcoinConnectorSendTransferResponse> {
    return await this.request<TBitcoinConnectorSendTransferResponse>({
      method: "sendTransfer",
      params: { ...params, account: this.getAccount() },
    });
  }
}
