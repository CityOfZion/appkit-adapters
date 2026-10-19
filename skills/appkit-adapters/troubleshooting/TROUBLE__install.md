---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.1
---

# Troubleshooting — Install / Dependencies

This doc is organized as: **symptom → likely cause → fix**.

## Case 1 — Tried `npm install @reown/appkit/react` and it failed

### Symptom
- `npm install @reown/appkit/react` fails (404 / not found / invalid package).

### Likely cause
- `@reown/appkit/react` is **not** a published npm package.
- It is a **subpath import** that lives inside the `@reown/appkit` package.

### Fix
- Install the real package:
  - `npm install @reown/appkit`
  - or `pnpm add @reown/appkit`
- Import React helpers from the subpath:
  - `import { createAppKit } from '@reown/appkit/react'`

## Case 2 — `npm install @reown/appkit @cityofzion/appkit-neo3-adapter` times out (~60s)

### Symptom
- Install appears to hang and then the run aborts around ~60 seconds.

### Likely cause
- This is typically an **environment/runtime execution cap** (e.g., tool timeout), not a package problem.

### Fix / Workarounds
- Prefer pnpm in constrained environments (often faster):
  - `pnpm add @cityofzion/appkit-neo3-adapter @reown/appkit @reown/appkit-common @reown/appkit-controllers @walletconnect/universal-provider`
- For CI/agent runs with strict caps:
  - enable dependency caching (pnpm store / npm cache)
  - use prebuilt images with dependencies already installed
  - run install outside the strict ~60s environment and cache `node_modules` / use a prepared image
  - possibly split dependency install into a separate longer-running step (if your runner supports it)
  - increase the job timeout where possible

## Case 3 — Install succeeds but app fails to compile/import `@reown/appkit/react`

### Symptom
- Build error indicating `@reown/appkit/react` cannot be resolved.

### Likely cause
- `@reown/appkit` is not installed (or lockfile is inconsistent).

### Fix
- Ensure `@reown/appkit` is present in `package.json` and reinstall deps.
- If using a monorepo, confirm the package manager hoisting/layout is compatible.

## Case 4 — `@reown/appkit-adapter-stellar` not found

### Symptom
- `npm install @reown/appkit-adapter-stellar` fails (404).

### Likely cause
- Wrong package name. The Stellar adapter is published by CityOfZion.

### Fix
- `pnpm add @cityofzion/appkit-stellar-adapter @reown/appkit @reown/appkit-common @reown/appkit-controllers @walletconnect/universal-provider`

## Case 5 — Peer dependency warnings / runtime "cannot resolve" for `@reown/appkit-controllers` or `@walletconnect/universal-provider`

### Symptom
- Peer warnings on install, or the bundler cannot resolve those modules when importing a non-EVM adapter.

### Likely cause
- The Neo3, Stellar and Bitcoin adapters declare `@reown/appkit`, `@reown/appkit-common`, `@reown/appkit-controllers` and `@walletconnect/universal-provider` as peers. NeoX declares `@reown/appkit`, `@reown/appkit-common`, `@wagmi/core` and `viem`.

### Fix
- Install the peers explicitly, pinned to the same AppKit version as `@reown/appkit` (e.g. `@reown/appkit-common@1.8.19 @reown/appkit-controllers@1.8.19`).

## Case 6 — `@cityofzion/appkit-bitcoin-adapter` not found on npm

### Symptom
- Install fails with 404 for the Bitcoin adapter.

### Likely cause
- The package may not be published yet.

### Fix
- Build it from this repo (`rush install && rush build-packages`) and link it with `"@cityofzion/appkit-bitcoin-adapter": "file:<path-to-repo>/packages/appkit-bitcoin-adapter"`, as the examples do.
- Do not fall back to installing `@reown/appkit-adapter-bitcoin` alongside it; use one or the other.

## Case 7 — Example install fails resolving `file:../../../../packages/...`

### Symptom
- `pnpm install` / `pnpm build` in `examples/vite-react-neo3` or `examples/simple-app` fails because the adapter's `dist/` is missing.

### Likely cause
- The examples link the local adapter packages, which must be built first.

### Fix
- From the repo root: `rush install && rush build-packages`, then `pnpm install && pnpm build` in the example.
