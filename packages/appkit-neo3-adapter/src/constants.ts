export class Neo3Constants {
  static readonly GAS_TOKEN = {
    symbol: "GAS",
    name: "GAS",
    hash: "0xd2a4cff31913016155e38e474a2c06d08be276cf",
    decimals: 8,
  } as const;

  static readonly METHODS: string[] = [
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

  static readonly EVENTS: string[] = [];

  static readonly OVERRIDES: {
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
