---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Guide: Stellar integration (React)

Same structure as Neo3. Working reference: `examples/simple-app/`.

## Install
```bash
pnpm add @cityofzion/appkit-stellar-adapter @reown/appkit @reown/appkit-common @reown/appkit-controllers @walletconnect/universal-provider
```

Install `@reown/appkit` (not `@reown/appkit/react`; that is an import subpath). The other Reown/WalletConnect packages are required peers.

## Setup
Call `createAppKit` from `@reown/appkit/react` with:
- `adapters: [new StellarAdapter()]`
- `networks: [stellarMainnetNetwork, stellarTestnetNetwork]`
- **REQUIRED** `universalProviderConfigOverride: StellarConstants.OVERRIDES` (merged with other adapters' overrides when you use several)

See [ADAPTER__stellar.md](../reference/ADAPTER__stellar.md) for the full snippet.

## Access provider
```tsx
import { useAppKitProvider } from '@reown/appkit/react'
import type { StellarProvider } from '@cityofzion/appkit-stellar-adapter'

export function StellarNetwork() {
  // @ts-expect-error ChainNamespace does not include stellar
  const { walletProvider } = useAppKitProvider<StellarProvider>('stellar')

  async function show() {
    if (!walletProvider) return
    console.log(await walletProvider.getNetwork())
  }

  return <button onClick={show} disabled={!walletProvider}>getNetwork()</button>
}
```

Other provider methods: `signTransaction(xdr)` returns `{ signedTxXdr, signerAddress }`, plus `signAndSubmitTransaction(xdr)`, `signMessage(message)`, `signAuthEntry(xdr)`.

## Common failure modes
- Missing `StellarConstants.OVERRIDES` => methods not negotiated
- TS errors on namespace => use `@ts-expect-error` ([GUIDE__typescript_namespaces.md](./GUIDE__typescript_namespaces.md))
