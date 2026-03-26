---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Supported Environments

This library is documentation + reference examples for integrating CityOfZion AppKit adapters into apps that use **Reown AppKit**.

| Environment | Support level | Notes |
|---|---:|---|
| Vite + React (TS) | ✅ Primary | Canonical runnable example(s) live under `examples/`. Prefer `pnpm` in constrained agent/CI environments. |
| Next.js (React) | ⚠️ Supported (doc-first) | AppKit is client-side; ensure initialization happens only in client components (`'use client'`). SSR requires careful boundarying. |
| Node (backend) | ⚠️ Limited | Treat backend as a consumer of chain RPCs/SDKs; do not assume AppKit wallet connection flows work in Node. Useful for relays, indexing, verification. |
| React Native | ⚠️ Not covered in examples | May be possible but not validated here. Expect additional platform-specific wallet/deeplink constraints. |

## General guidance
- Wallet connection flows are inherently **interactive** and best suited to frontend environments.
- Backends should focus on:
  - verifying signatures/transactions
  - server-side indexing/caching
  - analytics/telemetry
  - policy/risk checks
