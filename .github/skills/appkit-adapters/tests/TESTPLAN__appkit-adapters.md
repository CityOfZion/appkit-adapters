---
title: TESTPLAN — appkit-adapters
status: draft
owner: Operator-assign
last_updated: 2026-03-04
version: v0.1
---

# TESTPLAN__appkit-adapters.md

## Scope

### In-scope
- **Canonical runnable example:** `AKB/SKILLS/appkit-adapters/examples/vite-react-neo3/`
- **Future/optional:** NeoX / Stellar variants **if/when** they exist under `examples/`.

### Out of scope (for now)
- Full end-to-end wallet interaction in CI (approval flows, signing, mobile deep links, etc.).
- Real-chain transactions (Neo N3 mainnet/testnet, etc.).
- Performance/load testing.

## Test tiers

### Tier 0 — Lint / typecheck
Goal: catch obvious issues early.

From inside the example directory:
```bash
cd AKB/SKILLS/appkit-adapters/examples/vite-react-neo3
pnpm -v
node -v

# if configured by the example
pnpm lint
pnpm typecheck
```

Notes:
- If `lint` or `typecheck` scripts are not present yet, prefer adding them later rather than faking a pass.

### Tier 1 — Build
Goal: ensure a clean install can produce a production build.

```bash
cd AKB/SKILLS/appkit-adapters/examples/vite-react-neo3
pnpm install --frozen-lockfile
pnpm build
```

### Tier 2 — Basic runtime sanity (local)
Goal: confirm the dev server starts, compiles, and serves.

Manual local steps:
```bash
cd AKB/SKILLS/appkit-adapters/examples/vite-react-neo3
pnpm install
pnpm dev
```

Then:
- Open the URL printed by Vite (usually `http://localhost:5173`).
- Confirm the page renders and there are no immediate console build/compile errors.

Automation note:
- We may later add a headless smoke check (e.g., `pnpm dev --host 127.0.0.1 --port 4173` + `curl` / `wait-on`) but it’s intentionally **not required** for v0.1.

## Environments

### Node
- Assumed: **Node 20.x LTS** (recommended for GitHub Actions).
- Local may vary; if issues appear, align to Node 20.

### Package manager
- **Canonical:** `pnpm`
- `npm` is not canonical for validation due to install-time variability under strict execution caps.

## Pass criteria
- The canonical example (`vite-react-neo3`) can:
  - install from clean state (no preexisting `node_modules/`), and
  - build successfully (`pnpm build`).
- No TypeScript type errors on minimal flows **if** `typecheck` is configured.

## Reporting / logging
- Record all validation runs in `AKB/SKILLS/appkit-adapters/examples/VALIDATION_LOG.md`.
- Include: date, environment (OS/Node/pnpm), commands run, and outcome.
