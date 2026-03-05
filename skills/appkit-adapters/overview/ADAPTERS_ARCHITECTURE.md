---
status: draft
owner: Trinity
last_updated: 2026-03-04
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
- NeoX: use `WagmiAdapter` because NeoX is EVM (`eip155`). This repo provides network definitions + helper transaction senders.

## universalProviderConfigOverride
A configuration override passed to AppKit / AppKitProvider to register methods WalletConnect needs.

Neo3: `Neo3Constants.OVERRIDES`
Stellar: `StellarConstants.OVERRIDES`

If you omit it, connections may work but RPC method calls will fail (or sessions won’t negotiate expected methods).
