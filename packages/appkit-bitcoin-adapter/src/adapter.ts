import {
  AdapterBlueprint,
  CoreHelperUtil,
  WcHelpersUtil,
} from "@reown/appkit-controllers";
import type UniversalProvider from "@walletconnect/universal-provider";
import type { ChainNamespace } from "@reown/appkit/networks";
import { BitcoinConstants } from "./constants.js";
import { BitcoinConnector } from "./connector.js";
import {
  ConstantsUtil as CommonConstantsUtil,
  UserRejectedRequestError,
} from "@reown/appkit-common";

export class BitcoinAdapter extends AdapterBlueprint {
  constructor(params: AdapterBlueprint.Params = {}) {
    super({
      adapterType: "bitcoin",
      namespace: "bip122",
      ...params,
    });
  }

  public override async setUniversalProvider(
    universalProvider: UniversalProvider,
  ): Promise<void> {
    if (!this.namespace) {
      throw new Error(
        "BitcoinAdapter:setUniversalProvider - Namespace is not defined.",
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
      new BitcoinConnector({
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
      | BitcoinConnector
      | undefined;

    if (!connector || !connector.provider) {
      throw new Error("BitcoinAdapter:connect - connector is undefined");
    }

    const chain =
      connector.chains.find((c) => c.id === params.chainId) ||
      connector.chains[0];

    if (!chain) {
      throw new Error(
        "BitcoinAdapter:connect - The connector does not support any of the requested chains",
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

    const address = await connector.connect().catch((error: any) => {
      throw new UserRejectedRequestError(error);
    });

    this.emit("accountChanged", { address, chainId: chain.id, connector });

    const accounts = await this.getAccounts({
      id: connector.id,
      namespace: this.namespace!,
    });

    this.addConnection({
      connectorId: connector.id,
      accounts: accounts.accounts.map((account) => ({
        address: account.address,
        type: account.type,
        publicKey: account.publicKey!,
        path: account.path,
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
        (connector) => connector.id.toLowerCase() === params.id?.toLowerCase(),
      );

      if (!connector?.provider) {
        throw new Error(
          "BitcoinAdapter:disconnect - connector.provider is undefined",
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
          (connector) =>
            connector.id.toLowerCase() === connection.connectorId.toLowerCase(),
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
        CoreHelperUtil.createAccount(namespace, address, "payment"),
      ),
    });
  }

  public override getWalletConnectProvider() {
    return this.connectors.find(
      (connector) => connector.type === "WALLET_CONNECT",
    ) as BitcoinConnector;
  }

  public override async getBalance(
    params: AdapterBlueprint.GetBalanceParams,
  ): Promise<AdapterBlueprint.GetBalanceResult> {
    const { address, chainId } = params;

    const mempoolUrl = chainId
      ? BitcoinConstants.MEMPOOL_API_URL_BY_ID[chainId]
      : undefined;

    if (!address || !mempoolUrl) {
      return {
        balance: "0",
        symbol: BitcoinConstants.BTC_TOKEN.symbol,
      };
    }

    let balance = BigInt(0);

    try {
      const response = await fetch(`${mempoolUrl}/address/${address}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      const data = await response.json();
      const chainStats = data?.chain_stats;
      const mempoolStats = data?.mempool_stats;

      balance =
        BigInt(chainStats?.funded_txo_sum || 0) -
        BigInt(chainStats?.spent_txo_sum || 0) +
        BigInt(mempoolStats?.funded_txo_sum || 0) -
        BigInt(mempoolStats?.spent_txo_sum || 0);
    } catch {
      /* empty */
    }

    return {
      symbol: BitcoinConstants.BTC_TOKEN.symbol,
      balance: this.formatUnits({
        value: balance,
        decimals: BitcoinConstants.BTC_TOKEN.decimals,
      }),
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

    const fractionalPartString = fractionalPart
      .toString()
      .padStart(decimals, "0")
      .replace(/0+$/, "");

    return fractionalPartString
      ? `${integerPart.toString()}.${fractionalPartString}`
      : integerPart.toString();
  }

  public override syncConnections() {
    return Promise.resolve();
  }

  public override syncConnectors() {
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
    throw new Error("BitcoinAdapter:writeSolanaTransaction - Not supported.");
  }

  public override signMessage(
    _params: AdapterBlueprint.SignMessageParams,
  ): Promise<AdapterBlueprint.SignMessageResult> {
    throw new Error("BitcoinAdapter:signMessage - Not supported.");
  }

  public override estimateGas(): Promise<AdapterBlueprint.EstimateGasTransactionResult> {
    throw new Error("BitcoinAdapter:estimateGas - Not supported.");
  }

  public override sendTransaction(): Promise<AdapterBlueprint.SendTransactionResult> {
    throw new Error("BitcoinAdapter:sendTransaction - Not supported.");
  }

  public override walletGetAssets(
    _params: AdapterBlueprint.WalletGetAssetsParams,
  ): Promise<AdapterBlueprint.WalletGetAssetsResponse> {
    throw new Error("BitcoinAdapter:walletGetAssets - Not supported.");
  }

  public override writeContract(): Promise<AdapterBlueprint.WriteContractResult> {
    throw new Error("BitcoinAdapter:writeContract - Not supported.");
  }

  public override getCapabilities(): Promise<unknown> {
    throw new Error("BitcoinAdapter:getCapabilities - Not supported.");
  }

  public override grantPermissions(): Promise<unknown> {
    throw new Error("BitcoinAdapter:grantPermissions - Not supported.");
  }

  public override revokePermissions(): Promise<`0x${string}`> {
    throw new Error("BitcoinAdapter:revokePermissions - Not supported.");
  }
}
