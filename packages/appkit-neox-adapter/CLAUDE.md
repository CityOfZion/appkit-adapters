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

No tests. Verify in `apps/connect-lab` (`src/components/methods/neox-methods.tsx`), which defaults to the anti-MEV networks; the Normal / Anti-MEV toggle on the connected page switches to `neoXMainnetNetwork` / `neoXTestnetNetwork`.

## Structure

- `networks.ts` — extends `neoxMainnet` / `neoxT4` from `@reown/appkit/networks` with `contracts` (`governance`, `governanceReward`, `keyManagement` system contracts). Anti-MEV variants differ **only** by `rpcUrls`.
- `actions.ts` — `sendTransaction` / `signTransaction` wrappers around `@wagmi/core`. dApps must use these instead of plain wagmi calls to get anti-MEV behavior.
- `abis/` — large generated ABI constants for the governance and key-management contracts; don't hand-edit.

## Anti-MEV flow (`buildAntiMevTransaction`)

1. `isAntiMevNetwork` decides by comparing the client chain's first RPC URL against the anti-MEV network's RPC URL.
2. Send the tx with an explicit pending nonce; the anti-MEV RPC caches it and errors with `"transaction cached"` (expected, swallowed).
3. Sign the nonce as a message and fetch the cached raw tx via `eth_getCachedTransaction`.
4. Read `consensusSize` (governance) and `roundNumber` + `aggregatedCommitments` (key management), build a TPKE public key, encrypt the cached tx.
5. Return an envelope tx (`0xffffffff` prefix + round + gas + tx hash + encrypted key/msg) addressed to `governanceReward`, which the caller then sends/signs normally.

## Gotchas

- ESM with `module: nodenext`: relative imports must use the `.js` extension.
- Strict TS: `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` are on.
