---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Quickstart (React via AppKitProvider)

## Conventions

- Package manager: **`pnpm`** (canonical for examples and validation).
- `npm` commands may be shown for reference, but in constrained environments `npm install` can exceed the ~60s limit; prefer pnpm or a cached/prebuilt environment.

## Critical pitfall (read this first)
- ❌ Never install: `@reown/appkit/react`
- ✅ Always install: `@reown/appkit`
- ✅ Then import React bindings from the subpath:
  - `import { AppKitProvider } from '@reown/appkit/react'`

## Neo3
```tsx
import { AppKitProvider } from '@reown/appkit/react'
import { Neo3Adapter, neo3MainnetNetwork, Neo3Constants } from '@cityofzion/appkit-neo3-adapter'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppKitProvider
      projectId={import.meta.env.VITE_REOWN_PROJECT_ID}
      adapters={[new Neo3Adapter()]}
      networks={[neo3MainnetNetwork]}
      metadata={{
        name: 'My Neo3 dApp',
        description: '...',
        url: 'https://example.com',
        icons: ['https://example.com/icon.png']
      }}
      universalProviderConfigOverride={Neo3Constants.OVERRIDES}
    >
      {children}
    </AppKitProvider>
  )
}
```

### Getting the chain provider
```tsx
import { useAppKitProvider } from '@reown/appkit/react'
import type { Neo3Provider } from '@cityofzion/appkit-neo3-adapter'

export function Neo3Debug() {
  // @ts-expect-error ChainNamespace does not include neo3
  const { walletProvider } = useAppKitProvider<Neo3Provider>('neo3')
  return <pre>{walletProvider ? 'neo3 provider ready' : 'no provider'}</pre>
}
```

## Stellar
Same pattern, but using `StellarAdapter` + `stellarMainnetNetwork` + `StellarConstants.OVERRIDES`.

## NeoX
NeoX is EVM: use `WagmiAdapter` + networks from `@cityofzion/appkit-neox-adapter`.
