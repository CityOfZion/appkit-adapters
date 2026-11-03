# Neo3 Vite React Example

This example demonstrates a real AppKit + Neo3 adapter integration using the adapter package from this monorepo.

## What it does

- Initializes Reown AppKit with `Neo3Adapter`
- Registers Neo3 WalletConnect method overrides via `Neo3Constants.OVERRIDES`
- Opens the Neo3 wallet modal with `useAppKit()`
- Accesses the adapter-backed provider with `useAppKitProvider('neo3')`
- Calls real Neo3 provider methods such as `getWalletInfo()` and `testInvoke()`

## Build the adapter

The adapter is linked from this repository (`file:../../../../packages/appkit-neo3-adapter`), so build the packages first from the repository root:

```bash
rush install && rush build-packages
```

## Configure

Create a local `.env` file from `.env.example` and set your Reown project ID:

```bash
cp .env.example .env
```

Then edit `.env`:

```bash
VITE_REOWN_PROJECT_ID=your_project_id_here
```

Get a project ID from https://cloud.reown.com.

## Run locally

From this example directory:

```bash
pnpm install
pnpm dev
```

Typecheck and build for production:

```bash
pnpm build
```

After rebuilding the adapter package, run `pnpm install` again to pick up its new build output.

## Important notes

- `Neo3Constants.OVERRIDES` is required; without it, Neo3-specific WalletConnect methods are not registered.
- AppKit's current TypeScript types do not fully recognize the `neo3` namespace, so the example includes targeted `@ts-expect-error` directives where needed.
- `testInvoke(balanceOf)` requires a connected Neo3 wallet session because the provider call is routed through the wallet.
