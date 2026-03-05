---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Adapter Reference — NeoX (EVM)

## Install

```bash
pnpm add @reown/appkit @reown/appkit-adapter-wagmi @cityofzion/appkit-neox-adapter
```

If you must use npm:

```bash
npm install @reown/appkit @reown/appkit-adapter-wagmi @cityofzion/appkit-neox-adapter
```
> Note: In constrained agent environments, `npm install` can exceed the 60s execution limit. Prefer pnpm or a cached/prebuilt environment.

### React bindings pitfall

- ❌ Never install: `@reown/appkit/react`
- ✅ Install: `@reown/appkit`
- ✅ Import React bindings from the subpath:

```ts
import { AppKitProvider } from '@reown/appkit/react'
```

## Init snippet (minimal)

```ts
import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { neoxMainnet, neoxTestnet /* (names illustrative) */ } from '@cityofzion/appkit-neox-adapter'

const wagmi = new WagmiAdapter({
  networks: [neoxMainnet, neoxTestnet]
})

export const appKit = createAppKit({
  projectId: process.env.VITE_REOWN_PROJECT_ID,
  adapters: [wagmi]
})
```

## Example app

There is no separate NeoX example app yet. For a working end-to-end reference, use the canonical Neo3 Vite example:

- `examples/vite-react-neo3/`

When adapting that example for NeoX:

- Keep the overall structure and React/Vite wiring the same.
- Change only:
  - the adapter import (`@cityofzion/appkit-neox-adapter` instead of the Neo3 adapter), and
  - the network configuration (NeoX chains / RPC details).

See also: `guides/GUIDE__neox__wagmi.md` for NeoX-specific patterns.

## Capabilities / quirks

- NeoX is EVM (`eip155`). Use Wagmi.
- Ensure you’re on the correct EVM chain id / RPC for NeoX.
- Gas estimation failures: implement retry + user-friendly fallback.
- If anti-MEV/private tx routing is desired, document the provider/RPC requirement explicitly.
- If the network is anti-MEV / requires special tx formatting, use the adapter’s helper (see repo docs) rather than raw wagmi `sendTransaction`.

## Supported operations (typical)

- connect / disconnect
- read account + chain
- read-only calls via viem
- sign typed data / sign message
- send transaction
