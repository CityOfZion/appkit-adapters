# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this package. See the root `CLAUDE.md` for monorepo tooling and the general adapter architecture.

## Package

`@cityofzion/appkit-neo3-adapter` — Reown AppKit adapter for Neo N3 under the custom `neo3` namespace. Wallet RPC types come from `@cityofzion/neon-dappkit-types` (NEON / dAPI method shapes).

## Commands

```bash
npm run build      # rm dist, typecheck, tsc → dist/esm + dist/types
npm run typecheck
npm run lint
npm run format     # eslint --fix (prettier via eslint-plugin-prettier)
```

No tests. Verify changes by building and exercising them in `apps/connect-lab` (rebuild this package, then re-run `pnpm install` there).

## Structure

- `adapter.ts` — `Neo3Adapter extends AdapterBlueprint`. `getBalance` calls the network RPC `getnep17balances` and returns GAS only. Sync/unsupported blueprint methods are stubs on purpose (the `sync*` ones must resolve, not throw — AppKit calls them during connect).
- `connector.ts` — `Neo3Connector`, exported to dApps as `Neo3Provider`. Each wallet method is a thin `this.request({ method, params })`.
- `constants.ts` — `Neo3Constants`: GAS token info, `METHODS`, `EVENTS`, `OVERRIDES` for `universalProviderConfigOverride`. AppKit replaces (not merges) a namespace's default events with the override, so `EVENTS` must keep `accountsChanged` / `chainChanged`.
- `networks.ts` — `neo3MainnetNetwork` (`neo3:mainnet`), `neo3TestnetNetwork` (`neo3:testnet`).
- `emitter.ts` — minimal `ProviderEventEmitter`; identical copies live in the stellar and bitcoin adapters.

## Adding a wallet method

1. Add the method to `Neo3Connector`.
2. Add its name to `Neo3Constants.METHODS` — otherwise the WalletConnect session won't include it and the wallet rejects the call.
3. Add a demo button in `apps/connect-lab/src/components/methods/neo3-methods.tsx`.

## Gotchas

- ESM with `module: nodenext`: relative imports must use the `.js` extension.
- Strict TS: `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` are on.
- This package, `appkit-stellar-adapter` and `appkit-bitcoin-adapter` are near-identical in `adapter.ts` / `emitter.ts`; fixes to shared logic usually need mirroring.
