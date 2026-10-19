---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.1
---

# Concepts

## Reown AppKit
AppKit is a UI + connection orchestration layer (WalletConnect-based) that works via:
- `createAppKit({...})` (imperative)
- `AppKitProvider` (React provider)

## Adapter
An adapter implements a chain namespace/provider binding used by AppKit.

- Neo3: `new Neo3Adapter()` with namespace `"neo3"` (not in AppKit TS types today)
- Stellar: `new StellarAdapter()` with namespace `"stellar"` (not in AppKit TS types today)
- Bitcoin: `new BitcoinAdapter()` with namespace `"bip122"` (native AppKit namespace, so no type workaround). WalletConnect only; replaces `@reown/appkit-adapter-bitcoin`.
- Neo X: use `new WagmiAdapter({ projectId, networks })` because Neo X is EVM (`eip155`). `@cityofzion/appkit-neox-adapter` is not an adapter; it provides network definitions + transaction helpers.

Neo3, Stellar, and Bitcoin share the same structure: an `AdapterBlueprint` subclass (`*Adapter`), a WalletConnect-backed connector that is the provider returned by `useAppKitProvider` (`Neo3Provider`, `StellarProvider`, `BitcoinProvider`), a `*Constants` class with `METHODS`/`EVENTS`/`OVERRIDES`, and mainnet/testnet `AppKitNetwork` definitions.

## universalProviderConfigOverride
A configuration override passed to AppKit / AppKitProvider to register methods WalletConnect needs.

Neo3: `Neo3Constants.OVERRIDES`
Stellar: `StellarConstants.OVERRIDES`
Bitcoin: `BitcoinConstants.OVERRIDES` (adds the `bip122_addressesChanged` event)

AppKit accepts one override object; with multiple adapters, merge them per namespace (see [REF__universal_provider_overrides.md](../reference/REF__universal_provider_overrides.md)).

If you omit it, connections may work but RPC method calls will fail (or sessions won’t negotiate expected methods).
