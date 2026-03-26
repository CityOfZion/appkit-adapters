import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createAppKit } from '@reown/appkit/react'
import {
  Neo3Adapter,
  Neo3Constants,
  neo3MainnetNetwork,
  neo3TestnetNetwork,
} from '@cityofzion/appkit-neo3-adapter'
import './index.css'
import App from './App.tsx'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

if (!projectId) {
  console.warn('Missing VITE_REOWN_PROJECT_ID. Wallet connection will not work until it is configured.')
} else {
  createAppKit({
    projectId,
    adapters: [new Neo3Adapter()],
    networks: [neo3MainnetNetwork, neo3TestnetNetwork],
    metadata: {
      name: 'Neo3 AppKit Example',
      description: 'Minimal Vite + React example using the CityOfZion Neo3 AppKit adapter.',
      url: 'http://localhost:5173',
      icons: ['https://cityofzion.io/favicon.ico'],
    },
    universalProviderConfigOverride: Neo3Constants.OVERRIDES,
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
  </StrictMode>,
)
