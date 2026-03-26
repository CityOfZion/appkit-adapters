---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Guide: Which adapter do I use?

| Chain | Package | AppKit namespace | Adapter used in AppKit | Special config |
|---|---|---|---|---|
| Neo N3 | `@cityofzion/appkit-neo3-adapter` | `neo3` | `new Neo3Adapter()` | **REQUIRED** `universalProviderConfigOverride: Neo3Constants.OVERRIDES` |
| Stellar | `@cityofzion/appkit-stellar-adapter` | `stellar` | `new StellarAdapter()` | **REQUIRED** `universalProviderConfigOverride: StellarConstants.OVERRIDES` |
| NeoX | `@cityofzion/appkit-neox-adapter` | `eip155` | `new WagmiAdapter()` | Optional anti-MEV networks + **use `sendTransaction` helper** |

Decision rule:
- If the chain is not EVM, use its dedicated adapter and include the provider overrides.
- If the chain is EVM-compatible (NeoX), use Wagmi adapter; treat `@cityofzion/appkit-neox-adapter` as a network+utility package.
