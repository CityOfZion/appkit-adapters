---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Reference: exports & types

Public exports of each package (all from the package root; none of the packages define subpath exports).

## `@cityofzion/appkit-neo3-adapter`
- `Neo3Adapter` (extends AppKit `AdapterBlueprint`)
- `Neo3Connector`
- `Neo3Constants` — `OVERRIDES`, `METHODS`, `EVENTS`, `GAS_TOKEN`
- `neo3MainnetNetwork`, `neo3TestnetNetwork`
- `ProviderEventEmitter`
- type `Neo3Provider` (= `Neo3Connector`)

Details: [ADAPTER__neo3.md](./ADAPTER__neo3.md)

## `@cityofzion/appkit-stellar-adapter`
- `StellarAdapter` (extends `AdapterBlueprint`)
- `StellarConnector`
- `StellarConstants` — `OVERRIDES`, `METHODS`, `EVENTS`, `XLM_TOKEN`, `HORIZON_URL_BY_ID`
- `stellarMainnetNetwork`, `stellarTestnetNetwork`
- type `StellarProvider` (= `StellarConnector`)

Details: [ADAPTER__stellar.md](./ADAPTER__stellar.md)

## `@cityofzion/appkit-bitcoin-adapter`
- `BitcoinAdapter` (extends `AdapterBlueprint`)
- `BitcoinConnector` and its `TBitcoinConnector*` param/response types
- `BitcoinConstants` — `OVERRIDES`, `METHODS`, `EVENTS`, `MAINNET_CHAIN_ID`, `TESTNET_CHAIN_ID`, `MEMPOOL_API_URL_BY_ID`, `BTC_TOKEN`
- `bitcoinMainnetNetwork`, `bitcoinTestnetNetwork`
- type `BitcoinProvider` (= `BitcoinConnector`)

Details: [ADAPTER__bitcoin.md](./ADAPTER__bitcoin.md)

## `@cityofzion/appkit-neox-adapter`
Not an `AdapterBlueprint`; used with `WagmiAdapter`.
- Networks: `neoXMainnetNetwork`, `neoXTestnetNetwork`, `neoXAntiMevMainnetNetwork`, `neoXAntiMevTestnetNetwork`
- Actions: `sendTransaction(wagmiConfig, params)`, `signTransaction(wagmiConfig, params)`, `buildAntiMevTransaction(wagmiConfig, params)`, `getCachedTransaction(wagmiConfig, params)`, `isAntiMevNetwork(network)`
- Type: `GetCachedTransactionParameters`
- ABIs: `governanceAbi`, `keyManagementAbi`

Details: [ADAPTER__neox.md](./ADAPTER__neox.md)
