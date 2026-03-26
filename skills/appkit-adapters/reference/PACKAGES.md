---
status: draft
owner: Trinity
last_updated: 2026-03-25
version: 0.2
---

# Packages & Import Paths

## Core rule

- Install `@reown/appkit`
- Import React APIs from `@reown/appkit/react`
- Do not run `pnpm add @reown/appkit/react` or `npm install @reown/appkit/react`

## Validated package/import map

| Package | Type | Import example | Notes |
|---|---|---|---|
| `@reown/appkit` | core package | `import { createAppKit } from '@reown/appkit/react'` | installed package; React APIs are imported from subpath |
| `@reown/appkit/react` | subpath export | `import { useAppKit } from '@reown/appkit/react'` | import path only, not a package |
| `@cityofzion/appkit-neo3-adapter` | adapter package | `import { Neo3Adapter } from '@cityofzion/appkit-neo3-adapter'` | validated in `examples/vite-react-neo3` |
| `@cityofzion/appkit-neox-adapter` | network/helper package | `import { neoXTestnetNetwork } from '@cityofzion/appkit-neox-adapter'` | used with wagmi/AppKit, not as a separate adapter object |
| `@cityofzion/appkit-stellar-adapter` | adapter package | `import { StellarAdapter } from '@cityofzion/appkit-stellar-adapter'` | validated in `examples/simple-app` |
| `@reown/appkit-common` | Reown peer/runtime package | normal package resolution | explicitly required in validated examples using local/source-linked adapters |
| `@reown/appkit-controllers` | Reown peer/runtime package | normal package resolution | explicitly required in validated examples using local/source-linked adapters |

## Important note for local adapter-source examples

When an example points at local adapter source instead of a fully bundled published package, Vite/module resolution may fail unless the app explicitly installs Reown peer/runtime packages used by that adapter.

In this repository, the validated Neo3 example required:
- `@reown/appkit-common@1.8.19`
- `@reown/appkit-controllers@1.8.19`
