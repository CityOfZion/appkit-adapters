import { arbitrum, base, mainnet, polygon, sepolia, solana, solanaDevnet } from '@reown/appkit/networks'
import { neo3MainnetNetwork, neo3TestnetNetwork } from '@cityofzion/appkit-neo3-adapter'
import { stellarMainnetNetwork, stellarTestnetNetwork } from '@cityofzion/appkit-stellar-adapter'
import { neoXAntiMevMainnetNetwork, neoXAntiMevTestnetNetwork } from '@cityofzion/appkit-neox-adapter'
import type { AppKitNetwork, ChainNamespace } from '@reown/appkit/networks'
import type { ComponentType, SVGProps } from 'react'

import Neo3Icon from '@/assets/icons/neo3.svg?react'
import EthereumIcon from '@/assets/icons/ethereum.svg?react'
import ArbitrumIcon from '@/assets/icons/arbitrum.svg?react'
import BaseIcon from '@/assets/icons/base.svg?react'
import NeoxIcon from '@/assets/icons/neox.svg?react'
import PolygonIcon from '@/assets/icons/polygon.svg?react'
import SolanaIcon from '@/assets/icons/solana.svg?react'
import StellarIcon from '@/assets/icons/stellar.svg?react'

export type TSupportedChain = (typeof ChainHelper.supportedChains)[number]

export class ChainHelper {
  static readonly supportedChains = [
    'neo3',
    'ethereum',
    'arbitrum',
    'base',
    'neox',
    'polygon',
    'solana',
    'stellar',
  ] as const

  static readonly iconsByChain: Record<TSupportedChain, ComponentType<SVGProps<SVGSVGElement>>> = {
    neo3: Neo3Icon,
    ethereum: EthereumIcon,
    arbitrum: ArbitrumIcon,
    base: BaseIcon,
    neox: NeoxIcon,
    polygon: PolygonIcon,
    solana: SolanaIcon,
    stellar: StellarIcon,
  }

  static readonly colorsByChain: Record<TSupportedChain, string> = {
    neo3: '#16a34a',
    ethereum: '#627eea',
    arbitrum: '#28a0f0',
    base: '#1d4ed8',
    neox: '#10b981',
    polygon: '#9333ea',
    solana: '#6366f1',
    stellar: '#fcd34d',
  }

  static readonly addressExplorerUrlsByChain: Record<TSupportedChain, Record<string, string>> = {
    neo3: {
      mainnet: 'https://dora.coz.io/address/neo3/mainnet/{address}',
      testnet: 'https://dora.coz.io/address/neo3/testnet/{address}',
    },
    ethereum: {
      1: 'https://eth.blockscout.com/address/{address}',
      11_155_111: 'https://eth-sepolia.blockscout.com/address/{address}',
    },
    arbitrum: {
      42_161: 'https://arbitrum.blockscout.com/address/{address}',
    },
    base: {
      8_453: 'https://base.blockscout.com/address/{address}',
    },
    polygon: {
      137: 'https://polygon.blockscout.com/address/{address}',
    },
    neox: {
      47_763: 'https://xexplorer.neo.org/address/{address}',
      12_227_332: 'https://xt4scan.ngd.network/address/{address}',
    },
    solana: {
      '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': 'https://solscan.io/account/{address}',
      EtWTRABZaYq6iMfeYKouRu166VU2xqa1: 'https://solscan.io/account/{address}?cluster=devnet',
    },
    stellar: {
      mainnet: 'https://stellarchain.io/accounts/{address}',
      testnet: 'https://testnet.stellarchain.io/accounts/{address}',
    },
  }

  static readonly namespaceByChain: Record<TSupportedChain, ChainNamespace> = {
    // @ts-expect-error ChainNamespace does not include neo3
    neo3: 'neo3',
    ethereum: 'eip155',
    arbitrum: 'eip155',
    base: 'eip155',
    neox: 'eip155',
    polygon: 'eip155',
    solana: 'solana',
    // @ts-expect-error ChainNamespace does not include stellar
    stellar: 'stellar',
  }

  static readonly networksByChain: Record<TSupportedChain, Array<AppKitNetwork>> = {
    ethereum: [mainnet, sepolia],
    arbitrum: [arbitrum],
    base: [base],
    polygon: [polygon],
    neo3: [neo3MainnetNetwork, neo3TestnetNetwork],
    neox: [neoXAntiMevMainnetNetwork, neoXAntiMevTestnetNetwork],
    solana: [solana, solanaDevnet],
    stellar: [stellarMainnetNetwork, stellarTestnetNetwork],
  }
}
