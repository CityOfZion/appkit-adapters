---
status: draft
owner: Trinity
last_updated: 2026-10-19
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
- NeoX anti-MEV: the anti-MEV networks are separate entries (`neoXAntiMevMainnetNetwork` / `neoXAntiMevTestnetNetwork`) with their own RPC; `isAntiMevNetwork(network)` tells which one is active.

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
- Bitcoin: `sendTransfer` takes `amount` in **satoshis** (string); passing BTC units sends 100,000,000x less than intended or fails on dust limits.

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

## Case 7 — Bitcoin balance always 0

### Symptom
- Connected to Bitcoin, but AppKit shows a 0 BTC balance.

### Likely causes
- `BitcoinAdapter` reads balances from the mempool.space REST API (`https://mempool.space/api`, `https://mempool.space/testnet/api`); request failures are swallowed and reported as 0.
- CSP / adblock / proxy blocks `mempool.space`, or the API rate-limits you.
- The wallet address belongs to the other network (mainnet vs testnet).

### Fixes / checks
- Allow `https://mempool.space` in `connect-src`.
- Check the network tab for the `/address/<address>` request.
- Confirm the active network matches the address type (`bc1...` mainnet, `tb1...` testnet).

## Case 8 — NeoX anti-MEV send fails or prompts several times

### Symptom
- On an anti-MEV network, the wallet prompts several times (transaction, message signature, transaction again), or the send fails with "transaction cached"-style errors.

### Likely causes
- Expected: the anti-MEV flow sends the transaction (cached by the node), asks for a nonce signature, then sends the encrypted envelope.
- Plain wagmi `sendTransaction` used instead of the package's, so the cached transaction is never wrapped.

### Fixes / checks
- Use `sendTransaction` / `signTransaction` from `@cityofzion/appkit-neox-adapter` with `wagmiAdapter.wagmiConfig`.
- Explain the multiple prompts in the UI.

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
