---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Quickstart — Vite + React (TS) + Neo3 (AppKit + Neo3 Adapter)

## 1) Prereqs

- Node.js (LTS recommended)
- A package manager:
  - **Preferred:** `pnpm`
  - **Secondary:** `npm` (may time out in constrained agent environments)
- A Reown project id (AppKit): `VITE_REOWN_PROJECT_ID`

## 2) Create the app

```bash
pnpm create vite@latest vite-react-neo3 --template react-ts
cd vite-react-neo3
```

## 3) Install deps

### pnpm (preferred)

```bash
pnpm add @reown/appkit @cityofzion/appkit-neo3-adapter
```

### npm (secondary)

```bash
npm install @reown/appkit @cityofzion/appkit-neo3-adapter
```
> Note: In constrained agent environments, `npm install` can exceed the 60s execution limit. Prefer pnpm or a cached/prebuilt environment.

### Critical pitfall (React bindings)

- ❌ Never install: `@reown/appkit/react`
- ✅ Install: `@reown/appkit`
- ✅ Import React bindings from the subpath:

```ts
import { AppKitProvider } from '@reown/appkit/react'
```

## 4) Minimal wiring (AppKit + Neo3)

> This is a minimal template. Exact API names may vary by AppKit version; keep this aligned with `reference/ADAPTER__neo3.md` and update if upstream changes.

1) Create a small `src/appkit.ts` (or equivalent) that:
- initializes AppKit
- registers the Neo3 adapter
- sets the Neo3 overrides

Pseudo-wiring (conceptual):

```ts
import { createAppKit } from '@reown/appkit'
import { AppKitProvider } from '@reown/appkit/react'
import { Neo3Adapter, Neo3Constants } from '@cityofzion/appkit-neo3-adapter'

export const appKit = createAppKit({
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
  adapters: [new Neo3Adapter()],
  // Required for Neo3
  universalProviderConfigOverride: Neo3Constants.OVERRIDES
})
```

2) Wrap your React tree with `AppKitProvider`.

## 5) “Hello chain” (connect + 1 read-only RPC)

Target behavior:
- user can open the AppKit modal and connect
- app performs 1 read-only call against Neo3 (e.g., network height / best block)

Implementation approach:
- after connect, call Neo3 RPC via the adapter/provider exposed by AppKit (exact shape varies)

## 6) Links

- Adapter reference: `reference/ADAPTER__neo3.md`
- Install issues: `troubleshooting/TROUBLE__install.md`
- Connect flow issues: `troubleshooting/TROUBLE__connect_flow.md`
- RPC/Tx issues: `troubleshooting/TROUBLE__rpc_and_tx.md`
- Sessions: `guides/GUIDE__auth_and_sessions.md`
- Multi-chain patterns (later): `guides/GUIDE__multi_chain_selection.md`
