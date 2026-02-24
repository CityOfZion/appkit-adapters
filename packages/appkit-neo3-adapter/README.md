# AppKit Neo3 Adapter

An AppKit adapter for integrating Neo3 blockchain support into your dApps.

## Live Demo

You can access the deployed project here: [Connect Lab on GitHub Pages](https://cityofzion.github.io/appkit-adapters/)

## Overview

This adapter enables seamless integration of Neo3 blockchain functionality with [Reown AppKit](https://docs.reown.com/appkit) (formerly WalletConnect AppKit), allowing developers to build Neo3-enabled dApps with WalletConnect support.

> **💡 Need a working example?** Check out the [Connect Lab](../../apps/connect-lab/) project for a complete implementation demonstrating how to use this adapter in a real-world application.

> **📚 Learn more about AppKit:** Visit the official [Reown AppKit repository](https://github.com/reown-com/appkit) for comprehensive documentation, examples, and the latest updates on AppKit features.

## Installation

```bash
npm install @cityofzion/appkit-neo3-adapter
```

## Usage

### Basic Setup

> **⚠️ IMPORTANT:** You **must** include the `universalProviderConfigOverride` option with `Neo3Constants.OVERRIDES`. This is required because AppKit does not include Neo3 methods in its default configuration.

```typescript
import { Neo3Adapter, neo3MainnetNetwork, neo3TestnetNetwork, Neo3Constants } from '@cityofzion/appkit-neo3-adapter';
import { createAppKit } from '@reown/appkit';

// Create AppKit instance with Neo3 support
createAppKit({
  projectId: 'YOUR_PROJECT_ID', // Get from https://cloud.reown.com
  adapters: [new Neo3Adapter()],
  networks: [neo3MainnetNetwork, neo3TestnetNetwork],
  metadata: {
    name: 'My Neo3 dApp',
    description: 'My Neo3 dApp description',
    url: 'https://myapp.com',
    icons: ['https://myapp.com/icon.png']
  },
  // REQUIRED: Register Neo3 methods with WalletConnect
  universalProviderConfigOverride: Neo3Constants.OVERRIDES
});
```

### React Example with AppKitProvider

> **⚠️ IMPORTANT:** Don't forget to include `universalProviderConfigOverride={Neo3Constants.OVERRIDES}` in your AppKitProvider configuration. This is essential for Neo3 functionality.

```tsx
import React from 'react';
import { AppKitProvider } from "@reown/appkit/react";
import { Neo3Adapter, neo3MainnetNetwork, neo3TestnetNetwork, Neo3Constants } from '@cityofzion/appkit-neo3-adapter';

function App() {
  return (
    <AppKitProvider
      adapters={[new Neo3Adapter()]}
      networks={[neo3MainnetNetwork, neo3TestnetNetwork]}
      projectId='YOUR_PROJECT_ID'
      metadata={{
        name: 'My Neo3 dApp',
        description: 'My Neo3 dApp description',
        url: 'https://myapp.com',
        icons: ['https://myapp.com/icon.png']
      }}
      universalProviderConfigOverride={Neo3Constants.OVERRIDES}
    >
      <YourApp />
    </AppKitProvider>
  );
}

export default App;
```

### Available Networks

The adapter exports pre-configured Neo3 networks:

- `neo3MainnetNetwork` - Neo3 Mainnet
- `neo3TestnetNetwork` - Neo3 Testnet

### Accessing the Neo3 Provider in React

To interact with the Neo3 blockchain in your React components, you can access the provider using the `useAppKitProvider` hook:

```tsx
import { useAppKitProvider } from "@reown/appkit/react";
import type { Neo3Provider } from '@cityofzion/appkit-neo3-adapter';

function MyComponent() {
  // @ts-expect-error ChainNamespace does not include neo3
  const { walletProvider } = useAppKitProvider<Neo3Provider>("neo3");

  const handleInvoke = async () => {
    if (!walletProvider) {
      console.error("Provider not available");
      return;
    }

    try {
      // Use the provider to interact with Neo3
      const result = await walletProvider.invokeFunction({
        scriptHash: "0x...",
        operation: "methodName",
        args: []
      });

      console.log("Transaction result:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button onClick={handleInvoke}>
      Invoke Contract
    </button>
  );
}
```

## TypeScript Considerations

### Neo3 Namespace Support

The Reown/AppKit types currently do not include `neo3` as a recognized namespace in their `ChainNamespace` type. This means TypeScript will show type errors when using Neo3-specific configurations.

To work around this limitation, you need to use the `@ts-expect-error` directive above lines that reference the `neo3` namespace:

```tsx
import {  useAppKit,  useDisconnect } from "@reown/appkit/react";
import { Fragment } from "react"

function ConnectButton() {
  const appKit = useAppKit();
  const { disconnect } = useDisconnect();

  async function handleConnect() {
    //@ts-expect-error ChainNamespace does not include neo3
    await appKit.open({ namespace: "neo3" });
  }

  async function handleDisconnect() {
    //@ts-expect-error ChainNamespace does not include neo3
    await disconnect({ namespace: : "neo3" });
  };

  return (
    <Fragment>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleDisconnect}>Disconnect</button>
     </Fragment>
  )
}
```

This is expected behavior and does not affect runtime functionality. The `@ts-expect-error` directive suppresses TypeScript errors while maintaining full Neo3 functionality. The pre-configured networks exported by this package (`neo3MainnetNetwork` and `neo3TestnetNetwork`) already include these directives, so you typically won't need to add them when using the exported networks.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Created by [Raul Duarte Pereira](https://github.com/raulduartep)
