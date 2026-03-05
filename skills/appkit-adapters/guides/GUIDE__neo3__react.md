---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Guide: Neo3 integration (React)

## Requirements
- Reown Cloud project id (`projectId`) from https://cloud.reown.com
- Install deps:
```bash
npm i @reown/appkit @reown/appkit/react @cityofzion/appkit-neo3-adapter
```

## Provider setup
Use `AppKitProvider` with:
- `adapters={[new Neo3Adapter()]}`
- `networks={[neo3MainnetNetwork, neo3TestnetNetwork]}`
- **REQUIRED** `universalProviderConfigOverride={Neo3Constants.OVERRIDES}`

## Access provider
```tsx
import { useAppKitProvider } from '@reown/appkit/react'
import type { Neo3Provider } from '@cityofzion/appkit-neo3-adapter'

// @ts-expect-error ChainNamespace does not include neo3
const { walletProvider } = useAppKitProvider<Neo3Provider>('neo3')
```

## Common failure modes
- Missing `universalProviderConfigOverride` => methods not negotiated
- TS errors on namespace => use `@ts-expect-error`
