---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Quickstart (createAppKit)

## Conventions

- Package manager: **`pnpm`** (canonical for examples and validation).
- `npm` commands may be shown for reference, but in constrained environments `npm install` can exceed the ~60s limit; prefer pnpm or a cached/prebuilt environment.
- Snippets assume Vite: the project id comes from `import.meta.env.VITE_REOWN_PROJECT_ID` (never `process.env` in browser code).
- Non-EVM adapters need their required peers installed: `@reown/appkit @reown/appkit-common @reown/appkit-controllers @walletconnect/universal-provider`.

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
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
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
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
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

## Bitcoin
WalletConnect-only Bitcoin (`bip122`) for wallets such as NEON Wallet. Use it instead of `@reown/appkit-adapter-bitcoin`, never both. Not yet published to npm; build it from this repository.

```ts
import { createAppKit } from '@reown/appkit'
import {
  BitcoinAdapter,
  bitcoinMainnetNetwork,
  bitcoinTestnetNetwork,
  BitcoinConstants
} from '@cityofzion/appkit-bitcoin-adapter'

createAppKit({
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
  adapters: [new BitcoinAdapter()],
  networks: [bitcoinMainnetNetwork, bitcoinTestnetNetwork],
  metadata: {
    name: 'My Bitcoin dApp',
    description: '...',
    url: 'https://example.com',
    icons: ['https://example.com/icon.png']
  },
  universalProviderConfigOverride: BitcoinConstants.OVERRIDES
})
```

## Neo X (EVM)
Use the Wagmi adapter; networks come from `@cityofzion/appkit-neox-adapter`.

```ts
import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { neoXMainnetNetwork, neoXTestnetNetwork } from '@cityofzion/appkit-neox-adapter'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID
const networks = [neoXMainnetNetwork, neoXTestnetNetwork]

const wagmiAdapter = new WagmiAdapter({ projectId, networks })

createAppKit({
  projectId,
  adapters: [wagmiAdapter],
  networks: [neoXMainnetNetwork, neoXTestnetNetwork],
  metadata: {
    name: 'My Neo X dApp',
    description: '...',
    url: 'https://example.com',
    icons: ['https://example.com/icon.png']
  }
})
```

## Multiple chains

Pass every adapter and network to one `createAppKit` call and merge the non-EVM overrides into a single object. See [REF__universal_provider_overrides.md](../reference/REF__universal_provider_overrides.md) and `examples/simple-app/`.