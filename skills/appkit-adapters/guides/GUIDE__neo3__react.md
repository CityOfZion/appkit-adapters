---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Guide: Neo3 integration (React)

For project setup, dependencies, and the `createAppKit` bootstrap, follow [QS__vite-react-neo3.md](../quickstarts/QS__vite-react-neo3.md) (mirrors `examples/vite-react-neo3/`). This guide covers React usage once AppKit is created.

## Hooks
- `useAppKit()` — `open({ namespace: 'neo3' })` opens the modal for Neo3 wallets
- `useAppKitAccount()` — `address`, `isConnected`, `status`
- `useAppKitProvider<Neo3Provider>('neo3')` — the adapter-backed `walletProvider`

Both `'neo3'` call sites need `@ts-expect-error` ([GUIDE__typescript_namespaces.md](./GUIDE__typescript_namespaces.md)).

## Calling the wallet
```tsx
import { useAppKitProvider } from '@reown/appkit/react'
import type { Neo3Provider } from '@cityofzion/appkit-neo3-adapter'

export function Neo3WalletInfo() {
  // @ts-expect-error ChainNamespace does not include neo3
  const { walletProvider } = useAppKitProvider<Neo3Provider>('neo3')

  async function show() {
    if (!walletProvider) return
    console.log(await walletProvider.getWalletInfo())
  }

  return <button onClick={show} disabled={!walletProvider}>getWalletInfo()</button>
}
```

`walletProvider` is `undefined` until a Neo3 session exists; guard every call. Write operations (`invokeFunction`, `signTransaction`, `signMessage`) prompt the user in the wallet. Method list and `ContractInvocationMulti` shape: [ADAPTER__neo3.md](../reference/ADAPTER__neo3.md).

## Common failure modes
- Missing `Neo3Constants.OVERRIDES` => methods not negotiated
- TS errors on namespace => use `@ts-expect-error`
- Calling provider methods before connecting => `walletProvider` is `undefined`
