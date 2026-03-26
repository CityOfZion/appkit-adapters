import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createAppKit } from '@reown/appkit/react'
import {
  Neo3Adapter,
  Neo3Constants,
  neo3TestnetNetwork,
} from '@cityofzion/appkit-neo3-adapter'
import {
  StellarAdapter,
  StellarConstants,
  stellarTestnetNetwork,
} from '@cityofzion/appkit-stellar-adapter'
import './index.css'
import App from './App'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

function mergeUniversalProviderConfigOverride(
  ...overrides: Array<{
    methods?: Record<string, string[]>
    chains?: Record<string, string[]>
    events?: Record<string, string[]>
    rpcMap?: Record<string, string>
  }>
) {
  return overrides.reduce(
    (merged, override) => ({
      methods: { ...merged.methods, ...override.methods },
      chains: { ...merged.chains, ...override.chains },
      events: { ...merged.events, ...override.events },
      rpcMap: { ...merged.rpcMap, ...override.rpcMap },
    }),
    {
      methods: {} as Record<string, string[]>,
      chains: {} as Record<string, string[]>,
      events: {} as Record<string, string[]>,
      rpcMap: {} as Record<string, string>,
    }
  )
}

if (!projectId) {
  console.warn('Missing VITE_REOWN_PROJECT_ID. Configure it in .env before testing wallet connectivity.')
} else {
  createAppKit({
    projectId,
    adapters: [new Neo3Adapter(), new StellarAdapter()],
    networks: [neo3TestnetNetwork, stellarTestnetNetwork],
    metadata: {
      name: 'Simple Multi-Chain AppKit Integration',
      description: 'Small runnable example using CityOfZion Neo3 and Stellar AppKit wiring.',
      url: 'http://localhost:5173',
      icons: ['https://cityofzion.io/favicon.ico'],
    },
    universalProviderConfigOverride: mergeUniversalProviderConfigOverride(
      Neo3Constants.OVERRIDES,
      StellarConstants.OVERRIDES
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
