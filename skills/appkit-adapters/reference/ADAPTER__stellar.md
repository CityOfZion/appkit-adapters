---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Adapter Reference — Stellar

## Install

```bash
pnpm add @cityofzion/appkit-stellar-adapter @reown/appkit @reown/appkit-common @reown/appkit-controllers @walletconnect/universal-provider
```

If you must use npm:

```bash
npm install @cityofzion/appkit-stellar-adapter @reown/appkit @reown/appkit-common @reown/appkit-controllers @walletconnect/universal-provider
```
> Note: In constrained agent environments, `npm install` can exceed the 60s execution limit. Prefer pnpm or a cached/prebuilt environment.

The Reown/WalletConnect packages are required peer dependencies.

### React bindings pitfall

- Never install: `@reown/appkit/react`
- Install: `@reown/appkit`
- Import React bindings from the subpath:

```ts
import { AppKitProvider } from '@reown/appkit/react'
```

## Exports

`StellarAdapter`, `StellarConnector`, `StellarConstants` (`OVERRIDES`, `METHODS`, `EVENTS`, `XLM_TOKEN`, `HORIZON_URL_BY_ID`), `stellarMainnetNetwork` (id `pubnet`, `stellar:pubnet`), `stellarTestnetNetwork` (id `testnet`, `stellar:testnet`), and the type `StellarProvider` (alias of `StellarConnector`).

## Init snippet (minimal)

```ts
import { createAppKit } from '@reown/appkit/react'
import {
  StellarAdapter,
  StellarConstants,
  stellarMainnetNetwork,
  stellarTestnetNetwork,
} from '@cityofzion/appkit-stellar-adapter'

export const appKit = createAppKit({
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
  adapters: [new StellarAdapter()],
  networks: [stellarMainnetNetwork, stellarTestnetNetwork],
  // REQUIRED for Stellar:
  universalProviderConfigOverride: StellarConstants.OVERRIDES
})
```

## Example app

`examples/simple-app/` wires Stellar (with `stellarTestnetNetwork`) alongside Neo3, Bitcoin, and Neo X, and calls `getNetwork()` through the provider.

See also: [GUIDE__stellar__react.md](../guides/GUIDE__stellar__react.md) for React usage.

## Provider access

```ts
import { useAppKitProvider } from '@reown/appkit/react'
import type { StellarProvider } from '@cityofzion/appkit-stellar-adapter'

// @ts-expect-error AppKit types do not yet include the stellar namespace.
const { walletProvider } = useAppKitProvider<StellarProvider>('stellar')
```

## Provider methods

| Method | Params | Response | WalletConnect method |
|---|---|---|---|
| `signTransaction` | `xdr: string` | `{ signedTxXdr, signerAddress }` | `stellar_signXDR` |
| `signAndSubmitTransaction` | `xdr: string` | submit result | `stellar_signAndSubmitXDR` |
| `signMessage` | `message: string` | signed message | `stellar_signMessage` |
| `signAuthEntry` | `xdr: string` | signed auth entry | `stellar_signAuthEntry` |
| `getNetwork` | — | wallet network info | `stellar_getNetwork` |

## Capabilities / quirks

- Requires `universalProviderConfigOverride: StellarConstants.OVERRIDES` (merged with the other adapters' overrides when you use several; see [REF__universal_provider_overrides.md](./REF__universal_provider_overrides.md)).
- AppKit's `ChainNamespace` does not include `stellar`, so `@ts-expect-error` is needed at `'stellar'` call sites.
- Network passphrase / Horizon endpoint mismatches cause confusing failures; be explicit. `StellarConstants.HORIZON_URL_BY_ID` maps `pubnet` / `testnet` to Horizon URLs.
- "Hello chain" recommended validation: connect + `getNetwork()` via the provider exposed by AppKit.