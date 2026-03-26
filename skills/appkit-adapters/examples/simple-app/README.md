# Simple AppKit Integration Example

This is the smallest runnable example in this repo that wires the real CityOfZion AppKit integrations for Neo3, Stellar, and NeoX.

## What it demonstrates

- `createAppKit(...)` with `Neo3Adapter`
- `createAppKit(...)` with `StellarAdapter`
- NeoX wiring through `WagmiAdapter` plus `neoXTestnetNetwork`
- merged `Neo3Constants.OVERRIDES` + `StellarConstants.OVERRIDES`
- opening wallet modals for Neo3, Stellar, and NeoX
- reading provider-backed wallet metadata with `useAppKitProvider('neo3')` and `useAppKitProvider('stellar')`

## Setup

```bash
cp .env.example .env
```

Set your Reown project ID in `.env`:

```bash
VITE_REOWN_PROJECT_ID=your_project_id_here
```

## Run

```bash
pnpm install
pnpm dev
```

## Notes

- This example intentionally targets testnet networks to stay minimal.
- Neo3 and Stellar require universal provider overrides.
- NeoX is EVM-based, so it is wired through the standard `WagmiAdapter` using the `eip155` namespace.
