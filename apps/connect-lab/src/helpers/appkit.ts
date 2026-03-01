import { Neo3Adapter, Neo3Constants } from '@cityofzion/appkit-neo3-adapter'
import { StellarAdapter, StellarConstants } from '@cityofzion/appkit-stellar-adapter'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'
import { ChainHelper } from './chain'
import type { AppKitNetwork } from '@reown/appkit/networks'

export type TUniversalProviderConfigOverride = {
  methods?: Record<string, Array<string>>
  chains?: Record<string, Array<string>>
  events?: Record<string, Array<string>>
  rpcMap?: Record<string, string>
}

export class AppKitHelper {
  static projectId = import.meta.env.VITE_PROJECT_ID

  static solanaAdapter = new SolanaAdapter()
  static neo3Adapter = new Neo3Adapter()
  static stellarAdapter = new StellarAdapter()
  static eip155Adapter = new WagmiAdapter({
    projectId: this.projectId,
    networks: [
      ...ChainHelper.networksByChain.ethereum,
      ...ChainHelper.networksByChain.arbitrum,
      ...ChainHelper.networksByChain.base,
      ...ChainHelper.networksByChain.polygon,
      ...ChainHelper.networksByChain.neox,
    ],
  })

  static setup() {
    createAppKit({
      projectId: this.projectId,
      metadata: {
        name: 'ConnectLab',
        description: 'A testing environment for your WalletConnect V2 integrations.',
        icons: ['https://cityofzion.github.io/appkit-adapters/logo512.png'],
        url: 'https://cityofzion.github.io/appkit-adapters/',
      },
      networks: Object.values(ChainHelper.networksByChain).flat() as [AppKitNetwork, ...Array<AppKitNetwork>],
      adapters: [this.solanaAdapter, this.neo3Adapter, this.stellarAdapter, this.eip155Adapter],
      universalProviderConfigOverride: this.mergeUniversalProviderConfigOverride(
        Neo3Constants.OVERRIDES,
        StellarConstants.OVERRIDES
      ),
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
