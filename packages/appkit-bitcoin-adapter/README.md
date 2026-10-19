# AppKit Bitcoin Adapter

An AppKit adapter for integrating Bitcoin blockchain support into your dApps through WalletConnect.

## Live Demo

You can access the deployed project here: [Connect Lab on GitHub Pages](https://cityofzion.github.io/appkit-adapters/)

## Overview

This adapter enables Bitcoin (`bip122` namespace) with [Reown AppKit](https://docs.reown.com/appkit) using WalletConnect only, following the [WalletConnect Bitcoin RPC reference](https://docs.reown.com/advanced/multichain/rpc-reference/bitcoin-rpc). It is compatible with wallets built on top of [`@cityofzion/bs-bitcoin`](https://github.com/CityOfZion/blockchain-services/tree/main/packages/bs-bitcoin), such as NEON Wallet.

Unlike Reown's [`@reown/appkit-adapter-bitcoin`](https://docs.reown.com/appkit/react/core/installation#bitcoin), this adapter does not include browser extension wallets (Xverse, Leather, Unisat, OKX...) and sends the `account` param required by the RPC reference in every request, including `getAccountAddresses`. Use one of them, not both, since both register the `bip122` namespace.

> **💡 Need a working example?** Check out the [Connect Lab](../../apps/connect-lab) project for a complete implementation demonstrating how to use this adapter in a real-world application.

> **📚 Learn more about AppKit:** Visit the official [Reown AppKit repository](https://github.com/reown-com/appkit) for comprehensive documentation, examples, and the latest updates on AppKit features.

## Installation

```bash
npm install @cityofzion/appkit-bitcoin-adapter @reown/appkit @reown/appkit-common @reown/appkit-controllers @walletconnect/universal-provider
```

## Usage

### Basic Setup

> **💡 TIP:** AppKit already requests the Bitcoin methods by default, but `BitcoinConstants.OVERRIDES` adds the `bip122_addressesChanged` event (keeping the default `accountsChanged` / `chainChanged`). Merge it with the other adapters' overrides when using more than one.

```typescript
import { BitcoinAdapter, bitcoinMainnetNetwork, bitcoinTestnetNetwork, BitcoinConstants } from '@cityofzion/appkit-bitcoin-adapter';
import { createAppKit } from '@reown/appkit';

// Create AppKit instance with Bitcoin support
createAppKit({
  projectId: 'YOUR_PROJECT_ID', // Get from https://cloud.reown.com
  adapters: [new BitcoinAdapter()],
  networks: [bitcoinMainnetNetwork, bitcoinTestnetNetwork],
  metadata: {
    name: 'My Bitcoin dApp',
    description: 'My Bitcoin dApp description',
    url: 'https://myapp.com',
    icons: ['https://myapp.com/icon.png']
  },
  universalProviderConfigOverride: BitcoinConstants.OVERRIDES
});
```

### React Example with AppKitProvider

```tsx
import React from 'react';
import { AppKitProvider } from "@reown/appkit/react";
import { BitcoinAdapter, bitcoinMainnetNetwork, bitcoinTestnetNetwork, BitcoinConstants } from '@cityofzion/appkit-bitcoin-adapter';

function App() {
  return (
    <AppKitProvider
      adapters={[new BitcoinAdapter()]}
      networks={[bitcoinMainnetNetwork, bitcoinTestnetNetwork]}
      projectId='YOUR_PROJECT_ID'
      metadata={{
        name: 'My Bitcoin dApp',
        description: 'My Bitcoin dApp description',
        url: 'https://myapp.com',
        icons: ['https://myapp.com/icon.png']
      }}
      universalProviderConfigOverride={BitcoinConstants.OVERRIDES}
    >
      <YourApp />
    </AppKitProvider>
  );
}

export default App;
```

### Available Networks

The adapter exports pre-configured Bitcoin networks, identified by [CAIP-4](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-4.md) chain ids:

- `bitcoinMainnetNetwork` - Bitcoin Mainnet (`bip122:000000000019d6689c085ae165831e93`)
- `bitcoinTestnetNetwork` - Bitcoin Testnet (`bip122:000000000933ea01ad0ee984209779ba`)

Balances are fetched from the [mempool.space](https://mempool.space/docs/api/rest) API.

### Accessing the Bitcoin Provider in React

To interact with the Bitcoin blockchain in your React components, you can access the provider using the `useAppKitProvider` hook. The `account` param is filled with the connected account automatically.

```tsx
import { useAppKitProvider } from "@reown/appkit/react";
import type { BitcoinProvider } from '@cityofzion/appkit-bitcoin-adapter';

function MyComponent() {
  const { walletProvider } = useAppKitProvider<BitcoinProvider>("bip122");

  const handleSendTransfer = async () => {
    if (!walletProvider) {
      console.error("Provider not available");
      return;
    }

    try {
      // Amount in satoshis
      const { txid } = await walletProvider.sendTransfer({
        recipientAddress: "bc1q...",
        amount: "1000",
      });

      console.log("Transaction id:", txid);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button onClick={handleSendTransfer}>
      Send transfer
    </button>
  );
}
```

### Provider Methods

| Method                | Params                                                                       | Response                                       |
|-----------------------|------------------------------------------------------------------------------|------------------------------------------------|
| `getAccountAddresses` | `{ intentions?: string[] }`                                                  | `{ address, publicKey?, path?, intention? }[]` |
| `signMessage`         | `{ message, address?, protocol?: 'ecdsa' }`                                  | `{ address, signature, messageHash? }`         |
| `signPsbt`            | `{ psbt, signInputs?, broadcast? }` (`psbt` in base64)                       | `{ psbt, txid? }`                              |
| `sendTransfer`        | `{ recipientAddress, amount, changeAddress?, memo? }` (`amount` in satoshis) | `{ txid }`                                     |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.