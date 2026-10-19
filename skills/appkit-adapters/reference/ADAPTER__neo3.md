---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Adapter Reference — Neo3

## Install

```bash
pnpm add @cityofzion/appkit-neo3-adapter @reown/appkit @reown/appkit-common @reown/appkit-controllers @walletconnect/universal-provider
```

`@reown/appkit`, `@reown/appkit-common`, `@reown/appkit-controllers`, and `@walletconnect/universal-provider` are required peer dependencies. `@cityofzion/neon-dappkit-types` ships as a regular dependency of the adapter; add it to your app only if you import its types directly.

## React import rule

- Install `@reown/appkit`
- Import React APIs from `@reown/appkit/react`
- Do not install `@reown/appkit/react` as a separate package

## Exports

`Neo3Adapter`, `Neo3Connector`, `Neo3Constants` (`OVERRIDES`, `METHODS`, `EVENTS`, `GAS_TOKEN`), `neo3MainnetNetwork` (`neo3:mainnet`), `neo3TestnetNetwork` (`neo3:testnet`), `ProviderEventEmitter`, and the type `Neo3Provider` (alias of `Neo3Connector`).

## Validated init snippet

```ts
import { createAppKit } from '@reown/appkit/react'
import {
  Neo3Adapter,
  Neo3Constants,
  neo3MainnetNetwork,
  neo3TestnetNetwork,
} from '@cityofzion/appkit-neo3-adapter'

createAppKit({
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
  adapters: [new Neo3Adapter()],
  networks: [neo3MainnetNetwork, neo3TestnetNetwork],
  metadata: {
    name: 'Neo3 AppKit Example',
    description: 'Minimal Vite + React example using the CityOfZion Neo3 AppKit adapter.',
    url: 'http://localhost:5173',
    icons: ['https://cityofzion.io/favicon.ico'],
  },
  universalProviderConfigOverride: Neo3Constants.OVERRIDES,
})
```

## Provider access

```ts
import { useAppKitProvider } from '@reown/appkit/react'
import type { Neo3Provider } from '@cityofzion/appkit-neo3-adapter'

// @ts-expect-error AppKit types do not yet include the neo3 namespace.
const { walletProvider } = useAppKitProvider<Neo3Provider>('neo3')
```

## Provider methods

Types come from `@cityofzion/neon-dappkit-types`.

| Method | Params | Response |
|---|---|---|
| `invokeFunction` | `ContractInvocationMulti` | `string` (transaction id) |
| `testInvoke` | `ContractInvocationMulti` | `InvokeResult` |
| `calculateFee` | `ContractInvocationMulti` | `CalculateFee` |
| `signTransaction` | `ContractInvocationMulti \| BuiltTransaction` | `BuiltTransaction` |
| `signMessage` | `SignMessagePayload` | `SignedMessage` |
| `verifyMessage` | `SignedMessage` | `boolean` |
| `getWalletInfo` | — | `WalletInfo` |
| `encrypt` | `(message: string, publicKeys?: string[])` | `EncryptedPayload[]` |
| `decrypt` | `EncryptedPayload` | `string` |
| `decryptFromArray` | `EncryptedPayload[]` | `DecryptFromArrayResult` |

`ContractInvocationMulti` shape:

```ts
import type { ContractInvocationMulti } from '@cityofzion/neon-dappkit-types'

const request: ContractInvocationMulti = {
  invocations: [
    {
      scriptHash: '0xd2a4cff31913016155e38e474a2c06d08be276cf', // GAS
      operation: 'transfer',
      args: [
        { type: 'Hash160', value: senderAddress },
        { type: 'Hash160', value: recipientAddress },
        { type: 'Integer', value: '100000000' },
        { type: 'Any', value: null },
      ],
      abortOnFail: true, // optional
    },
  ],
  signers: [{ scopes: 'CalledByEntry' }], // optional
  // optional: extraSystemFee, systemFeeOverride, extraNetworkFee, networkFeeOverride
}

const txId = await walletProvider.invokeFunction(request)
```

(Importing the type requires adding `@cityofzion/neon-dappkit-types` to the app.)

## Capabilities / quirks

- `Neo3Constants.OVERRIDES` is required.
- The validated example uses `getWalletInfo()` and `testInvoke()` through the wallet-backed provider.
- AppKit's `ChainNamespace` does not include `neo3`, so targeted `@ts-expect-error` directives are needed at `useAppKitProvider('neo3')` and `open({ namespace: 'neo3' })`.
- If build resolution fails for `@reown/appkit-common` / `@reown/appkit-controllers` / `@walletconnect/universal-provider`, a required peer is missing from the app.
- When combined with other non-EVM adapters, merge `Neo3Constants.OVERRIDES` into one override object (see [REF__universal_provider_overrides.md](./REF__universal_provider_overrides.md)).