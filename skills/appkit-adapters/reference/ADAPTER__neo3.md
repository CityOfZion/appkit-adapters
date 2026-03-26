---
status: draft
owner: Trinity
last_updated: 2026-03-25
version: 0.2
---

# Adapter Reference — Neo3

## Install

Published-package usage:

```bash
pnpm add @reown/appkit @cityofzion/appkit-neo3-adapter react react-dom
```

Local monorepo/source-alias usage may also require explicit Reown peer packages:

```bash
pnpm add @reown/appkit-common@1.8.19 @reown/appkit-controllers@1.8.19
```

## React import rule

- Install `@reown/appkit`
- Import React APIs from `@reown/appkit/react`
- Do not install `@reown/appkit/react` as a separate package

## Validated init snippet

```ts
import { createAppKit } from '@reown/appkit/react'
import {
  Neo3Adapter,
  Neo3Constants,
  neo3MainnetNetwork,
  neo3TestnetNetwork,
} from '@cityofzion/appkit-neo3-adapter'

createAppKit({
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
  adapters: [new Neo3Adapter()],
  networks: [neo3MainnetNetwork, neo3TestnetNetwork],
  metadata: {
    name: 'Neo3 AppKit Example',
    description: 'Minimal Vite + React example using the CityOfZion Neo3 AppKit adapter.',
    url: 'http://localhost:5173',
    icons: ['https://cityofzion.io/favicon.ico'],
  },
  universalProviderConfigOverride: Neo3Constants.OVERRIDES,
})
```

## Provider access

```ts
import { useAppKitProvider } from '@reown/appkit/react'
import type { Neo3Provider } from '@cityofzion/appkit-neo3-adapter'

// @ts-expect-error AppKit types do not yet include the neo3 namespace.
const { walletProvider } = useAppKitProvider<Neo3Provider>('neo3')
```

## Capabilities / quirks

- `Neo3Constants.OVERRIDES` is required.
- The validated example uses `getWalletInfo()` and `testInvoke()` through the wallet-backed provider.
- Current AppKit typings do not fully model the `neo3` namespace, so targeted `@ts-expect-error` directives are currently needed.
- If build resolution fails for Reown internal packages in a local-source setup, ensure `@reown/appkit-common` and `@reown/appkit-controllers` are installed in the app.
