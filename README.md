# AppKit Adapters Monorepo

This repository contains a collection of adapters and tools for integrating multiple blockchains with [Reown AppKit](https://docs.reown.com/appkit) (formerly WalletConnect AppKit). It is organized as a monorepo using [Rush](https://rushjs.io/) and [pnpm](https://pnpm.io/).

## Packages & Apps

- **apps/connect-lab/** — Demo app for testing WalletConnect V2 integrations across multiple blockchains. [Live Demo](https://cityofzion.github.io/appkit-adapters/)
- **packages/appkit-neo3-adapter/** — Neo3 blockchain adapter
- **packages/appkit-neox-adapter/** — NeoX network configs and anti-MEV transaction helpers (used with Reown's `WagmiAdapter`)
- **packages/appkit-stellar-adapter/** — Stellar blockchain adapter
- **packages/appkit-bitcoin-adapter/** — Bitcoin blockchain adapter

## Monorepo Structure

```
.
├── apps/
│   └── connect-lab/            # Demo/testing app
├── packages/
│   ├── appkit-neo3-adapter/    # Neo3 adapter
│   ├── appkit-neox-adapter/    # NeoX networks + anti-MEV helpers
│   ├── appkit-stellar-adapter/ # Stellar adapter
│   └── appkit-bitcoin-adapter/ # Bitcoin adapter
├── skills/                     # Agent skill docs for integrating the adapters
├── common/                     # Shared configs/scripts
├── rush.json                   # Rush configuration
└── ...
```

## Development

Requires [Node.js](https://nodejs.org) v22.12 or newer (Vite 8 in connect-lab and the skill examples needs it). Install Rush globally with `npm install -g @microsoft/rush`, or replace `rush` with `node common/scripts/install-run-rush.js` in the commands below.

```bash
rush install          # Install the packages dependencies
rush build-packages   # Build all packages
rush rebuild          # Clean build of all packages
rush lint             # Lint all packages
```

Inside a package folder, use `rushx lint`, `rushx format` and `rushx typecheck`.

Every change to a published package needs a change file, which CI verifies:

```bash
rush change
```

The Connect Lab app is not managed by Rush, see its [README](./apps/connect-lab/README.md) to run it.

## Author

Created by [Raul Pereira](https://github.com/raulduartep)
