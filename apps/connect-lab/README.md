# Connect Lab

Connect Lab is a testing environment for your WalletConnect V2 integrations, built with React, Vite, and TanStack Router. It allows you to interact with multiple blockchain adapters (Neo3, Stellar, Solana, EIP-155, and more) in a unified interface.

## Live Demo

You can access the deployed project here: [Connect Lab on GitHub Pages](https://cityofzion.github.io/appkit-adapters/)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v22 or newer recommended)
- [pnpm](https://pnpm.io/) (v10 or newer)

## Environment Variables

Before running the app, you must set the required environment variable in a `.env` file in `apps/connect-lab/`:

```env
VITE_PROJECT_ID=your_project_id_here
```

### Build Packages

```bash
rush update && rush rebuild
```

### Install dependencies

```bash
pnpm install
```

### Development server

```bash
pnpm run dev
```

Open [http://localhost:5173/appkit-adapters](http://localhost:5173/appkit-adapters/) to view the app in your browser.

## Project Structure

```
apps/connect-lab/
├── public/           # Static assets
├── src/              # Source code
│   ├── components/   # React components
│   ├── contexts/     # React contexts
│   ├── helpers/      # Helper utilities
│   ├── hooks/        # Custom hooks
│   ├── routes/       # App routes
│   └── ...
├── index.html        # Main HTML file
├── package.json      # Project metadata and scripts
├── vite.config.ts    # Vite configuration
└── ...
```


## Deployment

This app is configured for deployment to GitHub Pages. The Vite `base` and router `basepath` are set to `/appkit-adapters/`.

## Author

Created by [Raul Duarte Pereira](https://github.com/raulduartep)
