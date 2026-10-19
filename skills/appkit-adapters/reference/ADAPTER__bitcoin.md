---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Adapter Reference — Bitcoin

`@cityofzion/appkit-bitcoin-adapter` adds Bitcoin (`bip122` namespace) to Reown AppKit through **WalletConnect only**, following the WalletConnect Bitcoin RPC reference. It targets wallets built on `@cityofzion/bs-bitcoin`, such as NEON Wallet.

## When to use it (and when not)

- Use it **instead of** Reown's `@reown/appkit-adapter-bitcoin`, never both: both register the `bip122` namespace.
- It does not include browser extension wallets (Xverse, Leather, Unisat, OKX). If you need those, use Reown's adapter.
- It sends the `account` param required by the RPC reference in every request, including `getAccountAddresses`.

## Install

The package is **not yet published to npm**. Inside this repository, build it and link it locally:

```bash
# repository root
rush install
rush build-packages
```

```json
{
  "dependencies": {
    "@cityofzion/appkit-bitcoin-adapter": "file:../../../../packages/appkit-bitcoin-adapter"
  }
}
```

(Path as used by `examples/simple-app`; adjust to your app's location.) Then install the required peers:

```bash
pnpm add @reown/appkit @reown/appkit-common @reown/appkit-controllers @walletconnect/universal-provider
```

Once published, install it like the other adapters: `pnpm add @cityofzion/appkit-bitcoin-adapter`.

## Exports

`BitcoinAdapter`, `BitcoinConnector`, `BitcoinConstants`, `bitcoinMainnetNetwork`, `bitcoinTestnetNetwork`, the type `BitcoinProvider` (alias of `BitcoinConnector`), and the `TBitcoinConnector*` param/response types.

`BitcoinConstants`:
- `OVERRIDES` — `methods.bip122`: `getAccountAddresses`, `signMessage`, `signPsbt`, `sendTransfer`; `events.bip122`: `accountsChanged`, `chainChanged`, `bip122_addressesChanged`
- `METHODS`, `EVENTS`
- `MAINNET_CHAIN_ID` = `000000000019d6689c085ae165831e93`
- `TESTNET_CHAIN_ID` = `000000000933ea01ad0ee984209779ba`
- `MEMPOOL_API_URL_BY_ID` — chain id to mempool.space API URL (used for balances)
- `BTC_TOKEN`

## Networks

| Export | CAIP-2 id |
|---|---|
| `bitcoinMainnetNetwork` | `bip122:000000000019d6689c085ae165831e93` |
| `bitcoinTestnetNetwork` | `bip122:000000000933ea01ad0ee984209779ba` |

## Init snippet

```ts
import { createAppKit } from '@reown/appkit/react'
import {
  BitcoinAdapter,
  BitcoinConstants,
  bitcoinMainnetNetwork,
  bitcoinTestnetNetwork,
} from '@cityofzion/appkit-bitcoin-adapter'

createAppKit({
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
  adapters: [new BitcoinAdapter()],
  networks: [bitcoinMainnetNetwork, bitcoinTestnetNetwork],
  metadata: {
    name: 'My Bitcoin dApp',
    description: '...',
    url: 'https://example.com',
    icons: ['https://example.com/icon.png'],
  },
  universalProviderConfigOverride: BitcoinConstants.OVERRIDES,
})
```

AppKit already requests the Bitcoin methods by default; `BitcoinConstants.OVERRIDES` adds the `bip122_addressesChanged` event (keeping the default `accountsChanged` / `chainChanged`). With other non-EVM adapters, merge it into the single override object (see [REF__universal_provider_overrides.md](./REF__universal_provider_overrides.md)).

## Provider access

`bip122` is a native AppKit namespace, so **no** `@ts-expect-error` is needed.

```tsx
import { useAppKit, useAppKitProvider } from '@reown/appkit/react'
import type { BitcoinProvider } from '@cityofzion/appkit-bitcoin-adapter'

export function BitcoinTransfer() {
  const { open } = useAppKit()
  const { walletProvider } = useAppKitProvider<BitcoinProvider>('bip122')

  async function send() {
    if (!walletProvider) return
    // amount in satoshis
    const { txid } = await walletProvider.sendTransfer({ recipientAddress: 'tb1q...', amount: '1000' })
    console.log(txid)
  }

  return (
    <>
      <button onClick={() => open({ namespace: 'bip122' })}>Connect Bitcoin wallet</button>
      <button onClick={send} disabled={!walletProvider}>Send 1000 sats</button>
    </>
  )
}
```

## Provider methods

The `account` param is filled with the connected account automatically.

| Method | Params | Response |
|---|---|---|
| `getAccountAddresses` | `{ intentions?: string[] }` | `{ address, publicKey?, path?, intention? }[]` |
| `signMessage` | `{ message, address?, protocol?: 'ecdsa' }` | `{ address, signature, messageHash? }` |
| `signPsbt` | `{ psbt, signInputs?, broadcast? }` (`psbt` in base64) | `{ psbt, txid? }` |
| `sendTransfer` | `{ recipientAddress, amount, changeAddress?, memo? }` (`amount` in satoshis, as string) | `{ txid }` |

## Example app

`examples/simple-app/` wires Bitcoin with `bitcoinTestnetNetwork` alongside Neo3, Stellar, and Neo X. The upstream Connect Lab (`apps/connect-lab`) also uses it.