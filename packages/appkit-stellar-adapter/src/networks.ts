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
      http: [
        "https://stellar-mainnet.liquify.com/api=41EEWAH79Y5OCGI7/mainnet",
      ],
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
      http: ["https://stellar.liquify.com/api=41EEWAH79Y5OCGI7/testnet"],
    },
  },

  name: "Stellar Testnet",

  testnet: true,
};
