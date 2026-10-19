# Simple AppKit Integration Example

This is the smallest runnable example in this repo that wires the real CityOfZion AppKit integrations for Neo3, Stellar, Bitcoin, and NeoX.

## What it demonstrates

- `createAppKit(...)` with `Neo3Adapter`, `StellarAdapter`, `BitcoinAdapter` and Reown's `WagmiAdapter`
- NeoX wiring through `WagmiAdapter` plus `neoXTestnetNetwork`
- merged `Neo3Constants.OVERRIDES` + `StellarConstants.OVERRIDES` + `BitcoinConstants.OVERRIDES` (see `src/appkit.ts`)
- opening wallet modals for Neo3, Stellar, Bitcoin, and NeoX
- calling provider methods with `useAppKitProvider('neo3')`, `useAppKitProvider('stellar')` and `useAppKitProvider('bip122')`
- sending a NeoX transaction with the anti-MEV aware `sendTransaction` helper from `@cityofzion/appkit-neox-adapter`

## Setup

The adapters are linked from this repository (`file:../../../../packages/...`), so build them first from the repository root:

```bash
rush install && rush build-packages
```

Then, in this folder:

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

The app runs at http://localhost:4173. `pnpm build` typechecks and builds it.

## Notes

- This example intentionally targets testnet networks to stay minimal.
- Neo3 and Stellar require universal provider overrides; Bitcoin's is recommended (adds the `bip122_addressesChanged` event). AppKit accepts a single override object, so they are merged per namespace.
- Neo3 and Stellar namespaces are not part of AppKit's types and need `@ts-expect-error`. Bitcoin uses the native `bip122` namespace.
- NeoX is EVM-based, so it is wired through the standard `WagmiAdapter` using the `eip155` namespace.