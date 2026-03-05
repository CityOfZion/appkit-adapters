---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Checklist — Agent Tool Review (Before Exposure)

Use this before exposing any new agent-accessible tool/function that interacts with AppKit, wallets, RPCs, or on-chain actions.

## Contract clarity
- [ ] Inputs are explicit, typed, and documented.
- [ ] Outputs are explicit, typed, and documented.
- [ ] Idempotency is defined (especially for "submit" operations).
- [ ] Side effects are stated (network calls, tx broadcasts, state persistence).

## Error model (agent-reasonable)
- [ ] Errors are mapped into a small set of categories the agent can reason about:
  - [ ] UserActionRequired (e.g., approve in wallet)
  - [ ] UserCancelled
  - [ ] Misconfiguration (missing env/RPC/projectId)
  - [ ] Network/RPC (timeouts, 5xx)
  - [ ] RateLimited
  - [ ] InvalidInput
  - [ ] Internal
- [ ] Raw stack traces are not surfaced as primary output.
- [ ] Retry guidance is documented (when safe; when not).

## Safety + rate limits
- [ ] Rate limits/backoff behavior is defined.
- [ ] Any "write" operation has explicit safety gates:
  - [ ] requires explicit confirmation
  - [ ] logs intent + resulting tx hash
  - [ ] prevents accidental mainnet actions (if applicable)

## Testing
- [ ] At least one happy-path test.
- [ ] At least one failure-mode test (e.g., RPC down or user cancel).
- [ ] Deterministic behavior validated (no flaky timing dependencies).

## Observability
- [ ] Tool emits structured logs with a request id / correlation id.
- [ ] Tool logs error category and minimal context.
