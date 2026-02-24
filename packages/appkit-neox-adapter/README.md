# AppKit NeoX Network Configurations

Network configurations for integrating NeoX blockchain support into your dApps using Reown AppKit.

## Live Demo

You can access the deployed project here: [Connect Lab on GitHub Pages](https://cityofzion.github.io/appkit-adapters/)

## Overview

**NeoX is a fully EVM-compatible blockchain**, which means it uses the standard Ethereum namespace (`eip155`) and works seamlessly with existing Ethereum adapters. This package provides pre-configured NeoX network definitions and utilities that you can use with the standard `WagmiAdapter` from Reown AppKit.

> **💡 Need a working example?** Check out the [Connect Lab](../../apps/connect-lab/) project for a complete implementation demonstrating how to use NeoX in a real-world application.

> **📚 Learn more about AppKit:** Visit the official [Reown AppKit repository](https://github.com/reown-com/appkit) for comprehensive documentation, examples, and the latest updates on AppKit features.

## Installation

```bash
npm install @cityofzion/appkit-neox-adapter @reown/appkit-adapter-wagmi @wagmi/core viem
```

## Anti-MEV Transaction Support

NeoX supports anti-MEV (Maximal Extractable Value) protection through dedicated RPC endpoints. This package provides utilities to build and sign anti-MEV transactions.

## Usage

### Basic Setup

> **💡 TIP:** Since NeoX is EVM-compatible, you use the standard `WagmiAdapter` from Reown AppKit. This package only provides the network configurations and utilities.

```typescript
import { createAppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { neoXMainnetNetwork, neoXTestnetNetwork, neoXAntiMevMainnetNetwork, neoXAntiMevTestnetNetwork } from '@cityofzion/appkit-neox-adapter';


const wagmiAdapter = new WagmiAdapter()

// Create AppKit instance with NeoX support
createAppKit({
  projectId: 'YOUR_PROJECT_ID', // Get from https://cloud.reown.com
  adapters: [wagmiAdapter],
  networks: [neoXMainnetNetwork, neoXTestnetNetwork], // Or [neoXAntiMevMainnetNetwork, neoXAntiMevTestnetNetwork]
  metadata: {
    name: 'My NeoX dApp',
    description: 'My NeoX dApp description',
    url: 'https://myapp.com',
    icons: ['https://myapp.com/icon.png']
  }
});
```

### React Example with AppKitProvider

```tsx
import React from 'react';
import { AppKitProvider } from "@reown/appkit/react";
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { neoXMainnetNetwork, neoXTestnetNetwork, neoXAntiMevMainnetNetwork, neoXAntiMevTestnetNetwork  } from '@cityofzion/appkit-neox-adapter';

const wagmiAdapter = new WagmiAdapter()


function App() {
  return (
    <AppKitProvider
      adapters={[wagmiAdapter]}
      networks={[neoXMainnetNetwork, neoXTestnetNetwork]} // Or [neoXAntiMevMainnetNetwork, neoXAntiMevTestnetNetwork]
      projectId='YOUR_PROJECT_ID'
      metadata={{
        name: 'My NeoX dApp',
        description: 'My NeoX dApp description',
        url: 'https://myapp.com',
        icons: ['https://myapp.com/icon.png']
      }}
    >
      <YourApp />
    </AppKitProvider>
  );
}

export default App;
```

### Available Networks

The package exports pre-configured NeoX networks:

- `neoXMainnetNetwork` - NeoX Mainnet (Chain ID: 47763)
- `neoXTestnetNetwork` - NeoX Testnet (Chain ID: 12227332)
- `neoXAntiMevMainnetNetwork` - NeoX Mainnet with Anti-MEV protection
- `neoXAntiMevTestnetNetwork` - NeoX Testnet with Anti-MEV protection

### Sending Transactions

> **⚠️ IMPORTANT:** Always use the transaction methods from `@cityofzion/appkit-neox-adapter` instead of the standard Wagmi hooks. The package methods automatically handle Anti-MEV protection when connected to Anti-MEV networks, while standard Wagmi methods do not.

```tsx
import { useConfig } from 'wagmi';
import { sendTransaction } from '@cityofzion/appkit-neox-adapter';
import { parseEther, Hex } from 'viem';

function MyComponent() {
  const config = useConfig();

  const handleSendTransaction = async () => {
    try {
      // This method automatically detects if Anti-MEV is active
      // and routes transactions accordingly
      const result = await sendTransaction(config, {
        to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' as Hex,
        value: parseEther('0.001'),
      });

      console.log("Transaction sent:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button onClick={handleSendTransaction}>
      Send Transaction
    </button>
  );
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Created by [Raul Duarte Pereira](https://github.com/raulduartep)
