import {
  AdapterBlueprint,
  CoreHelperUtil,
  WcHelpersUtil,
} from "@reown/appkit-controllers";
import type UniversalProvider from "@walletconnect/universal-provider";
import type { ChainNamespace } from "@reown/appkit/networks";
import { Neo3Constants } from "./constants.js";
import { Neo3Connector } from "./connector.js";
import {
  ConstantsUtil as CommonConstantsUtil,
  UserRejectedRequestError,
} from "@reown/appkit-common";

export class Neo3Adapter extends AdapterBlueprint {
  constructor(params: AdapterBlueprint.Params = {}) {
    super({
      adapterType: "neo3",
      // @ts-expect-error AppKit does not neo3 namespace included in ChainNamespace
      namespace: "neo3",
      ...params,
    });
  }

  public override async setUniversalProvider(
    universalProvider: UniversalProvider,
  ): Promise<void> {
    if (!this.namespace) {
      throw new Error(
        "Neo3Adapter:setUniversalProvider - Namespace is not defined.",
      );
    }

    const wcConnectorId = CommonConstantsUtil.CONNECTOR_ID.WALLET_CONNECT;

    WcHelpersUtil.listenWcProvider({
      universalProvider,
      namespace: this.namespace,
      onConnect: (accounts) => this.onConnect(accounts, wcConnectorId),
      onDisconnect: () => this.onDisconnect(wcConnectorId),
      onAccountsChanged: (accounts) =>
        super.onAccountsChanged(accounts, wcConnectorId, false),
    });

    this.addConnector(
      new Neo3Connector({
        provider: universalProvider,
        caipNetworks: this.getCaipNetworks(),
        namespace: this.namespace,
      }),
    );

    return Promise.resolve();
  }

  override async connect(
    params: AdapterBlueprint.ConnectParams,
  ): Promise<AdapterBlueprint.ConnectResult> {
    const connector = this.connectors.find((c) => c.id === params.id) as
      | Neo3Connector
      | undefined;

    if (!connector || !connector.provider) {
      throw new Error("Neo3Adapter:connect - connector is undefined");
    }

    const chain =
      connector.chains.find((c) => c.id === params.chainId) ||
      connector.chains[0];

    if (!chain) {
      throw new Error(
        "Neo3Adapter:connect - The connector does not support any of the requested chains",
      );
    }

    if (params.address) {
      const connection = this.getConnection({
        address: params.address,
        connectorId: connector.id,
        connections: this.connections,
        connectors: this.connectors,
      });

      if (connection?.account && connection.caipNetwork) {
        this.emit("accountChanged", {
          address: connection.account.address,
          chainId: connection.caipNetwork.id,
          connector,
        });

        return {
          id: connector.id,
          type: connector.type,
          address: connection.account.address,
          chainId: chain.id,
          provider: connector.provider,
        };
      }
    }

    const address = await connector.connect().catch((err: any) => {
      throw new UserRejectedRequestError(err);
    });

    this.emit("accountChanged", {
      address,
      chainId: chain.id,
      connector,
    });

    const accounts = await this.getAccounts({
      id: connector.id,
      namespace: this.namespace!,
    });

    this.addConnection({
      connectorId: connector.id,
      accounts: accounts.accounts.map((a) => ({
        address: a.address,
        type: a.type,
        publicKey: a.publicKey!,
        path: a.path,
      })),
      caipNetwork: chain,
    });

    return {
      id: connector.id,
      type: connector.type,
      address,
      chainId: chain.id,
      provider: connector.provider,
    };
  }

  public override async disconnect(
    params: AdapterBlueprint.DisconnectParams,
  ): Promise<AdapterBlueprint.DisconnectResult> {
    if (params.id) {
      const connector = this.connectors.find(
        (c) => c.id.toLowerCase() === params.id?.toLowerCase(),
      );

      if (!connector?.provider) {
        throw new Error(
          "StellarAdapter:disconnect - connector.provider is undefined",
        );
      }

      const connection = this.getConnection({
        connectorId: params.id,
        connections: this.connections,
        connectors: this.connectors,
      });

      await connector.provider.disconnect();

      this.removeProviderListeners(connector.id);
      this.deleteConnection(connector.id);

      if (this.connections.length === 0) {
        this.emit("disconnect");
      } else {
        this.emitFirstAvailableConnection();
      }

      return { connections: connection ? [connection] : [] };
    }

    return this.disconnectAll();
  }

  private async disconnectAll(): Promise<AdapterBlueprint.DisconnectResult> {
    const connections = await Promise.all(
      this.connections.map(async (connection) => {
        const connector = this.connectors.find(
          (c) => c.id.toLowerCase() === connection.connectorId.toLowerCase(),
        );

        if (!connector) {
          throw new Error("Connector not found");
        }

        await this.disconnect({
          id: connector.id,
        });

        return connection;
      }),
    );

    return { connections };
  }

  public override async getAccounts({
    namespace,
  }: AdapterBlueprint.GetAccountsParams & {
    namespace: ChainNamespace;
  }): Promise<AdapterBlueprint.GetAccountsResult> {
    const provider = this.provider as UniversalProvider;
    const addresses =
      provider.session?.namespaces[namespace]?.accounts
        .map((account) => {
          const [, , address] = account.split(":");
          return address;
        })
        .filter(
          (address, index, self): address is string =>
            self.indexOf(address) === index,
        ) || [];

    return Promise.resolve({
      accounts: addresses.map((address) =>
        CoreHelperUtil.createAccount(namespace, address, "eoa"),
      ),
    });
  }

  public override getWalletConnectProvider() {
    return this.connectors.find(
      (c) => c.type === "WALLET_CONNECT",
    ) as Neo3Connector;
  }

  public override async getBalance(
    params: AdapterBlueprint.GetBalanceParams,
  ): Promise<AdapterBlueprint.GetBalanceResult> {
    const { address, caipNetwork } = params;

    const rpcUrl = caipNetwork?.rpcUrls.default.http[0];

    if (!address || !rpcUrl) {
      return {
        balance: "0",
        symbol: Neo3Constants.GAS_TOKEN.symbol,
      };
    }

    let balances: any[] = [];

    try {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "getnep17balances",
          params: [address],
          id: 1,
        }),
      });

      const data = await response.json();
      balances = data.result?.balance || [];
    } catch {
      /* empty */
    }

    const gasBalanceObj = balances.find(
      (balanceObj: any) =>
        balanceObj.assethash === Neo3Constants.GAS_TOKEN.hash,
    );

    const balance = gasBalanceObj ? gasBalanceObj.amount : "0";

    return {
      balance: this.formatUnits({
        value: balance,
        decimals: Neo3Constants.GAS_TOKEN.decimals,
      }),
      symbol: Neo3Constants.GAS_TOKEN.symbol,
    };
  }

  public override parseUnits(
    params: AdapterBlueprint.ParseUnitsParams,
  ): AdapterBlueprint.ParseUnitsResult {
    const { value, decimals } = params;
    const [integerPart, fractionalPart = ""] = value.split(".");
    const paddedFractionalPart = fractionalPart
      .padEnd(decimals, "0")
      .slice(0, decimals);
    const combined = integerPart + paddedFractionalPart;
    return BigInt(combined);
  }

  public override formatUnits(
    params: AdapterBlueprint.FormatUnitsParams,
  ): AdapterBlueprint.FormatUnitsResult {
    const { value, decimals } = params;
    const divisor = BigInt(10) ** BigInt(decimals);
    const integerPart = BigInt(value) / divisor;
    const fractionalPart = BigInt(value) % divisor;

    const fractionalPartStr = fractionalPart
      .toString()
      .padStart(decimals, "0")
      .replace(/0+$/, ""); // Remove trailing zeros

    return fractionalPartStr
      ? `${integerPart.toString()}.${fractionalPartStr}`
      : integerPart.toString();
  }

  public override syncConnections() {
    // It should return an promises even if nothing is done here. It should not throw an error because it is called on appkit connect flow
    return Promise.resolve();
  }

  public override syncConnectors() {
    // It should return an promises even if nothing is done here. It should not throw an error because it is called on appkit connect flow
    return Promise.resolve();
  }

  public override async syncConnection() {
    return Promise.resolve({
      id: "WALLET_CONNECT",
      type: "WALLET_CONNECT" as const,
      chainId: 1,
      provider: this.provider as unknown as UniversalProvider,
      address: "",
    });
  }

  public override writeSolanaTransaction(): Promise<AdapterBlueprint.WriteSolanaTransactionResult> {
    throw new Error("Neo3Adapter:writeContract - Not supported.");
  }

  public override signMessage(
    _params: AdapterBlueprint.SignMessageParams,
  ): Promise<AdapterBlueprint.SignMessageResult> {
    throw new Error("Neo3Adapter:signMessage - Not supported.");
  }

  public override estimateGas(): Promise<AdapterBlueprint.EstimateGasTransactionResult> {
    throw new Error("Neo3Adapter:estimateGas - Not supported.");
  }

  public override sendTransaction(): Promise<AdapterBlueprint.SendTransactionResult> {
    throw new Error("Neo3Adapter:sendTransaction - Not supported.");
  }

  public override walletGetAssets(
    _params: AdapterBlueprint.WalletGetAssetsParams,
  ): Promise<AdapterBlueprint.WalletGetAssetsResponse> {
    throw new Error("Neo3Adapter:walletGetAssets - Not supported.");
  }

  public override writeContract(): Promise<AdapterBlueprint.WriteContractResult> {
    throw new Error("Neo3Adapter:writeContract - Not supported.");
  }

  public override getCapabilities(): Promise<unknown> {
    throw new Error("Neo3Adapter:getCapabilities - Not supported.");
  }

  public override grantPermissions(): Promise<unknown> {
    throw new Error("Neo3Adapter:grantPermissions - Not supported.");
  }

  public override revokePermissions(): Promise<`0x${string}`> {
    throw new Error("Neo3Adapter:revokePermissions - Not supported.");
  }

  public override switchNetwork(
    _params: AdapterBlueprint.SwitchNetworkParams,
  ): Promise<any> {
    throw new Error("Neo3Adapter:switchNetwork - Not supported.");
  }
}
