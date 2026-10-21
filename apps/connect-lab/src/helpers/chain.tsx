import {
  arbitrum,
  avalanche,
  base,
  bsc,
  celo,
  cronos,
  fantom,
  linea,
  mainnet,
  optimism,
  polygon,
  polygonAmoy,
  polygonZkEvm,
  sepolia,
  solana,
  solanaDevnet,
} from '@reown/appkit/networks'
import { neo3MainnetNetwork, neo3TestnetNetwork } from '@cityofzion/appkit-neo3-adapter'
import { stellarMainnetNetwork, stellarTestnetNetwork } from '@cityofzion/appkit-stellar-adapter'
import {
  neoXAntiMevMainnetNetwork,
  neoXAntiMevTestnetNetwork,
  neoXMainnetNetwork,
  neoXTestnetNetwork,
} from '@cityofzion/appkit-neox-adapter'
import { BitcoinConstants, bitcoinMainnetNetwork, bitcoinTestnetNetwork } from '@cityofzion/appkit-bitcoin-adapter'
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
import BitcoinIcon from '@/assets/icons/bitcoin.svg?react'

export type TSupportedChain =
  | 'neo3'
  | 'ethereum'
  | 'arbitrum'
  | 'base'
  | 'polygon'
  | 'neox'
  | 'solana'
  | 'stellar'
  | 'bitcoin'

const NEOX_ANTI_MEV_STORAGE_KEY = 'connect-lab:is-neox-anti-mev'

export class ChainHelper {
  static readonly chainInfos: Record<
    TSupportedChain,
    {
      name: string
      addressUrlTemplate: Record<string, string | undefined>
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
      networks: ChainHelper.getIsNeoXAntiMev()
        ? [neoXAntiMevMainnetNetwork, neoXAntiMevTestnetNetwork]
        : [neoXMainnetNetwork, neoXTestnetNetwork],
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
      networks: [mainnet, sepolia, optimism, cronos, bsc, fantom, celo, avalanche, linea, polygonZkEvm],
      addressUrlTemplate: {
        1: 'https://eth.blockscout.com/address/{address}',
        11_155_111: 'https://eth-sepolia.blockscout.com/address/{address}',
        10: 'https://optimism.blockscout.com/address/{address}',
        25: 'https://explorer.cronos.org/address/{address}',
        56: 'https://bscscan.com/address/{address}',
        250: 'https://blockchair.com/fantom/address/{address}',
        42_220: 'https://celo.blockscout.com/address/{address}',
        43_114: 'https://snowtrace.io/address/{address}',
        59_144: 'https://explorer.linea.build/address/{address}',
        1_101: 'https://blockchair.com/polygon-zkevm/address/{address}',
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
      networks: [polygon, polygonAmoy],
      addressUrlTemplate: {
        137: 'https://polygon.blockscout.com/address/{address}',
        80_002: 'https://amoy.polygonscan.com/address/{address}',
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
        pubnet: 'https://stellarchain.io/accounts/{address}',
        testnet: 'https://testnet.stellarchain.io/accounts/{address}',
      },
    },
    bitcoin: {
      name: 'Bitcoin',
      color: '#f7931a',
      icon: BitcoinIcon,
      namespace: 'bip122',
      networks: [bitcoinMainnetNetwork, bitcoinTestnetNetwork],
      addressUrlTemplate: {
        [BitcoinConstants.MAINNET_CHAIN_ID]: 'https://mempool.space/address/{address}',
        [BitcoinConstants.TESTNET_CHAIN_ID]: 'https://mempool.space/testnet/address/{address}',
      },
    },
  }

  static readonly supportedChains = Object.keys(ChainHelper.chainInfos) as Array<TSupportedChain>

  static getIsNeoXAntiMev() {
    try {
      return localStorage.getItem(NEOX_ANTI_MEV_STORAGE_KEY) !== 'false'
    } catch {
      return true
    }
  }

  static setIsNeoXAntiMev(isAntiMev: boolean) {
    try {
      localStorage.setItem(NEOX_ANTI_MEV_STORAGE_KEY, String(isAntiMev))
      window.location.reload()
    } catch {
      return
    }
  }
}
