---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.1
---

# Checklist — New AppKit + Adapter Integration

Use this when adding Reown AppKit + an adapter to an application.

## 1) Packages (correctness)
- [ ] Install `@reown/appkit`.
- [ ] Install the correct adapter package for your chain:
  - [ ] Neo3: `@cityofzion/appkit-neo3-adapter`
  - [ ] Stellar: `@cityofzion/appkit-stellar-adapter`
  - [ ] Bitcoin: `@cityofzion/appkit-bitcoin-adapter` (do **not** also install/register `@reown/appkit-adapter-bitcoin`)
  - [ ] NeoX: `@cityofzion/appkit-neox-adapter` + `@reown/appkit-adapter-wagmi` + `@wagmi/core` + `viem` + `wagmi` + `@tanstack/react-query`
- [ ] Non-EVM adapters (Neo3, Stellar, Bitcoin): peers `@reown/appkit-common`, `@reown/appkit-controllers`, `@walletconnect/universal-provider` installed.
- [ ] NeoX: peer `@reown/appkit-common` installed.
- [ ] Confirm you did **not** install `@reown/appkit/react` (it is **not** a package).
  - [ ] React bindings must be imported via subpath: `import { createAppKit } from '@reown/appkit/react'`.

## 2) Environment + network configuration
- [ ] Reown Cloud Project ID present and wired (commonly `VITE_REOWN_PROJECT_ID`).
- [ ] RPC endpoints set/verified for target networks.
- [ ] If using overrides, they are applied:
  - [ ] Neo3: `universalProviderConfigOverride: Neo3Constants.OVERRIDES`
  - [ ] Stellar: `universalProviderConfigOverride: StellarConstants.OVERRIDES`
  - [ ] Bitcoin: `universalProviderConfigOverride: BitcoinConstants.OVERRIDES`
  - [ ] More than one: merge them into a single override object.

## 3) Basic flow validation (manual)
- [ ] App loads without runtime errors.
- [ ] Connect flow opens and completes.
- [ ] Disconnect works.
- [ ] Network selection (if present) behaves as expected.
- [ ] At least one read-only call validated end-to-end:
  - [ ] EVM (NeoX): `eth_chainId` / `eth_blockNumber`
  - [ ] Neo3: a safe read (e.g., chain height / RPC health)
  - [ ] Stellar: Horizon read (e.g., server root) or equivalent safe read
  - [ ] Bitcoin: `getAccountAddresses` or the balance shown by AppKit (fetched from mempool.space)

## 4) Minimal error handling
- [ ] User-cancel is handled (no crash; reasonable UI state).
- [ ] Missing wallet is handled (clear prompt/instructions).
- [ ] RPC failure is handled (clear retry guidance).

## 5) Notes to record (for future maintainers)
- [ ] Document required env vars and example `.env` entries.
- [ ] Document the exact adapter + version used.
- [ ] Document any chain-specific quirks discovered.
