# Tests and quick validation

Status: draft
Owner: Trinity
Last updated: 2026-10-19

## Purpose

Provide a **quick entrypoint** for validating the AppKit adapters skill locally or in CI.

## Test plan (source of truth)

- The detailed test plan lives in `TESTPLAN__appkit-adapters.md`.
- This file explains how to run a minimal smoke test and where to find CI samples.

## Quick local smoke flow

The skill lives at `skills/appkit-adapters/` inside the appkit-adapters repo.

### 0) Build the adapter packages

Both examples link the adapters via `file:../../../../packages/<name>`, so build them first, from the repo root:

```bash
rush install
rush build-packages
```

(Without a global Rush: `node common/scripts/install-run-rush.js install` / `... build-packages`.)

### 1) Build the examples

Validation targets:

- `examples/vite-react-neo3/` (canonical; Neo3 only)
- `examples/simple-app/` (multi-chain: Neo3 + Stellar + Bitcoin + NeoX via `WagmiAdapter`, testnets)

Commands (from `skills/appkit-adapters/`):

```bash
cd examples/vite-react-neo3   # or examples/simple-app

cp .env.example .env          # set VITE_REOWN_PROJECT_ID for runtime checks
pnpm install
pnpm build

# optional local dev
pnpm dev
```

Or run both in one go: `tests/ci-samples/local-smoke.sh`.

Notes:
- In constrained agent/CI runners, `npm install` may hit strict time caps. Prefer `pnpm` + caching.
- If install fails resolving `file:` dependencies or `dist/` is missing, re-run step 0.
- If the build fails due to imports, first re-check the import-path rule:
  - install: `@reown/appkit`
  - import react helpers: `@reown/appkit/react` (subpath)
  - never install: `@reown/appkit/react`

### 2) Optional lint

`vite-react-neo3` defines a lint script:

```bash
pnpm lint
```

## CI samples

- CI workflow and script samples live under `tests/ci-samples/`.
- Use these samples as a starting point when wiring adapters into a new project CI.

## Relation to examples

- Examples under `examples/` (`vite-react-neo3` and `simple-app`) are used as **validation targets**.
- `examples/VALIDATION_LOG.md` records when and how examples were last validated.