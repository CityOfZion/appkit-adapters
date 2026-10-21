---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Reference: exported networks

All networks are `AppKitNetwork` objects exported from the package root.

## Neo3 (`@cityofzion/appkit-neo3-adapter`)
- `neo3MainnetNetwork` — `neo3:mainnet`
- `neo3TestnetNetwork` — `neo3:testnet`

## Stellar (`@cityofzion/appkit-stellar-adapter`)
- `stellarMainnetNetwork` — id `pubnet`, `stellar:pubnet`
- `stellarTestnetNetwork` — id `testnet`, `stellar:testnet`

## Bitcoin (`@cityofzion/appkit-bitcoin-adapter`)
- `bitcoinMainnetNetwork` — `bip122:000000000019d6689c085ae165831e93`
- `bitcoinTestnetNetwork` — `bip122:000000000933ea01ad0ee984209779ba`

The chain ids are also available as `BitcoinConstants.MAINNET_CHAIN_ID` / `BitcoinConstants.TESTNET_CHAIN_ID`.

## Neo X (`@cityofzion/appkit-neox-adapter`)
- `neoXMainnetNetwork` — chain id 47763 (`eip155:47763`)
- `neoXTestnetNetwork` — chain id 12227332 (`eip155:12227332`)
- `neoXAntiMevMainnetNetwork` — mainnet via the anti-MEV RPC
- `neoXAntiMevTestnetNetwork` — testnet via the anti-MEV RPC

Pass Neo X networks both to `new WagmiAdapter({ projectId, networks })` and to `createAppKit({ networks })`.
