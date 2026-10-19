# Connect Lab

Connect Lab is a testing environment for your WalletConnect V2 integrations, built with React, Vite, and TanStack Router. It allows you to interact with multiple blockchain adapters (Neo3, Neo X, Stellar, Bitcoin, Solana and EIP-155) in a unified interface.

## Live Demo

You can access the deployed project here: [Connect Lab on GitHub Pages](https://cityofzion.github.io/appkit-adapters/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v22.12 or newer, required by Vite 8)
- [pnpm](https://pnpm.io) (v10 or newer)

## Environment Variables

Before running the app, you must set the required environment variable in a `.env` file in `apps/connect-lab/`:

```env
VITE_PROJECT_ID=your_project_id_here
```

### Build Packages

The app consumes the adapters from `packages/` through their build output, so build them first from the repository root:

```bash
rush install && rush rebuild
```

### Install dependencies

This app is not a Rush project, install it with pnpm (run it again after rebuilding the packages):

```bash
pnpm install
```

### Development server

```bash
pnpm run dev
```

Open [http://localhost:5173/appkit-adapters](http://localhost:5173/appkit-adapters/) to view the app in your browser.

### Scripts

| Script               | Description                        |
| -------------------- | ---------------------------------- |
| `pnpm run dev`       | Start the development server       |
| `pnpm run build`     | Build for production and typecheck |
| `pnpm run preview`   | Preview the production build       |
| `pnpm run typecheck` | Typecheck the project              |
| `pnpm run lint`      | Lint the project                   |
| `pnpm run format`    | Format the project                 |
| `pnpm run check`     | Format and fix lint issues         |

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

This app is deployed to GitHub Pages by manually running the `Deploy Connect Lab to GitHub Pages` workflow. The Vite `base` and router `basepath` are set to `/appkit-adapters/`.

## Author

Created by [Raul Duarte Pereira](https://github.com/raulduartep)
