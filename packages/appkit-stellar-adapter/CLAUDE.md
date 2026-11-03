# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this package. See the root `CLAUDE.md` for monorepo tooling and the general adapter architecture.

## Package

`@cityofzion/appkit-stellar-adapter` — Reown AppKit adapter for Stellar under the custom `stellar` namespace.

## Commands

```bash
npm run build      # rm dist, typecheck, tsc → dist/esm + dist/types
npm run typecheck
npm run lint
npm run format     # eslint --fix (prettier via eslint-plugin-prettier)
```

No tests. Verify changes by building and exercising them in `apps/connect-lab` (rebuild this package, then re-run `pnpm install` there).

## Structure

- `adapter.ts` — `StellarAdapter extends AdapterBlueprint`. `getBalance` fetches `{horizon}/accounts/{address}` using `StellarConstants.HORIZON_URL_BY_ID[chainId]` (not the network's `rpcUrls`, which point to Soroban RPC) and returns XLM. `sync*` methods must resolve, not throw — AppKit calls them during connect.
- `connector.ts` — `StellarConnector`, exported as `StellarProvider`. Methods map to WalletConnect `stellar_*` RPCs (`stellar_signXDR`, `stellar_signAndSubmitXDR`, `stellar_signMessage`, `stellar_signAuthEntry`, `stellar_getNetwork`); some rename response fields (e.g. `signedXDR` → `signedTxXdr`).
- `constants.ts` — `StellarConstants`: XLM token, Horizon URLs keyed by network id (`pubnet` / `testnet`), `METHODS`, `EVENTS` (must keep `accountsChanged` / `chainChanged`: AppKit replaces the default events with the override), `OVERRIDES`.
- `networks.ts` — `stellarMainnetNetwork` (`stellar:pubnet`), `stellarTestnetNetwork` (`stellar:testnet`).
- `emitter.ts` — identical copy of the neo3 adapter's emitter (not re-exported from `index.ts` here).

## Adding a wallet method

1. Add the method to `StellarConnector`.
2. Add its RPC name to `StellarConstants.METHODS` — otherwise the WalletConnect session won't include it.
3. Add a demo in `apps/connect-lab/src/components/methods/stellar-methods.tsx`.

## Gotchas

- ESM with `module: nodenext`: relative imports must use the `.js` extension.
- Strict TS: `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` are on.
- Mirrors `appkit-neo3-adapter` (and `appkit-bitcoin-adapter`) closely; shared logic fixes usually need applying to all three.
- Network id `testnet` collides with Neo3's `testnet` id — AppKit must match networks by `caipNetworkId`, which is why connect-lab patches `@reown/appkit`.
