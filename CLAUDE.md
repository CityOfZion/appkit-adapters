# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Monorepo of CityOfZion adapters that plug non-default blockchains into [Reown AppKit](https://docs.reown.com/appkit) (WalletConnect), plus a demo app. Each subproject has its own `CLAUDE.md` with details:

- `packages/appkit-neo3-adapter/` — custom AppKit adapter for the `neo3` namespace
- `packages/appkit-stellar-adapter/` — custom AppKit adapter for the `stellar` namespace
- `packages/appkit-bitcoin-adapter/` — WalletConnect-only AppKit adapter for AppKit's built-in `bip122` namespace, compatible with COZ's `bs-bitcoin` wallets (replaces Reown's `@reown/appkit-adapter-bitcoin`)
- `packages/appkit-neox-adapter/` — **not** an adapter; NeoX is EVM (`eip155`), so this ships network configs + anti-MEV tx helpers for use with Reown's `WagmiAdapter`
- `apps/connect-lab/` — React demo/testing app consuming all packages (deployed to GitHub Pages)
- `skills/appkit-adapters/` — agent skill docs (guides, references, runnable examples) for integrating these packages; keep in sync when public APIs change. Its examples (`examples/vite-react-neo3`, `examples/simple-app`) are standalone pnpm projects that link the packages via `file:../../../../packages/...` (build packages first); verify them with `skills/appkit-adapters/tests/ci-samples/local-smoke.sh`

## Tooling

Two separate package-management worlds:

- **Packages** are managed by [Rush](https://rushjs.io/) (`rush.json`, Rush 5.169.2 with pnpm 9.15.9). Lockfile lives in `common/config/rush/pnpm-lock.yaml`.
- **connect-lab is not a Rush project.** It has its own `pnpm-lock.yaml` / `pnpm-workspace.yaml` and is installed with plain `pnpm` (v10) from inside `apps/connect-lab/`. It depends on the packages via `file:../../packages/...`, so it consumes their built `dist/` output.

## Commands

From repo root (use `node common/scripts/install-run-rush.js <cmd>` if `rush` is not installed globally — that is what CI does):

```bash
rush install            # install package deps from the Rush lockfile
rush update             # after changing a package's package.json deps
rush rebuild --verbose  # clean build of all Rush projects (what CI runs)
rush build              # incremental build
rush build-packages     # custom command (common/config/rush/command-line.json): rush build --only tag:packages
rush lint               # custom bulk command: runs every package's `lint` script
rush change             # create change files in common/changes/ — required for any package change (CI runs `rush change --verify`, which only sees committed changes vs `origin/main`)
```

Per package (inside `packages/<name>/`, via `rushx` or `npm run`): `build`, `typecheck`, `lint`, `format`. There are no tests in the packages.

Every project in `rush.json` must have the `packages` tag so `rush build-packages` picks it up.

## CI / Release (`.github/workflows/`)

- `ci.yml` (push/PR to `main`): `rush change --verify` → `rush install` → `rush lint` → `rush rebuild`, then `pnpm install --frozen-lockfile`, `lint` and `build` in `apps/connect-lab` (so its `pnpm-lock.yaml` must be committed in sync).
- `npm-publish.yml` (manual): rebuild, then `rush publish --apply --publish` and commits the version bump back to `main`.
- `deploy.yml` (manual): rebuild packages, `pnpm install --frozen-lockfile` + `pnpm run build` in `apps/connect-lab` with `VITE_PROJECT_ID` secret, copies `index.html` → `404.html` for SPA routing, deploys to GitHub Pages.

## Conventions

- Commits follow Conventional Commits with a project scope, e.g. `feat(connect-lab): ...`, `fix(neo3-adapter): ...`, `fix(actions): ...`.
- In static class fields (e.g. `*Constants`), reference other statics by class name, not `this`: `tsc` leaves `this` untouched inside computed keys (`[this.X]: ...`), which is `undefined` at module load in the published build.
- Packages use double quotes + semicolons (Prettier defaults via ESLint); connect-lab uses single quotes, no semicolons, 120 width (`apps/connect-lab/prettier.config.js`). Match the style of the subproject you are in.

## Architecture: how a custom-namespace adapter plugs into AppKit

AppKit only knows built-in namespaces (`eip155`, `solana`, `bip122`, ...). Neo3 and Stellar adapters add new ones:

1. **Adapter** (`*Adapter extends AdapterBlueprint` from `@reown/appkit-controllers`) — passed in `createAppKit({ adapters })`. On `setUniversalProvider` it wires WalletConnect listeners and registers a single **Connector**. Handles connect/disconnect/accounts/balance; most EVM-style blueprint methods intentionally throw "Not supported". `switchNetwork` is not overridden: the base `AdapterBlueprint` implementation already switches WalletConnect sessions via `setDefaultChain`.
2. **Connector** (`*Connector extends WalletConnectConnector implements Provider`) — what dApps get from `useAppKitProvider<Neo3Provider|StellarProvider>(namespace)`. Exposes chain-specific RPC methods that forward to the WalletConnect `UniversalProvider`.
3. **Constants.OVERRIDES** — must be passed as `universalProviderConfigOverride` to `createAppKit`, otherwise the WalletConnect session never requests the custom namespace's methods. Multiple overrides must be merged (see `AppKitHelper.mergeUniversalProviderConfigOverride` in connect-lab). AppKit replaces (does not merge) a namespace's default `methods` / `events` with the override's, so each `EVENTS` list must keep `accountsChanged` / `chainChanged`.
4. **Networks** — `AppKitNetwork` objects with custom `caipNetworkId` / `chainNamespace`; these need `@ts-expect-error` because the namespace isn't in AppKit's `ChainNamespace` union.

The Bitcoin adapter follows the same structure on the built-in `bip122` namespace, so it needs no `@ts-expect-error`.

`@reown/*`, `@walletconnect/universal-provider`, `viem` and `@wagmi/core` are `peerDependencies` (`*`) — the consuming app picks their versions. Type packages referenced by a package's published `.d.ts` files (e.g. `@cityofzion/neon-dappkit-types`) belong in `dependencies`, not `devDependencies`.