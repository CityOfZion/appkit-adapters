import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { BitcoinAdapter, BitcoinConstants, bitcoinTestnetNetwork } from '@cityofzion/appkit-bitcoin-adapter'
import { Neo3Adapter, Neo3Constants, neo3TestnetNetwork } from '@cityofzion/appkit-neo3-adapter'
import { neoXTestnetNetwork } from '@cityofzion/appkit-neox-adapter'
import { StellarAdapter, StellarConstants, stellarTestnetNetwork } from '@cityofzion/appkit-stellar-adapter'

type TUniversalProviderConfigOverride = {
  methods?: Record<string, string[]>
  chains?: Record<string, string[]>
  events?: Record<string, string[]>
  rpcMap?: Record<string, string>
}

export const projectId: string | undefined = import.meta.env.VITE_REOWN_PROJECT_ID

export const wagmiAdapter = new WagmiAdapter({
  projectId: projectId || '',
  networks: [neoXTestnetNetwork],
})

function mergeRecordOfLists(...records: Array<Record<string, string[]> | undefined>) {
  const merged: Record<string, string[]> = {}

  for (const record of records) {
    for (const [namespace, values] of Object.entries(record || {})) {
      merged[namespace] = [...(merged[namespace] || []), ...values]
    }
  }

  return merged
}

function mergeUniversalProviderConfigOverride(...overrides: TUniversalProviderConfigOverride[]) {
  return {
    methods: mergeRecordOfLists(...overrides.map(override => override.methods)),
    chains: mergeRecordOfLists(...overrides.map(override => override.chains)),
    events: mergeRecordOfLists(...overrides.map(override => override.events)),
    rpcMap: Object.assign({}, ...overrides.map(override => override.rpcMap)),
  }
}

export function setupAppKit() {
  if (!projectId) {
    console.warn('Missing VITE_REOWN_PROJECT_ID. Configure it in .env before testing wallet connectivity.')
    return
  }

  createAppKit({
    projectId,
    adapters: [new Neo3Adapter(), new StellarAdapter(), new BitcoinAdapter(), wagmiAdapter],
    networks: [neo3TestnetNetwork, stellarTestnetNetwork, bitcoinTestnetNetwork, neoXTestnetNetwork],
    metadata: {
      name: 'Simple Multi-Chain AppKit Integration',
      description: 'Small runnable example using CityOfZion Neo3, Stellar, Bitcoin and NeoX AppKit wiring.',
      url: 'http://localhost:4173',
      icons: ['https://cityofzion.io/favicon.ico'],
    },
    universalProviderConfigOverride: mergeUniversalProviderConfigOverride(
      Neo3Constants.OVERRIDES,
      StellarConstants.OVERRIDES,
      BitcoinConstants.OVERRIDES
    ),
    features: {
      analytics: false,
      email: false,
      socials: false,
      swaps: false,
      onramp: false,
      pay: false,
      send: false,
      receive: false,
    },
    enableCoinbase: false,
  })
}
