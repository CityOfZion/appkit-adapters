export class Neo3Constants {
  static GAS_TOKEN = {
    symbol: "GAS",
    name: "GAS",
    hash: "0xd2a4cff31913016155e38e474a2c06d08be276cf",
    decimals: 8,
  } as const;

  static METHODS: string[] = [
    "invokeFunction",
    "testInvoke",
    "signMessage",
    "verifyMessage",
    "getWalletInfo",
    "encrypt",
    "decrypt",
    "decryptFromArray",
    "calculateFee",
    "signTransaction",
  ];

  static EVENTS: string[] = [];

  static OVERRIDES: {
    methods?: Record<string, string[]>;
    chains?: Record<string, string[]>;
    events?: Record<string, string[]>;
    rpcMap?: Record<string, string>;
  } = {
    methods: {
      neo3: this.METHODS,
    },
    events: {
      neo3: this.EVENTS,
    },
  };
}
