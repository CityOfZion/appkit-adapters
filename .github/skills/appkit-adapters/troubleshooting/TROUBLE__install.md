---
status: draft
owner: Trinity
last_updated: 2026-03-04
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
  - `pnpm add @reown/appkit @cityofzion/appkit-neo3-adapter`
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
