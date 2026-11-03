---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
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
| `@cityofzion/appkit-neo3-adapter` | adapter package | `import { Neo3Adapter } from '@cityofzion/appkit-neo3-adapter'` | validated in both examples |
| `@cityofzion/appkit-stellar-adapter` | adapter package | `import { StellarAdapter } from '@cityofzion/appkit-stellar-adapter'` | validated in `examples/simple-app` |
| `@cityofzion/appkit-bitcoin-adapter` | adapter package | `import { BitcoinAdapter } from '@cityofzion/appkit-bitcoin-adapter'` | validated in `examples/simple-app`; not yet published to npm; replaces `@reown/appkit-adapter-bitcoin` (never use both) |
| `@cityofzion/appkit-neox-adapter` | network/helper package | `import { neoXTestnetNetwork } from '@cityofzion/appkit-neox-adapter'` | used with `WagmiAdapter`, not an adapter object; root export only (no `/networks` subpath) |
| `@reown/appkit-adapter-wagmi` | Reown EVM adapter | `import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'` | needed for Neo X |
| `@reown/appkit-common` | required peer | normal package resolution | peer of every CityOfZion package |
| `@reown/appkit-controllers` | required peer | normal package resolution | peer of Neo3, Stellar, Bitcoin adapters |
| `@walletconnect/universal-provider` | required peer | normal package resolution | peer of Neo3, Stellar, Bitcoin adapters |
| `viem`, `@wagmi/core` | required peers | normal package resolution | peers of `@cityofzion/appkit-neox-adapter` |

## Peer dependencies

The CityOfZion packages declare the Reown/WalletConnect packages as **peer dependencies**, so the app must install them; they are not a workaround for local-source setups.

- Neo3, Stellar, Bitcoin adapters: `@reown/appkit`, `@reown/appkit-common`, `@reown/appkit-controllers`, `@walletconnect/universal-provider`
- Neo X package: `@reown/appkit`, `@reown/appkit-common`, `viem`, `@wagmi/core`

`@cityofzion/neon-dappkit-types` is a regular dependency of the Neo3 adapter; install it in the app only if you import from it directly.

Exact versions used by the examples: `examples/simple-app/package.json` and `examples/vite-react-neo3/package.json`.

## Local packages in this repository

The examples link the adapters with `file:../../../../packages/<name>`, which resolves to the built `dist/` output. Run `rush install && rush build-packages` from the repository root before `pnpm install` in an example.