---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Reference: universalProviderConfigOverride

## Why it exists
WalletConnect (via AppKit) negotiates supported RPC methods and events in the session. AppKit's defaults do not include the Neo3/Stellar methods, nor the `bip122_addressesChanged` event.

Each `*Constants.OVERRIDES` has the shape `{ methods?, chains?, events?, rpcMap? }`, keyed by namespace.

## Neo3
- constant: `Neo3Constants.OVERRIDES` (`methods.neo3`, `events.neo3`)
- required: yes

## Stellar
- constant: `StellarConstants.OVERRIDES` (`methods.stellar`, `events.stellar`)
- required: yes

## Bitcoin
- constant: `BitcoinConstants.OVERRIDES` (`methods.bip122`: `getAccountAddresses`, `signMessage`, `signPsbt`, `sendTransfer`; `events.bip122`: `accountsChanged`, `chainChanged`, `bip122_addressesChanged`)
- required: recommended; AppKit already requests the methods, the override adds the event

## Neo X
Not used (EVM uses default `eip155` methods).

## Several adapters: merge manually

`createAppKit` takes **one** `universalProviderConfigOverride` object. When you register more than one non-EVM adapter, merge their overrides per namespace yourself; passing only one constant drops the others' methods. Pattern used by `apps/connect-lab/src/helpers/appkit.ts`:

```ts
import { createAppKit } from '@reown/appkit/react'
import { Neo3Adapter, Neo3Constants, neo3TestnetNetwork } from '@cityofzion/appkit-neo3-adapter'
import { StellarAdapter, StellarConstants, stellarTestnetNetwork } from '@cityofzion/appkit-stellar-adapter'
import { BitcoinAdapter, BitcoinConstants, bitcoinTestnetNetwork } from '@cityofzion/appkit-bitcoin-adapter'

type TUniversalProviderConfigOverride = {
  methods?: Record<string, string[]>
  chains?: Record<string, string[]>
  events?: Record<string, string[]>
  rpcMap?: Record<string, string>
}

function mergeUniversalProviderConfigOverride(
  ...overrides: TUniversalProviderConfigOverride[]
): TUniversalProviderConfigOverride {
  const merged = {
    methods: {} as Record<string, string[]>,
    chains: {} as Record<string, string[]>,
    events: {} as Record<string, string[]>,
    rpcMap: {} as Record<string, string>,
  }

  for (const override of overrides) {
    for (const [namespace, methods] of Object.entries(override.methods ?? {})) {
      merged.methods[namespace] = [...(merged.methods[namespace] ?? []), ...methods]
    }
    for (const [namespace, chains] of Object.entries(override.chains ?? {})) {
      merged.chains[namespace] = [...(merged.chains[namespace] ?? []), ...chains]
    }
    for (const [namespace, events] of Object.entries(override.events ?? {})) {
      merged.events[namespace] = [...(merged.events[namespace] ?? []), ...events]
    }
    Object.assign(merged.rpcMap, override.rpcMap)
  }

  return merged
}

createAppKit({
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
  adapters: [new Neo3Adapter(), new StellarAdapter(), new BitcoinAdapter()],
  networks: [neo3TestnetNetwork, stellarTestnetNetwork, bitcoinTestnetNetwork],
  universalProviderConfigOverride: mergeUniversalProviderConfigOverride(
    Neo3Constants.OVERRIDES,
    StellarConstants.OVERRIDES,
    BitcoinConstants.OVERRIDES
  ),
})
```

See also: [GUIDE__configuration_precedence_and_overrides.md](../guides/GUIDE__configuration_precedence_and_overrides.md).
