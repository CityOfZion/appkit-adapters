---
status: draft
owner: Trinity
last_updated: 2026-10-19
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
- add **Bitcoin** support through WalletConnect wallets such as NEON Wallet (`@cityofzion/appkit-bitcoin-adapter`, native `bip122` namespace; use it instead of `@reown/appkit-adapter-bitcoin`, never both)
- add **Neo X** network configs + anti-MEV transaction helpers for EVM (`@cityofzion/appkit-neox-adapter`) while still using the standard `WagmiAdapter`

Key gotcha: Neo3 + Stellar require `universalProviderConfigOverride` (AppKit defaults don't include those RPC methods). Bitcoin's methods are requested by AppKit already, but `BitcoinConstants.OVERRIDES` also registers the `bip122_addressesChanged` event. With several adapters, merge the overrides into one object (see [REF__universal_provider_overrides.md](../reference/REF__universal_provider_overrides.md)).

See also: upstream connect-lab demo https://cityofzion.github.io/appkit-adapters/
