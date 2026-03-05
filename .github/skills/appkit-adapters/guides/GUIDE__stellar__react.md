---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Guide: Stellar integration (React)

Same structure as Neo3.

## Install
```bash
npm i @reown/appkit @reown/appkit/react @cityofzion/appkit-stellar-adapter
```

## Provider setup
**REQUIRED** `universalProviderConfigOverride={StellarConstants.OVERRIDES}`.

## Access provider
```tsx
import { useAppKitProvider } from '@reown/appkit/react'
import type { StellarProvider } from '@cityofzion/appkit-stellar-adapter'

// @ts-expect-error ChainNamespace does not include stellar
const { walletProvider } = useAppKitProvider<StellarProvider>('stellar')
```
