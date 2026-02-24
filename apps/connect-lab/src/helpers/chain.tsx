import { type ComponentType, type SVGProps } from "react";

import Neo3Icon from "@/assets/icons/neo3.svg?react";
import EthereumIcon from "@/assets/icons/ethereum.svg?react";
import ArbitrumIcon from "@/assets/icons/arbitrum.svg?react";
import BaseIcon from "@/assets/icons/base.svg?react";
import NeoxIcon from "@/assets/icons/neox.svg?react";
import PolygonIcon from "@/assets/icons/polygon.svg?react";
import SolanaIcon from "@/assets/icons/solana.svg?react";
import StellarIcon from "@/assets/icons/stellar.svg?react";

import {
  arbitrum,
  base,
  mainnet,
  polygon,
  sepolia,
  solana,
  solanaDevnet,
  type AppKitNetwork,
  type ChainNamespace,
} from "@reown/appkit/networks";
import {
  neo3MainnetNetwork,
  neo3TestnetNetwork,
} from "@cityofzion/appkit-neo3-adapter";
import {
  stellarMainnetNetwork,
  stellarTestnetNetwork,
} from "@cityofzion/appkit-stellar-adapter";
import {
  neoXAntiMevMainnetNetwork,
  neoXAntiMevTestnetNetwork,
} from "@cityofzion/appkit-neox-adapter";

export type TSupportedChain = (typeof ChainHelper.supportedChains)[number];

export class ChainHelper {
  static readonly supportedChains = [
    "neo3",
    "ethereum",
    "arbitrum",
    "base",
    "neox",
    "polygon",
    "solana",
    "stellar",
  ] as const;

  static readonly iconsByChain: Record<
    TSupportedChain,
    ComponentType<SVGProps<SVGSVGElement>>
  > = {
    neo3: Neo3Icon,
    ethereum: EthereumIcon,
    arbitrum: ArbitrumIcon,
    base: BaseIcon,
    neox: NeoxIcon,
    polygon: PolygonIcon,
    solana: SolanaIcon,
    stellar: StellarIcon,
  };

  static readonly colorsByChain: Record<TSupportedChain, string> = {
    neo3: "#16a34a",
    ethereum: "#2563eb",
    arbitrum: "#2563eb",
    base: "#1d4ed8",
    neox: "#10b981",
    polygon: "#9333ea",
    solana: "#6366f1",
    stellar: "#fcd34d",
  };

  static readonly namespaceByChain: Record<TSupportedChain, ChainNamespace> = {
    //@ts-expect-error ChainNamespace does not include neo3
    neo3: "neo3",
    ethereum: "eip155",
    arbitrum: "eip155",
    base: "eip155",
    neox: "eip155",
    polygon: "eip155",
    solana: "solana",
    //@ts-expect-error ChainNamespace does not include stellar
    stellar: "stellar",
  };

  static readonly networksByChain: Record<TSupportedChain, AppKitNetwork[]> = {
    ethereum: [mainnet, sepolia],
    arbitrum: [arbitrum],
    base: [base],
    polygon: [polygon],
    neo3: [neo3MainnetNetwork, neo3TestnetNetwork],
    // TODO: Fix that
    neox: [neoXAntiMevMainnetNetwork, neoXAntiMevTestnetNetwork],
    solana: [solana, solanaDevnet],
    stellar: [stellarMainnetNetwork, stellarTestnetNetwork],
  };
}
