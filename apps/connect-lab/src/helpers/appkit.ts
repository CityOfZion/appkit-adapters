import { Neo3Adapter, Neo3Constants } from '@cityofzion/appkit-neo3-adapter'
import { StellarAdapter, StellarConstants } from '@cityofzion/appkit-stellar-adapter'
import { BitcoinAdapter, BitcoinConstants } from '@cityofzion/appkit-bitcoin-adapter'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'
import { ChainHelper } from './chain'
import type { TSupportedChain } from './chain'
import type { AppKitNetwork } from '@reown/appkit/networks'

type TUniversalProviderConfigOverride = {
  methods?: Record<string, Array<string>>
  chains?: Record<string, Array<string>>
  events?: Record<string, Array<string>>
  rpcMap?: Record<string, string>
}

type TAdapter = NonNullable<Parameters<typeof createAppKit>[0]['adapters']>[number]

export class AppKitHelper {
  static readonly projectId = import.meta.env.VITE_PROJECT_ID
  static readonly CHAIN_STORAGE_KEY = 'connect-lab:chain'

  static initializedChain: TSupportedChain | undefined

  static solanaAdapter = new SolanaAdapter()
  static neo3Adapter = new Neo3Adapter()
  static stellarAdapter = new StellarAdapter()
  static bitcoinAdapter = new BitcoinAdapter()
  // One WagmiAdapter per EVM chain: its wagmi config chains must match the networks passed to createAppKit, otherwise
  // the WalletConnect connector sees the session chains as stale on reload (`isChainsStale`) and disconnects it
  static ethereumAdapter = AppKitHelper.createWagmiAdapter('ethereum')
  static arbitrumAdapter = AppKitHelper.createWagmiAdapter('arbitrum')
  static baseAdapter = AppKitHelper.createWagmiAdapter('base')
  static polygonAdapter = AppKitHelper.createWagmiAdapter('polygon')
  static neoxAdapter = AppKitHelper.createWagmiAdapter('neox')

  static createWagmiAdapter(chain: TSupportedChain) {
    return new WagmiAdapter({ projectId: AppKitHelper.projectId, networks: ChainHelper.chainInfos[chain].networks })
  }

  // The WagmiAdapter AppKit was initialized with
  static get eip155Adapter(): WagmiAdapter {
    const adapter = AppKitHelper.initializedChain && AppKitHelper.getAdapter(AppKitHelper.initializedChain).adapter
    if (!(adapter instanceof WagmiAdapter)) throw new Error('AppKit is not initialized with an EIP155 chain')
    return adapter
  }

  static getStoredChain(): TSupportedChain | undefined {
    try {
      const chain = localStorage.getItem(AppKitHelper.CHAIN_STORAGE_KEY)
      return ChainHelper.supportedChains.find(supportedChain => supportedChain === chain)
    } catch {
      return undefined
    }
  }

  /**
   * AppKit is a singleton (global controllers) and cannot be re-created with another config.
   * - Not initialized yet: create it for the given chain.
   * - Initialized with another chain: persist the new chain and reload into the connect screen so AppKit boots with it.
   * Returns whether AppKit is ready to be used for the given chain.
   */
  static setup(chain: TSupportedChain): boolean {
    if (AppKitHelper.initializedChain === chain) return true

    try {
      localStorage.setItem(AppKitHelper.CHAIN_STORAGE_KEY, chain)
    } catch {
      /* empty */
    }

    if (AppKitHelper.initializedChain) {
      window.location.assign(`${import.meta.env.BASE_URL}connect`)
      return false
    }

    const { networks } = ChainHelper.chainInfos[chain]
    const { adapter, overrides } = AppKitHelper.getAdapter(chain)

    createAppKit({
      projectId: AppKitHelper.projectId,
      metadata: {
        name: 'ConnectLab',
        description: 'A testing environment for your WalletConnect V2 integrations.',
        icons: ['https://cityofzion.github.io/appkit-adapters/logo512.png'],
        url: 'https://cityofzion.github.io/appkit-adapters/',
      },
      networks: networks as [AppKitNetwork, ...Array<AppKitNetwork>],
      adapters: [adapter],
      universalProviderConfigOverride: overrides
        ? AppKitHelper.mergeUniversalProviderConfigOverride(overrides)
        : undefined,
      features: {
        analytics: false,
        email: false,
        onramp: false,
        pay: false,
        socials: false,
        swaps: false,
        send: false,
        receive: false,
      },
      enableCoinbase: false,
      themeVariables: {
        '--apkt-accent': '#2563eb',
        '--apkt-font-family': 'Plus Jakarta Sans',
      },
      featuredWalletIds: [
        'f039a4bdf6d5a54065b6cc4b134e32d23bed5d391ad97f25aab5627de26a0784', // NEON Wallet
      ],
    })

    AppKitHelper.initializedChain = chain
    return true
  }

  static getAdapter(chain: TSupportedChain): { adapter: TAdapter; overrides?: TUniversalProviderConfigOverride } {
    switch (chain) {
      case 'ethereum':
        return { adapter: AppKitHelper.ethereumAdapter }
      case 'arbitrum':
        return { adapter: AppKitHelper.arbitrumAdapter }
      case 'base':
        return { adapter: AppKitHelper.baseAdapter }
      case 'polygon':
        return { adapter: AppKitHelper.polygonAdapter }
      case 'neox':
        return { adapter: AppKitHelper.neoxAdapter }
    }

    const namespace: string = ChainHelper.chainInfos[chain].namespace

    switch (namespace) {
      case 'neo3':
        return { adapter: AppKitHelper.neo3Adapter, overrides: Neo3Constants.OVERRIDES }
      case 'stellar':
        return { adapter: AppKitHelper.stellarAdapter, overrides: StellarConstants.OVERRIDES }
      case 'bip122':
        return { adapter: AppKitHelper.bitcoinAdapter, overrides: BitcoinConstants.OVERRIDES }
      case 'solana':
        return { adapter: AppKitHelper.solanaAdapter }
      default:
        throw new Error(`Unsupported namespace: ${namespace}`)
    }
  }

  static mergeUniversalProviderConfigOverride(
    ...overrides: Array<TUniversalProviderConfigOverride>
  ): TUniversalProviderConfigOverride {
    const configOverride: TUniversalProviderConfigOverride = {
      methods: {},
      chains: {},
      events: {},
      rpcMap: {},
    }

    for (const override of overrides) {
      if (override.methods) {
        for (const [chain, methods] of Object.entries(override.methods)) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          configOverride.methods![chain] = [...(configOverride.methods![chain] || []), ...methods]
        }
      }

      if (override.chains) {
        for (const [chain, chains] of Object.entries(override.chains)) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          configOverride.chains![chain] = [...(configOverride.chains![chain] || []), ...chains]
        }
      }

      if (override.events) {
        for (const [chain, events] of Object.entries(override.events)) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          configOverride.events![chain] = [...(configOverride.events![chain] || []), ...events]
        }
      }

      if (override.rpcMap) {
        configOverride.rpcMap = {
          ...configOverride.rpcMap,
          ...override.rpcMap,
        }
      }
    }

    return configOverride
  }
}
