import {
  ChainController,
  type Provider,
  WalletConnectConnector,
  WcHelpersUtil,
} from "@reown/appkit-controllers";

import type UniversalProvider from "@walletconnect/universal-provider";
import type { RequestArguments } from "@walletconnect/universal-provider";
import { ProviderEventEmitter } from "./emitter.js";
import type { CaipNetwork } from "@reown/appkit-common";

type TStellarConnectorSignXDRRequestResponse = {
  signedXDR: string;
  signerAddress: string;
};

type TStellarConnectorSignXDRResponse = {
  signedTxXdr: string;
  signerAddress: string;
};

type TStellarConnectorSignAndSubmitXDRResponse = {
  hash: string;
  status: string;
};

type TStellarConnectorSignMessageResponse = {
  signedMessage: string;
  signerAddress: string;
};

type TStellarConnectorSignAuthEntryResponse = {
  signedAuthEntry: string;
  signerAddress: string;
};

type TStellarConnectorGetNetworkResponse = {
  network: "PUBLIC" | "TESTNET";
  networkPassphrase: string;
};

export class StellarConnector
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

  async signTransaction(
    xdr: string,
  ): Promise<TStellarConnectorSignXDRResponse> {
    const { signedXDR, signerAddress } =
      await this.request<TStellarConnectorSignXDRRequestResponse>({
        method: "stellar_signXDR",
        params: { xdr },
      });

    return {
      signedTxXdr: signedXDR,
      signerAddress,
    };
  }

  async signAndSubmitTransaction(
    xdr: string,
  ): Promise<TStellarConnectorSignAndSubmitXDRResponse> {
    return await this.request<TStellarConnectorSignAndSubmitXDRResponse>({
      method: "stellar_signAndSubmitXDR",
      params: { xdr },
    });
  }

  async signMessage(
    message: string,
  ): Promise<TStellarConnectorSignMessageResponse> {
    return await this.request<TStellarConnectorSignMessageResponse>({
      method: "stellar_signMessage",
      params: { message },
    });
  }

  async signAuthEntry(
    xdr: string,
  ): Promise<TStellarConnectorSignAuthEntryResponse> {
    return await this.request<TStellarConnectorSignAuthEntryResponse>({
      method: "stellar_signAuthEntry",
      params: { xdr },
    });
  }

  async getNetwork(): Promise<TStellarConnectorGetNetworkResponse> {
    return await this.request<TStellarConnectorGetNetworkResponse>({
      method: "stellar_getNetwork",
    });
  }
}
