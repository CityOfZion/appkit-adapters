---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.2
---

# Guide: NeoX (EVM) via WagmiAdapter

NeoX is fully EVM-compatible and uses the standard Ethereum namespace (`eip155`).

`@cityofzion/appkit-neox-adapter` is **not** an AppKit adapter (no `AdapterBlueprint`). It only provides:

- Networks: `neoXMainnetNetwork`, `neoXTestnetNetwork`, `neoXAntiMevMainnetNetwork`, `neoXAntiMevTestnetNetwork`
- Anti-MEV aware actions: `sendTransaction(wagmiConfig, params)`, `signTransaction(wagmiConfig, params)`
- Lower-level helpers: `buildAntiMevTransaction`, `getCachedTransaction`, `isAntiMevNetwork`
- ABIs: `governanceAbi`, `keyManagementAbi`

The adapter you register in AppKit is Reown's `WagmiAdapter` (`@reown/appkit-adapter-wagmi`). Everything is exported from the package root; there is no `/networks` subpath.

## Install
```bash
pnpm add @cityofzion/appkit-neox-adapter @reown/appkit @reown/appkit-common @reown/appkit-adapter-wagmi @wagmi/core viem wagmi @tanstack/react-query
```

No `universalProviderConfigOverride` is needed for NeoX: `eip155` methods are native to AppKit.

## Setup
```ts
// src/appkit.ts
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { neoXMainnetNetwork, neoXTestnetNetwork } from '@cityofzion/appkit-neox-adapter'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [neoXMainnetNetwork, neoXTestnetNetwork]

// WagmiAdapter needs projectId + networks: it builds the wagmi config from them.
export const wagmiAdapter = new WagmiAdapter({ projectId, networks })

createAppKit({
  projectId,
  adapters: [wagmiAdapter],
  networks,
  metadata: {
    name: 'My NeoX dApp',
    description: 'My NeoX dApp description',
    url: 'https://myapp.com',
    icons: ['https://myapp.com/icon.png'],
  },
})
```

Multi-chain apps put the NeoX networks into the same `WagmiAdapter` as any other EVM networks (one `WagmiAdapter` per app), and add the non-EVM adapters (`Neo3Adapter`, `StellarAdapter`, `BitcoinAdapter`) next to it in `adapters`.

## Anti-MEV networks

`neoXAntiMevMainnetNetwork` / `neoXAntiMevTestnetNetwork` are the regular NeoX networks with an anti-MEV RPC endpoint. On these networks a transaction is not broadcast in plain text: it is cached by the node, then wrapped into an encrypted envelope (threshold encryption with the consensus public key) and sent to the `governanceReward` contract.

Use them instead of the regular ones when you want that protection:

```ts
import { neoXAntiMevMainnetNetwork, neoXAntiMevTestnetNetwork } from '@cityofzion/appkit-neox-adapter'

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [neoXAntiMevMainnetNetwork, neoXAntiMevTestnetNetwork]
```

`isAntiMevNetwork(network)` tells you whether a given `AppKitNetwork` points to an anti-MEV RPC (useful for UI hints).

## Sending and signing transactions

Always use `sendTransaction` / `signTransaction` from `@cityofzion/appkit-neox-adapter` instead of the plain wagmi ones (`useSendTransaction`, `@wagmi/core` `sendTransaction`). The package functions detect the connected network: on regular networks they call wagmi directly; on anti-MEV networks they build the encrypted envelope first. Plain wagmi calls silently bypass anti-MEV.

Both take the wagmi config as the first argument. Pass `wagmiAdapter.wagmiConfig` directly; `useConfig()` from `wagmi` only works inside a `WagmiProvider`, which an AppKit-only setup does not mount.

```tsx
import { parseEther, type Hex } from 'viem'
import { sendTransaction, signTransaction } from '@cityofzion/appkit-neox-adapter'
import { wagmiAdapter } from './appkit'

const to: Hex = '0x0000000000000000000000000000000000000000' // replace with a test address

export async function sendNeoX() {
  const hash = await sendTransaction(wagmiAdapter.wagmiConfig, { to, value: parseEther('0.001') })
  console.log('Transaction hash:', hash)
}

export async function signNeoX() {
  const signed = await signTransaction(wagmiAdapter.wagmiConfig, { to, value: parseEther('0.001') })
  console.log('Signed transaction:', signed)
}
```

Other read/sign actions (`call`, `readContract`, `signMessage`, `signTypedData`, ...) can come straight from `@wagmi/core` with the same `wagmiAdapter.wagmiConfig`.

## React: connect / disconnect / send
```tsx
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { parseEther, type Hex } from 'viem'
import { sendTransaction } from '@cityofzion/appkit-neox-adapter'
import { wagmiAdapter } from './appkit'

export function NeoXWallet() {
  const { open } = useAppKit()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAppKitAccount({ namespace: 'eip155' })

  async function handleSend() {
    if (!address) return

    try {
      // Self-transfer of a tiny amount; safe smoke test.
      const hash = await sendTransaction(wagmiAdapter.wagmiConfig, {
        to: address as Hex,
        value: parseEther('0.000001'),
      })
      console.log('Transaction hash:', hash)
    } catch (error) {
      console.error(error)
    }
  }

  if (!isConnected) return <button onClick={() => open()}>Connect</button>

  return (
    <div>
      <p>{address}</p>
      <button onClick={handleSend}>Send transaction</button>
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}
```

`useAppKit().close()` only closes the modal; it does not end the session. Use `useDisconnect().disconnect()`.

## Gotchas
- `new WagmiAdapter()` without `projectId` / `networks` gives you a wagmi config with no NeoX chains.
- Wrong names: the exports are `neoXMainnetNetwork` / `neoXTestnetNetwork` (capital `X`, `Network` suffix), not `neoxMainnet` / `neoxTestnet`. AppKit's own `neoxMainnet` / `neoxT4` (from `@reown/appkit/networks`) lack the NeoX contract addresses the anti-MEV flow needs.
- The anti-MEV flow prompts the wallet several times: the original transaction (cached by the node, not broadcast), a message signature over the nonce (to fetch the cached transaction), then the encrypted envelope transaction. The wallet must support `eth_sendTransaction` and `personal_sign`.
- Vite reads env vars via `import.meta.env.VITE_*`; `process.env` is undefined in the browser.

## Related
- [reference/ADAPTER__neox.md](../reference/ADAPTER__neox.md)
- [reference/PACKAGES.md](../reference/PACKAGES.md)
- [troubleshooting/TROUBLESHOOTING.md](../troubleshooting/TROUBLESHOOTING.md)
- Runnable multichain example (includes NeoX): [examples/simple-app/](../examples/simple-app)