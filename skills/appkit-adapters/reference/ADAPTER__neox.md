---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Adapter Reference — Neo X (EVM)

`@cityofzion/appkit-neox-adapter` is **not** an AppKit adapter (it does not extend `AdapterBlueprint`). Neo X is EVM (`eip155`), so you register Reown's `WagmiAdapter` and use this package for network definitions and transaction helpers.

## Install

```bash
pnpm add @cityofzion/appkit-neox-adapter @reown/appkit @reown/appkit-common @reown/appkit-adapter-wagmi @wagmi/core viem wagmi @tanstack/react-query
```

If you must use npm:

```bash
npm install @cityofzion/appkit-neox-adapter @reown/appkit @reown/appkit-common @reown/appkit-adapter-wagmi @wagmi/core viem wagmi @tanstack/react-query
```
> Note: In constrained agent environments, `npm install` can exceed the 60s execution limit. Prefer pnpm or a cached/prebuilt environment.

Peers of the package: `@reown/appkit`, `@reown/appkit-common`, `viem`, `@wagmi/core`. The only export path is the package root (there is no `/networks` subpath).

### React bindings pitfall

- Never install: `@reown/appkit/react`
- Install: `@reown/appkit`
- Import React bindings from the subpath:

```ts
import { AppKitProvider } from '@reown/appkit/react'
```

## Init snippet (minimal)

```ts
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { neoXMainnetNetwork, neoXTestnetNetwork } from '@cityofzion/appkit-neox-adapter'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [neoXMainnetNetwork, neoXTestnetNetwork],
})

export const appKit = createAppKit({
  projectId,
  adapters: [wagmiAdapter],
  networks: [neoXMainnetNetwork, neoXTestnetNetwork],
})
```

`WagmiAdapter` requires `{ projectId, networks }`, and `createAppKit` requires `networks`.

## Exports

Networks:
- `neoXMainnetNetwork` (chain id 47763)
- `neoXTestnetNetwork` (chain id 12227332)
- `neoXAntiMevMainnetNetwork`, `neoXAntiMevTestnetNetwork` — same chains routed through anti-MEV RPCs

Helpers (first argument is the wagmi config, i.e. `wagmiAdapter.wagmiConfig`):
- `sendTransaction(wagmiConfig, params)` — sends normally, or builds an anti-MEV envelope when connected to an anti-MEV network
- `signTransaction(wagmiConfig, params)` — same switch, signing only
- `buildAntiMevTransaction(wagmiConfig, params)` — builds the anti-MEV envelope transaction
- `getCachedTransaction(wagmiConfig, { nonce, signature, chainId? })` — reads a cached anti-MEV transaction
- `isAntiMevNetwork(network)` — whether a network uses the anti-MEV RPC

ABIs: `governanceAbi`, `keyManagementAbi`.

```ts
import { sendTransaction } from '@cityofzion/appkit-neox-adapter'
import { parseEther } from 'viem'

const hash = await sendTransaction(wagmiAdapter.wagmiConfig, {
  to: '0x0000000000000000000000000000000000000000',
  value: parseEther('0.01'),
})
```

## Example app

`examples/simple-app/` registers `new WagmiAdapter({ projectId, networks: [neoXTestnetNetwork] })` next to the Neo3, Stellar, and Bitcoin adapters.

See also: [GUIDE__neox__wagmi.md](../guides/GUIDE__neox__wagmi.md) for Neo X-specific patterns.

## Capabilities / quirks

- Neo X is EVM (`eip155`): no `universalProviderConfigOverride` and no `@ts-expect-error` needed.
- Ensure you're on the correct EVM chain id / RPC for Neo X.
- Gas estimation failures: implement retry + user-friendly fallback.
- For anti-MEV / private transaction routing, add the `neoXAntiMev*Network` networks and use the package's `sendTransaction` / `signTransaction` instead of raw wagmi actions.

## Supported operations (typical)

- connect / disconnect
- read account + chain
- read-only calls via viem / wagmi
- sign typed data / sign message (standard wagmi actions)
- send / sign transaction (package helpers, anti-MEV aware)