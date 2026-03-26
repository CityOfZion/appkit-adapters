---
status: draft
owner: Trinity
last_updated: 2026-03-25
version: 0.2
---

# Quickstart — Vite + React (TS) + Neo3

This quickstart is aligned to the validated runnable example at:
- `examples/vite-react-neo3/`

## 1) Create the app

```bash
pnpm create vite@latest vite-react-neo3 --template react-ts
cd vite-react-neo3
```

## 2) Install dependencies

Published-package shape:

```bash
pnpm add @reown/appkit @cityofzion/appkit-neo3-adapter react react-dom
```

If you are wiring against local adapter source in this monorepo-style pattern, also ensure these Reown packages are resolvable from the app:

```bash
pnpm add @reown/appkit-common@1.8.19 @reown/appkit-controllers@1.8.19
```

## 3) Bootstrap AppKit in `src/main.tsx`

```ts
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createAppKit } from '@reown/appkit/react'
import {
  Neo3Adapter,
  Neo3Constants,
  neo3MainnetNetwork,
  neo3TestnetNetwork,
} from '@cityofzion/appkit-neo3-adapter'
import App from './App'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## 4) Use the Neo3 provider in `src/App.tsx`

```ts
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import type { Neo3Provider } from '@cityofzion/appkit-neo3-adapter'

function Example() {
  const { open } = useAppKit()
  const account = useAppKitAccount()
  // @ts-expect-error AppKit types do not yet include the neo3 namespace.
  const { walletProvider } = useAppKitProvider<Neo3Provider>('neo3')

  async function connectNeo3() {
    // @ts-expect-error AppKit types do not yet include the neo3 namespace.
    await open({ namespace: 'neo3' })
  }

  return null
}
```

## 5) Verify

```bash
pnpm build
```

## Notes

- `Neo3Constants.OVERRIDES` is required.
- The validated example uses `createAppKit` from `@reown/appkit/react` during bootstrap.
- Current AppKit typings still require targeted `@ts-expect-error` directives for the `neo3` namespace in the example.
