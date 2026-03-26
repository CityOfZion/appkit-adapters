---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Overview

`CityOfZion/appkit-adapters` is a set of chain adapters / utilities that plug into **Reown AppKit** (formerly WalletConnect AppKit).

## Reown AppKit basics

- `@reown/appkit` is the core package you install.
- `@reown/appkit/react` is a **subpath import** that lives inside `@reown/appkit`.

### Critical pitfall (lock this in)
- ❌ Never install: `@reown/appkit/react`
- ✅ Always install: `@reown/appkit`
- ✅ Then import from the subpath:

```ts
import { AppKitProvider } from '@reown/appkit/react'
```

## What these adapters do

You use them to:
- add **Neo3** support to an AppKit-based dApp (`@cityofzion/appkit-neo3-adapter`)
- add **Stellar** support (`@cityofzion/appkit-stellar-adapter`)
- add **NeoX** network configs + anti-MEV transaction helpers for EVM (`@cityofzion/appkit-neox-adapter`) while still using the standard `WagmiAdapter`

Key gotcha: Neo3 + Stellar require `universalProviderConfigOverride` (AppKit defaults don’t include those RPC methods).

See also: upstream connect-lab demo https://cityofzion.github.io/appkit-adapters/
