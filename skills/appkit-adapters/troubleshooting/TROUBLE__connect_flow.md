---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Troubleshooting — Connect Flow

Organized as: **symptom → likely cause → fixes / checks**.

## Case 1 — Wallet list not appearing / modal is blank

### Symptom
- Connect UI opens but no wallets appear, or the wallet list is empty.

### Likely causes
- Missing/invalid Reown Cloud Project ID.
- Misconfigured AppKit initialization (missing required config).
- Network blocked (CSP, adblock, corporate proxy) preventing provider discovery.

### Fixes / checks
- Verify Project ID is set and being read by the app:
  - e.g. `VITE_REOWN_PROJECT_ID` exists in runtime env
- Confirm you installed the correct packages (and did not install `@reown/appkit/react`):
  - install `@reown/appkit`
  - import from `@reown/appkit/react`
- Check browser console + network tab for blocked requests.
- Try in a clean browser profile (disable extensions) and a different network.

## Case 2 — Stuck on “Connecting…”

### Symptom
- User selects a wallet but the UI never completes the connection.

### Likely causes
- Wallet app did not respond (mobile deep link not opened, extension locked).
- RPC endpoint(s) unreachable.
- Chain/network mismatch or adapter misconfiguration.

### Fixes / checks
- Ensure the wallet is unlocked and permitted to connect.
- Verify RPC URL(s) are reachable (see `TROUBLE__rpc_and_tx.md`).
- Confirm adapter-specific required overrides are set:
  - Neo3: `universalProviderConfigOverride: Neo3Constants.OVERRIDES`
  - Stellar: `universalProviderConfigOverride: StellarConstants.OVERRIDES`
- Add a connection timeout + surface actionable error to the user.
- Log structured connection events (start/success/failure + error category).

## Case 3 — User rejected the connection

### Symptom
- User cancels/declines and the app shows an error or stays in a broken state.

### Likely causes
- Normal user action; app doesn’t handle cancel/reject as a first-class state.

### Fixes / checks
- Treat as `UserCancelled` category.
- Clear pending UI state and return to a safe “disconnected” view.
- Provide a clear retry path ("Try again").

## Case 4 — Connect succeeds but app has no provider / account

### Symptom
- UI indicates connected, but reads fail or account is undefined.

### Likely causes
- App state not wired to connection state.
- Wrong provider being used for the selected adapter.

### Fixes / checks
- Ensure you read account/provider from AppKit’s state/hooks (per your integration pattern).
- For EVM, validate a simple call (e.g., `eth_chainId`) immediately after connect.
- For Neo3/Stellar, validate a safe read immediately after connect.

## Minimum telemetry to add
- connect_start
- connect_wallet_selected (wallet type)
- connect_success
- connect_failure (error category)
- disconnect
