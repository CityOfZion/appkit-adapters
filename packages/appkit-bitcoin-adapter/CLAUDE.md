# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this package. See the root `CLAUDE.md` for monorepo tooling and the general adapter architecture.

## Package

`@cityofzion/appkit-bitcoin-adapter` — WalletConnect-only Reown AppKit adapter for Bitcoin under AppKit's built-in `bip122` namespace. Wire format follows the [WalletConnect Bitcoin RPC reference](https://docs.reown.com/advanced/multichain/rpc-reference/bitcoin-rpc), which is what COZ's `WalletConnectServiceBitcoin` (`@cityofzion/bs-bitcoin`, used by NEON Wallet) implements.

It exists instead of Reown's `@reown/appkit-adapter-bitcoin` because Reown's WalletConnect connector sends `getAccountAddresses` with no params and expects string results, while `bs-bitcoin` requires `{ account }` and returns objects. Never register both adapters: they share the `bip122` namespace.

## Commands

```bash
npm run build      # rm dist, typecheck, tsc → dist/esm + dist/types
npm run typecheck
npm run lint
npm run format     # eslint --fix (prettier via eslint-plugin-prettier)
```

No tests. Verify changes by building and exercising them in `apps/connect-lab` (`src/components/methods/bitcoin-methods.tsx`; rebuild this package, then re-run `pnpm install` there).

## Structure

- `adapter.ts` — `BitcoinAdapter extends AdapterBlueprint`, derived from the neo3 adapter. Accounts are created with type `payment` (as AppKit does for `bip122`). `getBalance` sums mempool.space `chain_stats` + `mempool_stats` (`funded_txo_sum - spent_txo_sum`). `sync*` methods must resolve, not throw.
- `connector.ts` — `BitcoinConnector`, exported as `BitcoinProvider`. Every method injects `account` (the session account of the active network) into the params; callers never pass it.
- `constants.ts` — `BitcoinConstants`: BTC token, CAIP-4 chain ids (genesis-hash prefixes), mempool.space API URLs keyed by chain id, `METHODS`, `EVENTS` (`accountsChanged`, `chainChanged`, `bip122_addressesChanged`), `OVERRIDES`. AppKit replaces (not merges) a namespace's default events with the override, so `EVENTS` must keep `accountsChanged` / `chainChanged`.
- `networks.ts` — `bitcoinMainnetNetwork`, `bitcoinTestnetNetwork`. Defined explicitly instead of spreading Reown's `bitcoin`/`bitcoinTestnet`, which fails to typecheck under `exactOptionalPropertyTypes`.
- `emitter.ts` — copy of the neo3 adapter's emitter.

## Adding a wallet method

1. Add the method to `BitcoinConnector`, injecting `account` like the others.
2. Add its name to `BitcoinConstants.METHODS` (it replaces AppKit's default `bip122` method list).
3. Add a demo in `apps/connect-lab/src/components/methods/bitcoin-methods.tsx`.

## Gotchas

- ESM with `module: nodenext`: relative imports must use the `.js` extension.
- Strict TS: `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` are on.
- `sendTransfer.amount` is in satoshis (`bs-bitcoin` converts it with 8 decimals).
- Unlike neo3/stellar, no `@ts-expect-error` is needed: `bip122` is part of AppKit's `ChainNamespace`.