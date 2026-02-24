# AppKit Stellar Adapter

An AppKit adapter for integrating Stellar blockchain support into your dApps.

## Live Demo

You can access the deployed project here: [Connect Lab on GitHub Pages](https://cityofzion.github.io/appkit-adapters/)

## Overview

This adapter enables seamless integration of Stellar blockchain functionality with [Reown AppKit](https://docs.reown.com/appkit) (formerly WalletConnect AppKit), allowing developers to build Stellar-enabled dApps with WalletConnect support.

> **💡 Need a working example?** Check out the [Connect Lab](../../apps/connect-lab/) project for a complete implementation demonstrating how to use this adapter in a real-world application.

> **📚 Learn more about AppKit:** Visit the official [Reown AppKit repository](https://github.com/reown-com/appkit) for comprehensive documentation, examples, and the latest updates on AppKit features.

## Installation

```bash
npm install @cityofzion/appkit-stellar-adapter
```

## Usage

### Basic Setup

> **⚠️ IMPORTANT:** You **must** include the `universalProviderConfigOverride` option with `StellarConstants.OVERRIDES`. This is required because AppKit does not include Stellar methods in its default configuration.

```typescript
import { StellarAdapter, stellarMainnetNetwork, stellarTestnetNetwork, StellarConstants } from '@cityofzion/appkit-stellar-adapter';
import { createAppKit } from '@reown/appkit';

// Create AppKit instance with Stellar support
createAppKit({
  projectId: 'YOUR_PROJECT_ID', // Get from https://cloud.reown.com
  adapters: [new StellarAdapter()],
  networks: [stellarMainnetNetwork, stellarTestnetNetwork],
  metadata: {
    name: 'My Stellar dApp',
    description: 'My Stellar dApp description',
    url: 'https://myapp.com',
    icons: ['https://myapp.com/icon.png']
  },
  // REQUIRED: Register Stellar methods with WalletConnect
  universalProviderConfigOverride: StellarConstants.OVERRIDES
});
```

### React Example with AppKitProvider

> **⚠️ IMPORTANT:** Don't forget to include `universalProviderConfigOverride={StellarConstants.OVERRIDES}` in your AppKitProvider configuration. This is essential for Stellar functionality.

```tsx
import React from 'react';
import { AppKitProvider } from "@reown/appkit/react";
import { StellarAdapter, stellarMainnetNetwork, stellarTestnetNetwork, StellarConstants } from '@cityofzion/appkit-stellar-adapter';

function App() {
  return (
    <AppKitProvider
      adapters={[new StellarAdapter()]}
      networks={[stellarMainnetNetwork, stellarTestnetNetwork]}
      projectId='YOUR_PROJECT_ID'
      metadata={{
        name: 'My Stellar dApp',
        description: 'My Stellar dApp description',
        url: 'https://myapp.com',
        icons: ['https://myapp.com/icon.png']
      }}
      universalProviderConfigOverride={StellarConstants.OVERRIDES}
    >
      <YourApp />
    </AppKitProvider>
  );
}

export default App;
```

### Available Networks

The adapter exports pre-configured Stellar networks:

- `stellarMainnetNetwork` - Stellar Mainnet
- `stellarTestnetNetwork` - Stellar Testnet

### Accessing the Stellar Provider in React

To interact with the Stellar blockchain in your React components, you can access the provider using the `useAppKitProvider` hook:

```tsx
import { useAppKitProvider } from "@reown/appkit/react";
import type { StellarProvider } from '@cityofzion/appkit-stellar-adapter';

function MyComponent() {
  // @ts-expect-error ChainNamespace does not include stellar
  const { walletProvider } = useAppKitProvider<StellarProvider>("stellar");

  const handleSignTransaction = async () => {
    if (!walletProvider) {
      console.error("Provider not available");
      return;
    }

    try {
      // Use the provider to interact with Stellar
      const result = await walletProvider.signTransaction("your XDR transaction");

      console.log("Transaction result:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button onClick={handleSignTransaction}>
      Sign transaction
    </button>
  );
}
```

## TypeScript Considerations

### Stellar Namespace Support

The Reown/AppKit types currently do not include `stellar` as a recognized namespace in their `ChainNamespace` type. This means TypeScript will show type errors when using Stellar-specific configurations.

To work around this limitation, you need to use the `@ts-expect-error` directive above lines that reference the `stellar` namespace:

```tsx
import {  useAppKit,  useDisconnect } from "@reown/appkit/react";
import { Fragment } from "react"

function ConnectButton() {
  const appKit = useAppKit();
  const { disconnect } = useDisconnect();

  async function handleConnect() {
    //@ts-expect-error ChainNamespace does not include stellar
    await appKit.open({ namespace: "stellar" });
  }

  async function handleDisconnect() {
    //@ts-expect-error ChainNamespace does not include stellar
    await disconnect({ namespace: : "stellar" });
  };

  return (
    <Fragment>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleDisconnect}>Disconnect</button>
     </Fragment>
  )
}
```

This is expected behavior and does not affect runtime functionality. The `@ts-expect-error` directive suppresses TypeScript errors while maintaining full Stellar functionality. The pre-configured networks exported by this package (`stellarMainnetNetwork` and `stellarTestnetNetwork`) already include these directives, so you typically won't need to add them when using the exported networks.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Created by [Raul Duarte Pereira](https://github.com/raulduartep)
