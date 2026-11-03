# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this package. See the root `CLAUDE.md` for monorepo tooling.

## Package

`@cityofzion/appkit-neox-adapter` — despite the name, **not an `AdapterBlueprint`**. NeoX is EVM-compatible (`eip155`), so dApps use Reown's standard `WagmiAdapter`; this package only provides NeoX network configs and wagmi-based transaction helpers with anti-MEV support. Peer deps include `viem` and `@wagmi/core`; runtime dep `neox-tpke` does the threshold encryption.

## Commands

```bash
npm run build      # rm dist, typecheck, tsc → dist/esm + dist/types
npm run typecheck
npm run lint
npm run format     # eslint --fix (prettier via eslint-plugin-prettier)
```

No tests. Verify in `apps/connect-lab` (`src/components/methods/neox-methods.tsx`), which registers `neoXMainnetNetwork` / `neoXTestnetNetwork` and has separate cards for the normal and Anti-MEV send/sign actions.

## Structure

- `networks.ts` — extends `neoxMainnet` / `neoxT4` from `@reown/appkit/networks` with `contracts` (`governance`, `governanceReward`, `keyManagement` system contracts). Anti-MEV variants differ **only** by `rpcUrls`.
- `actions.ts` — wrappers around `@wagmi/core`: `sendTransaction` / `signTransaction` pass the tx through as-is; `sendAntiMevTransaction` / `signAntiMevTransaction` always build the anti-MEV envelope first (no network auto-detection). `getAntiMevNetwork(chainId)` maps a NeoX chain id to its anti-MEV network; `isAntiMevNetwork(network)` compares RPC URLs (UI hint only).
- `abis/` — large generated ABI constants for the governance and key-management contracts; don't hand-edit.

## Anti-MEV flow (`buildAntiMevTransaction`)

All reads (nonce, `eth_getCachedTransaction`, contract reads) go through a viem public client on the anti-MEV RPC (`createAntiMevPublicClient`); only the wallet calls (send, `signMessage`) go through wagmi.

1. Read the pending nonce of the connected account.
2. Send the tx with that explicit nonce; the anti-MEV RPC caches it and errors with `"transaction cached"` (expected, swallowed). This goes through the wallet's RPC, so it only reaches the anti-MEV node if the wallet is on an anti-MEV network.
3. Sign the nonce as a message and fetch the cached raw tx via `eth_getCachedTransaction`, always against the anti-MEV RPC from `getAntiMevNetwork`.
4. Read `consensusSize` (governance) and `roundNumber` + `aggregatedCommitments` (key management), build a TPKE public key, encrypt the cached tx.
5. Return an envelope tx (`0xffffffff` prefix + round + gas + tx hash + encrypted key/msg) addressed to `governanceReward`, which the caller then sends/signs normally.

## Gotchas

- ESM with `module: nodenext`: relative imports must use the `.js` extension.
- Strict TS: `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` are on.
