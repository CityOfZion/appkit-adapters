---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Quickstart (createAppKit)

## Conventions

- Package manager: **`pnpm`** (canonical for examples and validation).
- `npm` commands may be shown for reference, but in constrained environments `npm install` can exceed the ~60s limit; prefer pnpm or a cached/prebuilt environment.

## Neo3
```ts
import { createAppKit } from '@reown/appkit'
import {
  Neo3Adapter,
  neo3MainnetNetwork,
  neo3TestnetNetwork,
  Neo3Constants
} from '@cityofzion/appkit-neo3-adapter'

createAppKit({
  projectId: process.env.REOWN_PROJECT_ID!,
  adapters: [new Neo3Adapter()],
  networks: [neo3MainnetNetwork, neo3TestnetNetwork],
  metadata: {
    name: 'My Neo3 dApp',
    description: '...',
    url: 'https://example.com',
    icons: ['https://example.com/icon.png']
  },
  universalProviderConfigOverride: Neo3Constants.OVERRIDES
})
```

## Stellar
```ts
import { createAppKit } from '@reown/appkit'
import {
  StellarAdapter,
  stellarMainnetNetwork,
  stellarTestnetNetwork,
  StellarConstants
} from '@cityofzion/appkit-stellar-adapter'

createAppKit({
  projectId: process.env.REOWN_PROJECT_ID!,
  adapters: [new StellarAdapter()],
  networks: [stellarMainnetNetwork, stellarTestnetNetwork],
  metadata: {
    name: 'My Stellar dApp',
    description: '...',
    url: 'https://example.com',
    icons: ['https://example.com/icon.png']
  },
  universalProviderConfigOverride: StellarConstants.OVERRIDES
})
```

## NeoX (EVM)
Use Wagmi adapter; networks come from this repo.

```ts
import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { neoXMainnetNetwork, neoXTestnetNetwork } from '@cityofzion/appkit-neox-adapter'

const wagmiAdapter = new WagmiAdapter()

createAppKit({
  projectId: process.env.REOWN_PROJECT_ID!,
  adapters: [wagmiAdapter],
  networks: [neoXMainnetNetwork, neoXTestnetNetwork],
  metadata: {
    name: 'My NeoX dApp',
    description: '...',
    url: 'https://example.com',
    icons: ['https://example.com/icon.png']
  }
})
```
