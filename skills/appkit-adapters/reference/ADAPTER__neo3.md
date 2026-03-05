---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Adapter Reference — Neo3

## Install

```bash
pnpm add @reown/appkit @cityofzion/appkit-neo3-adapter
```

If you must use npm:

```bash
npm install @reown/appkit @cityofzion/appkit-neo3-adapter
```
> Note: In constrained agent environments, `npm install` can exceed the 60s execution limit. Prefer pnpm or a cached/prebuilt environment.

### React bindings pitfall

- ❌ Never install: `@reown/appkit/react`
- ✅ Install: `@reown/appkit`
- ✅ Import React bindings from the subpath:

```ts
import { AppKitProvider } from '@reown/appkit/react'
```

## Init snippet (minimal)

> Exact AppKit API names may change by version. Keep this aligned with quickstarts + examples.

```ts
import { createAppKit } from '@reown/appkit'
import { Neo3Adapter, Neo3Constants } from '@cityofzion/appkit-neo3-adapter'

export const appKit = createAppKit({
  projectId: process.env.VITE_REOWN_PROJECT_ID,
  adapters: [new Neo3Adapter()],
  // REQUIRED for Neo3:
  universalProviderConfigOverride: Neo3Constants.OVERRIDES
})
```

## Capabilities / quirks

- Requires `universalProviderConfigOverride: Neo3Constants.OVERRIDES`.
- RPC endpoints/network selection: be explicit about MainNet vs TestNet in config.
- Wallet UX: user cancel should be treated as a normal outcome (not an error).
- “Hello chain” recommended validation: connect + one read-only Neo3 RPC (e.g., best block height).
- If you see `Method not found` / missing RPC methods, re-check the overrides.

## Supported operations (typical)

- connect / disconnect
- get address/account
- read chain/network id (if exposed)
- sign message (if supported by wallet)
- send transaction / invoke contract (wallet-dependent)
