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

export type TSupportedChain = 'neo3' | 'ethereum' | 'arbitrum' | 'base' | 'polygon' | 'neox' | 'solana' | 'stellar'

export class ChainHelper {
  static readonly chainInfos: Record<
    TSupportedChain,
    {
      name: string
      addressUrlTemplate: Record<string, string>
      color: string
      icon: ComponentType<SVGProps<SVGSVGElement>>
      namespace: ChainNamespace
      networks: Array<AppKitNetwork>
    }
  > = {
    neo3: {
      name: 'Neo N3',
      color: '#16a34a',
      icon: Neo3Icon,
      // @ts-expect-error ChainNamespace does not include neo3
      namespace: 'neo3',
      networks: [neo3MainnetNetwork, neo3TestnetNetwork],
      addressUrlTemplate: {
        mainnet: 'https://dora.coz.io/address/neo3/mainnet/{address}',
        testnet: 'https://dora.coz.io/address/neo3/testnet/{address}',
      },
    },
    neox: {
      name: 'Neo X',
      color: '#10b981',
      icon: NeoxIcon,
      namespace: 'eip155',
      networks: [neoXAntiMevMainnetNetwork, neoXAntiMevTestnetNetwork],
      addressUrlTemplate: {
        47_763: 'https://xexplorer.neo.org/address/{address}',
        12_227_332: 'https://xt4scan.ngd.network/address/{address}',
      },
    },
    ethereum: {
      name: 'Ethereum',
      color: '#627eea',
      icon: EthereumIcon,
      namespace: 'eip155',
      networks: [mainnet, sepolia],
      addressUrlTemplate: {
        1: 'https://eth.blockscout.com/address/{address}',
        11_155_111: 'https://eth-sepolia.blockscout.com/address/{address}',
      },
    },
    arbitrum: {
      name: 'Arbitrum',
      color: '#28a0f0',
      icon: ArbitrumIcon,
      namespace: 'eip155',
      networks: [arbitrum],
      addressUrlTemplate: {
        42_161: 'https://arbitrum.blockscout.com/address/{address}',
      },
    },
    base: {
      name: 'Base',
      color: '#1d4ed8',
      icon: BaseIcon,
      namespace: 'eip155',
      networks: [base],
      addressUrlTemplate: {
        8_453: 'https://base.blockscout.com/address/{address}',
      },
    },
    polygon: {
      name: 'Polygon',
      color: '#9333ea',
      icon: PolygonIcon,
      namespace: 'eip155',
      networks: [polygon],
      addressUrlTemplate: {
        137: 'https://polygon.blockscout.com/address/{address}',
      },
    },

    solana: {
      name: 'Solana',
      color: '#6366f1',
      icon: SolanaIcon,
      namespace: 'solana',
      networks: [solana, solanaDevnet],
      addressUrlTemplate: {
        '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': 'https://solscan.io/account/{address}',
        EtWTRABZaYq6iMfeYKouRu166VU2xqa1: 'https://solscan.io/account/{address}?cluster=devnet',
      },
    },
    stellar: {
      name: 'Stellar',
      color: '#fcd34d',
      icon: StellarIcon,
      // @ts-expect-error ChainNamespace does not include stellar
      namespace: 'stellar',
      networks: [stellarMainnetNetwork, stellarTestnetNetwork],
      addressUrlTemplate: {
        mainnet: 'https://stellarchain.io/accounts/{address}',
        testnet: 'https://testnet.stellarchain.io/accounts/{address}',
      },
    },
  }

  static readonly supportedChains = Object.keys(ChainHelper.chainInfos) as Array<TSupportedChain>
}
