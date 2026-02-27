import { type AppKitNetwork } from "@reown/appkit/networks";
import { StellarConstants } from "./constants.js";

export const stellarMainnetNetwork: AppKitNetwork = {
  id: "pubnet",

  // @ts-expect-error AppKit does not stellar namespace included in ChainNamespace
  caipNetworkId: "stellar:pubnet",

  // @ts-expect-error AppKit does not stellar namespace included in ChainNamespace
  chainNamespace: "stellar",

  nativeCurrency: StellarConstants.XLM_TOKEN,

  rpcUrls: {
    default: {
      http: ["https://soroban-rpc.mainnet.stellar.gateway.fm/"],
    },
  },

  name: "Stellar Mainnet",
};

export const stellarTestnetNetwork: AppKitNetwork = {
  id: "testnet",

  // @ts-expect-error AppKit does not stellar namespace included in ChainNamespace
  caipNetworkId: "stellar:testnet",

  // @ts-expect-error AppKit does not stellar namespace included in ChainNamespace
  chainNamespace: "stellar",

  nativeCurrency: StellarConstants.XLM_TOKEN,

  rpcUrls: {
    default: {
      http: ["https://soroban-rpc.testnet.stellar.gateway.fm/"],
    },
  },

  name: "Stellar Testnet",

  testnet: true,
};
