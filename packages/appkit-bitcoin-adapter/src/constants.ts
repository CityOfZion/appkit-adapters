export class BitcoinConstants {
  static readonly BTC_TOKEN = {
    symbol: "BTC",
    name: "Bitcoin",
    decimals: 8,
  } as const;

  static readonly MAINNET_CHAIN_ID = "000000000019d6689c085ae165831e93";
  static readonly TESTNET_CHAIN_ID = "000000000933ea01ad0ee984209779ba";

  static readonly MEMPOOL_API_URL_BY_ID: Record<string, string> = {
    [BitcoinConstants.MAINNET_CHAIN_ID]: "https://mempool.space/api",
    [BitcoinConstants.TESTNET_CHAIN_ID]: "https://mempool.space/testnet/api",
  };

  static readonly METHODS: string[] = [
    "getAccountAddresses",
    "signMessage",
    "signPsbt",
    "sendTransfer",
  ];

  static readonly EVENTS: string[] = [
    "accountsChanged",
    "chainChanged",
    "bip122_addressesChanged",
  ];

  static readonly OVERRIDES: {
    methods?: Record<string, string[]>;
    chains?: Record<string, string[]>;
    events?: Record<string, string[]>;
    rpcMap?: Record<string, string>;
  } = {
    methods: {
      bip122: BitcoinConstants.METHODS,
    },
    events: {
      bip122: BitcoinConstants.EVENTS,
    },
  };
}
