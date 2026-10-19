---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
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

Install the adapter together with its required peer dependencies:

```bash
pnpm add @cityofzion/appkit-neo3-adapter @reown/appkit @reown/appkit-common @reown/appkit-controllers @walletconnect/universal-provider
```

`@reown/appkit-common`, `@reown/appkit-controllers`, and `@walletconnect/universal-provider` are required peers of the adapter, not optional extras; builds fail to resolve imports without them. `@cityofzion/neon-dappkit-types` is a regular dependency of the adapter, so install it only if you import its types directly.

Inside this repository, `examples/vite-react-neo3` depends on the adapter through a local link (`"@cityofzion/appkit-neo3-adapter": "file:../../../../packages/appkit-neo3-adapter"`). Build the packages first from the repository root:

```bash
rush install
rush build-packages
```

## 3) Configure the project id

Create `.env` (the example ships an `.env.example`):

```bash
VITE_REOWN_PROJECT_ID=your_project_id_here
```

Get a project id from https://cloud.reown.com.

## 4) Bootstrap AppKit in `src/main.tsx`

```tsx
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

## 5) Use the Neo3 provider in `src/App.tsx`

```tsx
import { useState } from 'react'
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { Neo3Constants, type Neo3Provider } from '@cityofzion/appkit-neo3-adapter'

export default function App() {
  const { open } = useAppKit()
  const account = useAppKitAccount()
  // @ts-expect-error AppKit types do not yet include the neo3 namespace.
  const { walletProvider } = useAppKitProvider<Neo3Provider>('neo3')
  const [result, setResult] = useState('')

  async function connectNeo3() {
    // @ts-expect-error AppKit types do not yet include the neo3 namespace.
    await open({ namespace: 'neo3' })
  }

  async function readGasBalance() {
    if (!walletProvider || !account.address) return

    const invokeResult = await walletProvider.testInvoke({
      invocations: [
        {
          scriptHash: Neo3Constants.GAS_TOKEN.hash,
          operation: 'balanceOf',
          args: [{ type: 'Hash160', value: account.address }],
        },
      ],
      signers: [{ scopes: 'CalledByEntry' }],
    })

    setResult(JSON.stringify(invokeResult, null, 2))
  }

  return (
    <main>
      <p>{account.isConnected ? account.address : 'Not connected'}</p>
      <button onClick={connectNeo3}>Connect Neo3 wallet</button>
      <button onClick={readGasBalance} disabled={!walletProvider}>
        testInvoke(balanceOf)
      </button>
      {result ? <pre>{result}</pre> : null}
    </main>
  )
}
```

## 6) Verify

```bash
pnpm build
```

## Notes

- `Neo3Constants.OVERRIDES` is required.
- The validated example uses `createAppKit` from `@reown/appkit/react` during bootstrap.
- AppKit's `ChainNamespace` does not include `neo3`, so targeted `@ts-expect-error` directives are required at the `'neo3'` call sites.
- For the full provider method list and the `invokeFunction` shape, see [ADAPTER__neo3.md](../reference/ADAPTER__neo3.md).