---
name: appkit-adapters
description: Teaches how to integrate CityOfZion AppKit adapters (Neo3, Neo X, Stellar, Bitcoin) into Reown AppKit apps; use when adding wallet connectivity for those chains to a frontend.
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# SKILL: Integrate CityOfZion AppKit Adapters

## Canonical source of truth

This skill must align with the runnable examples under `examples/`.

Validated examples in this repository:
- `examples/vite-react-neo3/` — canonical single-chain Neo3 example
- `examples/simple-app/` — canonical multi-chain example (Neo3 + Stellar + Bitcoin + Neo X), testnet networks only, served on port 4173

Both examples depend on the adapters through local `file:../../../../packages/<name>` links, so the packages must be built from the repository root first (`rush install && rush build-packages`).

If this document conflicts with those examples, treat the examples as the implementation truth and update this skill.

Full doc map: [INDEX.md](./INDEX.md).

## What is actually validated here

### Neo3 example contract — `examples/vite-react-neo3`

Validated implementation pattern:
- Install `@reown/appkit` and import React helpers from `@reown/appkit/react`
- Call `createAppKit(...)` during app bootstrap
- Register `new Neo3Adapter()` in `adapters`
- Register `neo3MainnetNetwork` and `neo3TestnetNetwork` in `networks`
- Set `universalProviderConfigOverride: Neo3Constants.OVERRIDES`
- Use `useAppKit()` to open the wallet modal
- Use `useAppKitAccount()` for connection state
- Use `useAppKitProvider<Neo3Provider>('neo3')` for the adapter-backed provider

Current validated bootstrap shape:

```ts
import { createAppKit } from '@reown/appkit/react'
import {
  Neo3Adapter,
  Neo3Constants,
  neo3MainnetNetwork,
  neo3TestnetNetwork,
} from '@cityofzion/appkit-neo3-adapter'

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
```

### Multi-chain example contract — `examples/simple-app`

Validated implementation pattern:
- Neo3 uses `Neo3Adapter` + `neo3TestnetNetwork` + `Neo3Constants.OVERRIDES`
- Stellar uses `StellarAdapter` + `stellarTestnetNetwork` + `StellarConstants.OVERRIDES`
- Bitcoin uses `BitcoinAdapter` + `bitcoinTestnetNetwork` + `BitcoinConstants.OVERRIDES`
- Neo X uses `new WagmiAdapter({ projectId, networks: [neoXTestnetNetwork] })` with the network from `@cityofzion/appkit-neox-adapter`
- AppKit accepts a single `universalProviderConfigOverride`, so the app merges the per-namespace overrides of every non-EVM adapter itself (see [REF__universal_provider_overrides.md](./reference/REF__universal_provider_overrides.md))
- The Reown/WalletConnect peer packages are installed explicitly

## Dependency guidance

### Canonical package-manager stance

- Prefer `pnpm`
- Examples in this repo are pnpm-oriented and declare `packageManager: pnpm@9.15.9`

### React import pitfall

- Do not install `@reown/appkit/react` as a package
- Do install `@reown/appkit`
- Do import React APIs from the subpath:

```ts
import { createAppKit, useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
```

### Required peer dependencies

The non-EVM adapters (`appkit-neo3-adapter`, `appkit-stellar-adapter`, `appkit-bitcoin-adapter`) declare these as **required peer dependencies**; the app must install them:
- `@reown/appkit`
- `@reown/appkit-common`
- `@reown/appkit-controllers`
- `@walletconnect/universal-provider`

`@cityofzion/appkit-neox-adapter` peers: `@reown/appkit`, `@reown/appkit-common`, `viem`, `@wagmi/core` (plus `@reown/appkit-adapter-wagmi` to create the `WagmiAdapter`, its peer `wagmi`, and `wagmi`'s peer `@tanstack/react-query`).

If a peer is missing, Vite/TypeScript resolution fails at build time.

### Dependencies required by the validated examples

Neo3 example (`examples/vite-react-neo3/package.json`):
- `@cityofzion/appkit-neo3-adapter` (local `file:` link)
- `@reown/appkit`, `@reown/appkit-common`, `@reown/appkit-controllers`, `@walletconnect/universal-provider`
- `react`, `react-dom`

Multi-chain example (`examples/simple-app/package.json`):
- `@cityofzion/appkit-neo3-adapter`, `@cityofzion/appkit-stellar-adapter`, `@cityofzion/appkit-bitcoin-adapter`, `@cityofzion/appkit-neox-adapter` (local `file:` links)
- `@reown/appkit`, `@reown/appkit-common`, `@reown/appkit-controllers`, `@walletconnect/universal-provider`
- `@reown/appkit-adapter-wagmi`, `@wagmi/core`, `viem`, `wagmi`, `@tanstack/react-query`
- `react`, `react-dom`

Exact versions: see `examples/simple-app/package.json` and `examples/vite-react-neo3/package.json`; do not copy pinned versions from docs.

## Chain-specific reality

### Neo3

Supported and validated in both examples.

Required details:
- `new Neo3Adapter()` in `adapters`
- `Neo3Constants.OVERRIDES`
- Neo3 networks in `networks`
- `useAppKitProvider<Neo3Provider>('neo3')` for wallet-backed provider access (`invokeFunction`, `testInvoke`, `calculateFee`, `signTransaction`, `signMessage`, `verifyMessage`, `getWalletInfo`, `encrypt`, `decrypt`, `decryptFromArray`)

Known typing nuance:
- AppKit's `ChainNamespace` does not include `neo3`
- targeted `@ts-expect-error` is required around `useAppKitProvider('neo3')` and `open({ namespace: 'neo3' })`

### Stellar

Supported and validated in the multi-chain example.

Required details:
- `new StellarAdapter()` in `adapters`
- `StellarConstants.OVERRIDES`
- Stellar networks in `networks` (`stellarMainnetNetwork` id `pubnet`, `stellarTestnetNetwork` id `testnet`)
- `useAppKitProvider<StellarProvider>('stellar')` (`signTransaction`, `signAndSubmitTransaction`, `signMessage`, `signAuthEntry`, `getNetwork`)
- Same `@ts-expect-error` nuance as Neo3 for the `stellar` namespace

### Bitcoin

Supported and validated in the multi-chain example. `@cityofzion/appkit-bitcoin-adapter` is not yet published to npm; use the local package build.

Required details:
- `new BitcoinAdapter()` in `adapters`
- `BitcoinConstants.OVERRIDES` (AppKit already requests the Bitcoin methods; the override also registers the `bip122_addressesChanged` event, so include it in the merged override)
- `bitcoinMainnetNetwork` / `bitcoinTestnetNetwork` in `networks`
- `useAppKitProvider<BitcoinProvider>('bip122')` (`getAccountAddresses`, `signMessage`, `signPsbt`, `sendTransfer`); the provider fills the `account` param automatically

Differences from Neo3/Stellar:
- `bip122` is a native AppKit namespace, so **no** `@ts-expect-error` is needed
- WalletConnect only: no browser extension wallets (Xverse, Leather, Unisat, OKX); targets wallets built on `@cityofzion/bs-bitcoin`, such as NEON Wallet
- Use it **instead of** `@reown/appkit-adapter-bitcoin`, never both (both register `bip122`)

See [reference/ADAPTER__bitcoin.md](./reference/ADAPTER__bitcoin.md).

### Neo X

Supported as EVM wiring in the multi-chain example.

Current validated reality:
- Neo X is wired through `new WagmiAdapter({ projectId, networks })` from `@reown/appkit-adapter-wagmi`
- `@cityofzion/appkit-neox-adapter` is **not** an AppKit adapter; it exports networks (`neoXMainnetNetwork`, `neoXTestnetNetwork`, `neoXAntiMevMainnetNetwork`, `neoXAntiMevTestnetNetwork`) and helpers (`sendTransaction`, `signTransaction`, `buildAntiMevTransaction`, `getCachedTransaction`, `isAntiMevNetwork`, `governanceAbi`, `keyManagementAbi`)
- No universal provider override is needed (`eip155` is native)

See [reference/ADAPTER__neox.md](./reference/ADAPTER__neox.md).

## When to use this skill

Use this skill when an app needs:
- Neo3 wallet connectivity via Reown AppKit
- Stellar wallet connectivity via Reown AppKit
- Bitcoin wallet connectivity via WalletConnect wallets such as NEON Wallet
- Neo X network support (including anti-MEV transactions) alongside wagmi/AppKit
- a minimal runnable example or integration scaffold that matches this repository's working examples

## What the agent should produce

For non-trivial integrations, produce:
1. exact dependency commands
2. exact bootstrap/provider wiring files
3. a minimal connect UI
4. chain-specific notes for overrides and provider access
5. a verification command list

## Acceptance checks

A change is only done when:
1. the documented dependency list matches the example package manifests
2. the documented bootstrap pattern matches the example source files
3. the documented chain limitations match the example implementations
4. `pnpm build` succeeds for the touched example(s)

## Verification commands

Build the local adapter packages first (repository root):

```bash
rush install
rush build-packages
```

Single-chain Neo3 example:

```bash
cd skills/appkit-adapters/examples/vite-react-neo3
pnpm install
pnpm build
```

Multi-chain example:

```bash
cd skills/appkit-adapters/examples/simple-app
pnpm install
pnpm build
```

Both examples read `VITE_REOWN_PROJECT_ID` (copy `.env.example` to `.env`).