---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Quickstart — React + AppKit base pattern

## Critical import rule

- Install `@reown/appkit`
- Import React APIs from `@reown/appkit/react`
- Do not try to install `@reown/appkit/react` as its own package

## Validated bootstrap pattern

The examples in this repository use `createAppKit(...)` during app bootstrap.

### Neo3

```ts
import { createAppKit } from '@reown/appkit/react'
import {
  Neo3Adapter,
  Neo3Constants,
  neo3MainnetNetwork,
} from '@cityofzion/appkit-neo3-adapter'

createAppKit({
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
  adapters: [new Neo3Adapter()],
  networks: [neo3MainnetNetwork],
  metadata: {
    name: 'My Neo3 dApp',
    description: 'Example app',
    url: 'http://localhost:5173',
    icons: ['https://example.com/icon.png'],
  },
  universalProviderConfigOverride: Neo3Constants.OVERRIDES,
})
```

### Getting the chain provider

```tsx
import { useAppKitProvider } from '@reown/appkit/react'
import type { Neo3Provider } from '@cityofzion/appkit-neo3-adapter'

export function Neo3Debug() {
  // @ts-expect-error ChainNamespace does not yet include neo3
  const { walletProvider } = useAppKitProvider<Neo3Provider>('neo3')
  return <pre>{walletProvider ? 'neo3 provider ready' : 'no provider'}</pre>
}
```

### Stellar

Use the same pattern with:
- `StellarAdapter`
- `stellarMainnetNetwork` / `stellarTestnetNetwork`
- `StellarConstants.OVERRIDES`

### Bitcoin

Use the same pattern with:
- `BitcoinAdapter`
- `bitcoinMainnetNetwork` / `bitcoinTestnetNetwork`
- `BitcoinConstants.OVERRIDES`
- `useAppKitProvider<BitcoinProvider>('bip122')` — `bip122` is a native AppKit namespace, so no `@ts-expect-error`

```tsx
import { useAppKitProvider } from '@reown/appkit/react'
import type { BitcoinProvider } from '@cityofzion/appkit-bitcoin-adapter'

export function BitcoinDebug() {
  const { walletProvider } = useAppKitProvider<BitcoinProvider>('bip122')
  return <pre>{walletProvider ? 'bip122 provider ready' : 'no provider'}</pre>
}
```

Do not also register `@reown/appkit-adapter-bitcoin`; both claim the `bip122` namespace.

### Neo X

Neo X is wired as EVM support through wagmi:
- use `new WagmiAdapter({ projectId, networks })` from `@reown/appkit-adapter-wagmi`
- use Neo X networks from `@cityofzion/appkit-neox-adapter`
- do not expect a separate Neo X adapter object in `adapters`

### Several chains at once

Register all adapters and networks in one `createAppKit` call and merge the overrides of the non-EVM adapters into one `universalProviderConfigOverride` (see [REF__universal_provider_overrides.md](../reference/REF__universal_provider_overrides.md) and `examples/simple-app/`).
