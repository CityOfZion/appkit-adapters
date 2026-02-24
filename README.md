# AppKit Adapters Monorepo

This repository contains a collection of adapters and tools for integrating multiple blockchains with [Reown AppKit](https://docs.reown.com/appkit) (formerly WalletConnect AppKit). It is organized as a monorepo using [Rush](https://rushjs.io/) and [pnpm](https://pnpm.io/).

## Packages & Apps

- **apps/connect-lab/** — Demo app for testing WalletConnect V2 integrations across multiple blockchains. [Live Demo](https://cityofzion.github.io/appkit-adapters/)
- **packages/appkit-neo3-adapter/** — Neo3 blockchain adapter
- **packages/appkit-neox-adapter/** — NeoX blockchain adapter
- **packages/appkit-stellar-adapter/** — Stellar blockchain adapter

## Monorepo Structure

```
.
├── apps/
│   └── connect-lab/           # Demo/testing app
├── packages/
│   ├── appkit-neo3-adapter/   # Neo3 adapter
│   ├── appkit-neox-adapter/   # NeoX adapter
│   └── appkit-stellar-adapter/# Stellar adapter
├── common/                    # Shared configs/scripts
├── rush.json                  # Rush configuration
└── ...
```

## Author

Created by [Raul Pereira](https://github.com/raulduartep)
