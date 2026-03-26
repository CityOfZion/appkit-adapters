---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Checklist — New AppKit + Adapter Integration

Use this when adding Reown AppKit + an adapter to an application.

## 1) Packages (correctness)
- [ ] Install `@reown/appkit`.
- [ ] Install the correct adapter package for your chain:
  - [ ] Neo3: `@cityofzion/appkit-neo3-adapter`
  - [ ] NeoX: `@reown/appkit-adapter-wagmi`
  - [ ] Stellar: `@reown/appkit-adapter-stellar`
- [ ] Confirm you did **not** install `@reown/appkit/react` (it is **not** a package).
  - [ ] React bindings must be imported via subpath: `import { createAppKit } from '@reown/appkit/react'`.

## 2) Environment + network configuration
- [ ] Reown Cloud Project ID present and wired (commonly `VITE_REOWN_PROJECT_ID`).
- [ ] RPC endpoints set/verified for target networks.
- [ ] If using overrides, they are applied:
  - [ ] Neo3: `universalProviderConfigOverride: Neo3Constants.OVERRIDES`
  - [ ] Stellar: `universalProviderConfigOverride: StellarConstants.OVERRIDES`

## 3) Basic flow validation (manual)
- [ ] App loads without runtime errors.
- [ ] Connect flow opens and completes.
- [ ] Disconnect works.
- [ ] Network selection (if present) behaves as expected.
- [ ] At least one read-only call validated end-to-end:
  - [ ] EVM (NeoX): `eth_chainId` / `eth_blockNumber`
  - [ ] Neo3: a safe read (e.g., chain height / RPC health)
  - [ ] Stellar: Horizon read (e.g., server root) or equivalent safe read

## 4) Minimal error handling
- [ ] User-cancel is handled (no crash; reasonable UI state).
- [ ] Missing wallet is handled (clear prompt/instructions).
- [ ] RPC failure is handled (clear retry guidance).

## 5) Notes to record (for future maintainers)
- [ ] Document required env vars and example `.env` entries.
- [ ] Document the exact adapter + version used.
- [ ] Document any chain-specific quirks discovered.
