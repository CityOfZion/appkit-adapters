---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Troubleshooting — RPC and Transactions

Organized as: **symptom → likely cause → fixes / interpretation**.

## Case 1 — RPC timeout / network error

### Symptom
- Requests hang or fail with timeout / `ECONNRESET` / "Failed to fetch".

### Likely causes
- RPC endpoint is down or blocked.
- Client environment blocks outbound requests (CSP, proxy, firewall).
- Rate limiting causing slow retries.

### Fixes / checks
- Verify RPC URL is correct and reachable from the user’s network.
- Add explicit timeouts and retry/backoff (bounded).
- Provide a fallback RPC (where appropriate) or allow user to switch networks.
- Categorize error as `Network/RPC` vs `RateLimited`.

## Case 2 — Rate limited (429 / throttling)

### Symptom
- HTTP 429, "too many requests", or provider-specific throttling messages.

### Likely causes
- Shared/public RPC endpoint.
- Bursty polling (block number, balances) without backoff.

### Fixes / checks
- Reduce polling frequency; prefer event-driven updates.
- Implement exponential backoff with jitter.
- Use a paid/dedicated RPC for production.
- Cache read-only responses where safe.

## Case 3 — Wrong network / chain mismatch

### Symptom
- Reads return unexpected data; tx fails immediately; chainId mismatch.

### Likely causes
- AppKit configured for one chain, wallet is on another.
- Networks list misconfigured.

### Fixes / checks
- Validate chain/network at connect time.
- Prompt user to switch network (where supported) with clear instructions.
- Log chainId/network in telemetry for failures.

## Case 4 — Insufficient funds / fee issues

### Symptom
- Tx fails with "insufficient funds", "intrinsic gas too low", "fee too low", or similar.

### Likely causes
- User lacks native token for fees.
- Gas/fee parameters miscomputed or stale.

### Fixes / checks
- Show user a clear message: they need native token for fees.
- Re-estimate fees right before submission.
- Provide a "copy address" flow and link to funding instructions (if applicable).

## Case 5 — User rejected signature/transaction

### Symptom
- Wallet prompt shown; user rejects.

### Likely causes
- Normal user action.

### Fixes / checks
- Categorize as `UserCancelled`.
- Return to safe UI state; allow retry.
- Do not retry automatically.

## Case 6 — Transaction broadcasted but not confirmed

### Symptom
- You have a tx hash but UI never reaches "confirmed".

### Likely causes
- Network congestion.
- Using an RPC that doesn’t provide reliable websocket/subscription.
- Confirmation logic missing/backoff too aggressive.

### Fixes / checks
- Implement confirmation polling with backoff + timeout.
- Offer a block explorer link immediately after broadcast.
- After timeout, show "pending" state with manual refresh.

## Error categorization (recommended)
- Misconfiguration
- Network/RPC
- RateLimited
- UserCancelled
- InsufficientFunds
- FeeEstimationFailed
- TxRejected (wallet rejection)
- TxReverted (EVM execution revert)
- Internal
