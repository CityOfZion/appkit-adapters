---
status: draft
owner: Trinity
last_updated: 2026-03-25
version: 0.2
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

```ts
import { useAppKitProvider } from '@reown/appkit/react'
import type { Neo3Provider } from '@cityofzion/appkit-neo3-adapter'

function Neo3Debug() {
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

### NeoX

NeoX is wired as EVM support through wagmi:
- use `WagmiAdapter`
- use NeoX networks from `@cityofzion/appkit-neox-adapter`
- do not expect a separate NeoX adapter object in `adapters`
