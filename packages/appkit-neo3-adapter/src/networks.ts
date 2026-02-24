import { type AppKitNetwork } from "@reown/appkit/networks";
import { Neo3Constants } from "./constants.js";

export const neo3MainnetNetwork: AppKitNetwork = {
  id: "mainnet",

  // @ts-expect-error AppKit does not neo3 namespace included in ChainNamespace
  caipNetworkId: "neo3:mainnet",

  // @ts-expect-error AppKit does not neo3 namespace included in ChainNamespace
  chainNamespace: "neo3",

  nativeCurrency: Neo3Constants.GAS_TOKEN,

  rpcUrls: {
    default: { http: ["https://mainnet1.neo.coz.io:443"] },
  },

  name: "Neo Mainnet",
};

export const neo3TestnetNetwork: AppKitNetwork = {
  id: "testnet",

  // @ts-expect-error AppKit does not neo3 namespace included in ChainNamespace
  caipNetworkId: "neo3:testnet",

  // @ts-expect-error AppKit does not neo3 namespace included in ChainNamespace
  chainNamespace: "neo3",

  nativeCurrency: Neo3Constants.GAS_TOKEN,

  rpcUrls: {
    default: { http: ["https://testnet1.neo.coz.io:443"] },
  },

  name: "Neo Testnet",

  testnet: true,
};
