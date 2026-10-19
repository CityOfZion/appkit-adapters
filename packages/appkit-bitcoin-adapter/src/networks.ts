import { type AppKitNetwork } from "@reown/appkit/networks";
import { BitcoinConstants } from "./constants.js";

export const bitcoinMainnetNetwork: AppKitNetwork = {
  id: BitcoinConstants.MAINNET_CHAIN_ID,
  name: "Bitcoin Mainnet",
  chainNamespace: "bip122",
  caipNetworkId: `bip122:${BitcoinConstants.MAINNET_CHAIN_ID}`,
  nativeCurrency: BitcoinConstants.BTC_TOKEN,
  rpcUrls: {
    default: { http: ["https://rpc.walletconnect.org/v1"] },
  },
};

export const bitcoinTestnetNetwork: AppKitNetwork = {
  id: BitcoinConstants.TESTNET_CHAIN_ID,
  name: "Bitcoin Testnet",
  chainNamespace: "bip122",
  caipNetworkId: `bip122:${BitcoinConstants.TESTNET_CHAIN_ID}`,
  nativeCurrency: BitcoinConstants.BTC_TOKEN,
  rpcUrls: {
    default: { http: ["https://rpc.walletconnect.org/v1"] },
  },
  testnet: true,
};
