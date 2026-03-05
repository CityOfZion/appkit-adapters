---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# FAQ

## Do I need WalletConnect v2 knowledge?
Not directly; AppKit abstracts it. You do need a Reown Cloud `projectId`.

## Why is NeoX different?
NeoX is EVM-compatible; it uses `eip155`. That means you use the standard EVM adapter (`WagmiAdapter`) and only import NeoX networks/utilities from this repo.

## Why do Neo3 and Stellar need overrides?
AppKit does not ship their method sets by default, so session method negotiation needs explicit overrides.
