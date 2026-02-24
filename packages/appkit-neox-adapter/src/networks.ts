import {
  neoxMainnet,
  neoxT4,
  type AppKitNetwork,
} from "@reown/appkit/networks";

export const neoXMainnetNetwork: AppKitNetwork = {
  ...neoxMainnet,
  contracts: {
    governance: { address: "0x1212000000000000000000000000000000000001" },
    governanceReward: { address: "0x1212000000000000000000000000000000000003" },
    keyManagement: { address: "0x1212000000000000000000000000000000000008" },
  },
};

export const neoXTestnetNetwork: AppKitNetwork = {
  ...neoxT4,
  contracts: {
    governance: { address: "0x1212000000000000000000000000000000000001" },
    governanceReward: { address: "0x1212000000000000000000000000000000000003" },
    keyManagement: { address: "0x1212000000000000000000000000000000000008" },
  },
};

export const neoXAntiMevMainnetNetwork: AppKitNetwork = {
  ...neoXMainnetNetwork,
  rpcUrls: {
    default: {
      http: ["https://mainnet-5.rpc.banelabs.org"],
    },
  },
};

export const neoXAntiMevTestnetNetwork: AppKitNetwork = {
  ...neoXTestnetNetwork,

  rpcUrls: {
    default: {
      http: ["https://neoxt4seed5.ngd.network"],
    },
  },
};
