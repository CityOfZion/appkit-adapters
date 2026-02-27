export class StellarConstants {
  static readonly XLM_TOKEN = {
    symbol: "XLM",
    name: "Lumens",
    decimals: 7,
  } as const;

  static readonly HORIZON_URL_BY_ID: Record<string, string> = {
    pubnet: "https://horizon.stellar.org",
    testnet: "https://horizon-testnet.stellar.org",
  };

  static readonly METHODS: string[] = [
    "stellar_signXDR",
    "stellar_signAndSubmitXDR",
    "stellar_signMessage",
    "stellar_signAuthEntry",
    "stellar_getNetwork",
  ];

  static readonly EVENTS: string[] = [];

  static readonly OVERRIDES: {
    methods?: Record<string, string[]>;
    chains?: Record<string, string[]>;
    events?: Record<string, string[]>;
    rpcMap?: Record<string, string>;
  } = {
    methods: {
      stellar: this.METHODS,
    },
    events: {
      stellar: this.EVENTS,
    },
  };
}
