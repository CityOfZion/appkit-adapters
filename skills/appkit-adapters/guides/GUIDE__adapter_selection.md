---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Guide: Which adapter do I use?

| Chain | Package | AppKit namespace | Adapter used in AppKit | Special config |
|---|---|---|---|---|
| Neo N3 | `@cityofzion/appkit-neo3-adapter` | `neo3` | `new Neo3Adapter()` | **REQUIRED** `universalProviderConfigOverride: Neo3Constants.OVERRIDES`; `@ts-expect-error` at `'neo3'` call sites |
| Stellar | `@cityofzion/appkit-stellar-adapter` | `stellar` | `new StellarAdapter()` | **REQUIRED** `universalProviderConfigOverride: StellarConstants.OVERRIDES`; `@ts-expect-error` at `'stellar'` call sites |
| Bitcoin | `@cityofzion/appkit-bitcoin-adapter` | `bip122` (native) | `new BitcoinAdapter()` | `BitcoinConstants.OVERRIDES` (adds `bip122_addressesChanged`); WalletConnect only; do not combine with `@reown/appkit-adapter-bitcoin` |
| Neo X | `@cityofzion/appkit-neox-adapter` | `eip155` | `new WagmiAdapter({ projectId, networks })` | Optional anti-MEV networks + **use the package's `sendTransaction` / `signTransaction` helpers** |

Decision rule:
- If the chain is not EVM, use its dedicated adapter and include its provider overrides. With more than one, merge the overrides into one object ([REF__universal_provider_overrides.md](../reference/REF__universal_provider_overrides.md)).
- For Bitcoin, pick this adapter when targeting WalletConnect wallets such as NEON Wallet; pick Reown's `@reown/appkit-adapter-bitcoin` if you need browser extension wallets (Xverse, Leather, Unisat, OKX). Never register both.
- If the chain is EVM-compatible (Neo X), use the Wagmi adapter; treat `@cityofzion/appkit-neox-adapter` as a network + utility package.

Working multi-chain wiring: `examples/simple-app/`.
