---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Checklist: Integration Ready

## Common
- [ ] Reown projectId provisioned and stored as env var
- [ ] App metadata set (name, url, icons)
- [ ] AppKit instance/provider configured in exactly one place
- [ ] Connect / disconnect UI flow implemented and tested

## Neo3
- [ ] `adapters` includes `new Neo3Adapter()`
- [ ] `networks` includes `neo3MainnetNetwork` (and/or testnet)
- [ ] **`universalProviderConfigOverride: Neo3Constants.OVERRIDES` is present**
- [ ] Provider access works: `useAppKitProvider<Neo3Provider>('neo3')`

## Stellar
- [ ] `adapters` includes `new StellarAdapter()`
- [ ] `networks` includes `stellarMainnetNetwork` (and/or testnet)
- [ ] **`universalProviderConfigOverride: StellarConstants.OVERRIDES` is present**
- [ ] Provider access works: `useAppKitProvider<StellarProvider>('stellar')`

## NeoX
- [ ] `adapters` includes `WagmiAdapter`
- [ ] `networks` includes `neoXMainnetNetwork`/`neoXTestnetNetwork`
- [ ] If using anti-MEV networks: transactions sent via `@cityofzion/appkit-neox-adapter` helpers
