---
status: draft
owner: Trinity
last_updated: 2026-10-19
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

## Bitcoin
- [ ] `adapters` includes `new BitcoinAdapter()` (from `@cityofzion/appkit-bitcoin-adapter`)
- [ ] `@reown/appkit-adapter-bitcoin` is **not** also registered (both claim `bip122`)
- [ ] `networks` includes `bitcoinMainnetNetwork` (and/or testnet)
- [ ] **`universalProviderConfigOverride` includes `BitcoinConstants.OVERRIDES`** (merged with the other adapters' overrides)
- [ ] Provider access works: `useAppKitProvider<BitcoinProvider>('bip122')`
- [ ] `sendTransfer` amounts are in satoshis (string)

## NeoX
- [ ] `adapters` includes `new WagmiAdapter({ projectId, networks })` with the NeoX networks
- [ ] `networks` includes `neoXMainnetNetwork`/`neoXTestnetNetwork` (or the anti-MEV variants)
- [ ] Transactions sent/signed via `sendTransaction` / `signTransaction` from `@cityofzion/appkit-neox-adapter` with `wagmiAdapter.wagmiConfig` (required for anti-MEV networks)

## Multi-chain
- [ ] Overrides of every non-EVM adapter are merged into one `universalProviderConfigOverride` (a single `XConstants.OVERRIDES` drops the others)
