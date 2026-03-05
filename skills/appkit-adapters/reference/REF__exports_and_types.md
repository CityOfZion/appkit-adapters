---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Reference: exports & types (high-level)

This library intentionally keeps reference-level docs high-level; agents should confirm exact exports against installed package versions.

## `@cityofzion/appkit-neo3-adapter`
Likely exports (per README):
- `Neo3Adapter`
- `Neo3Constants`
- `neo3MainnetNetwork`, `neo3TestnetNetwork`
- types like `Neo3Provider`

## `@cityofzion/appkit-stellar-adapter`
- `StellarAdapter`
- `StellarConstants`
- `stellarMainnetNetwork`, `stellarTestnetNetwork`
- types like `StellarProvider`

## `@cityofzion/appkit-neox-adapter`
- `neoX*Network` definitions
- `sendTransaction(config, params)` helper for anti-MEV support
