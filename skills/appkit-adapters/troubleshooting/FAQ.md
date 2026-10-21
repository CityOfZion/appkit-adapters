---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.1
---

# FAQ

## Do I need WalletConnect v2 knowledge?
Not directly; AppKit abstracts it. You do need a Reown Cloud `projectId`.

## Why is NeoX different?
NeoX is EVM-compatible; it uses `eip155`. That means you use the standard EVM adapter (`WagmiAdapter`) and only import NeoX networks/utilities from this repo.

## Why do Neo3 and Stellar need overrides?
AppKit does not ship their method sets by default, so session method negotiation needs explicit overrides.

## Does Bitcoin need overrides too?
Recommended, not required: pass `BitcoinConstants.OVERRIDES`. `bip122` is native to AppKit (so no `@ts-expect-error`) and AppKit already requests the Bitcoin methods; the override keeps the default `accountsChanged` / `chainChanged` events and adds `bip122_addressesChanged`. With several adapters, merge all overrides into one object.

## Should I use `@cityofzion/appkit-bitcoin-adapter` or `@reown/appkit-adapter-bitcoin`?
One, never both: both register the `bip122` namespace. The CityOfZion adapter is WalletConnect-only (compatible with NEON Wallet) and sends the `account` param on every request; Reown's also covers browser extension wallets (Xverse, Leather, Unisat, OKX...).
