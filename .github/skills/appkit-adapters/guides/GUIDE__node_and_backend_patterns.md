---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Guide — Node and Backend Patterns

Honest guidance:

- AppKit is primarily a **frontend wallet connection** UX.
- Backend services should not try to “run AppKit”.

Backend patterns that *do* make sense:

- Verification service:
  - verify signatures
  - validate tx payloads
  - enforce allow-lists / policy checks
- Indexing/caching:
  - cache read-only RPC results
  - build derived aggregates
- Relays (where chain supports it):
  - submit pre-signed txs
  - track confirmations

Operational notes:
- Always use explicit RPC timeouts.
- Prefer idempotent retry strategies for reads.
- Never log private keys / secrets.
