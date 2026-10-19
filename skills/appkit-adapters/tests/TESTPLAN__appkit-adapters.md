---
title: TESTPLAN — appkit-adapters
status: draft
owner: Operator-assign
last_updated: 2026-10-19
version: v0.2
---

# TESTPLAN__appkit-adapters.md

Paths below are relative to the appkit-adapters repo root; the skill lives at `skills/appkit-adapters/`.

## Scope

### In-scope
- **Canonical runnable example:** `skills/appkit-adapters/examples/vite-react-neo3/` (Neo3 only).
- **Multi-chain example:** `skills/appkit-adapters/examples/simple-app/` (Neo3 + Stellar + Bitcoin + NeoX via `WagmiAdapter`, testnets, port 4173).
- Both examples consume the adapters from `packages/` via `file:` links, so the adapter packages build is part of every run.

### Out of scope (for now)
- Full end-to-end wallet interaction in CI (approval flows, signing, mobile deep links, etc.).
- Real-chain transactions (Neo N3, Stellar, Bitcoin, NeoX mainnet/testnet).
- Performance/load testing.

## Prerequisite — build the adapter packages

From the repo root:
```bash
rush install
rush build-packages
```

(Equivalent without a global Rush: `node common/scripts/install-run-rush.js install` and `node common/scripts/install-run-rush.js build-packages`.)

Re-run after any change under `packages/`.

## Test tiers

### Tier 0 — Lint / typecheck
Goal: catch obvious issues early.

```bash
cd skills/appkit-adapters/examples/vite-react-neo3
pnpm -v
node -v
pnpm lint
```

Notes:
- Both examples typecheck as part of `pnpm build` (`tsc -b && vite build`).
- `simple-app` has no `lint` script; prefer adding one later rather than faking a pass.

### Tier 1 — Build
Goal: ensure a clean install can produce a production build. Run for each example (`vite-react-neo3`, `simple-app`):

```bash
cd skills/appkit-adapters/examples/<example>
pnpm install --frozen-lockfile
pnpm build
```

Shortcut for both (includes the prerequisite): `skills/appkit-adapters/tests/ci-samples/local-smoke.sh`.

### Tier 2 — Basic runtime sanity (local)
Goal: confirm the dev server starts, compiles, and serves.

Manual local steps:
```bash
cd skills/appkit-adapters/examples/<example>
cp .env.example .env   # set VITE_REOWN_PROJECT_ID
pnpm install
pnpm dev
```

Then:
- Open the URL printed by Vite (`vite-react-neo3`: usually `http://localhost:5173`; `simple-app`: `http://localhost:4173`).
- Confirm the page renders and there are no immediate console build/compile errors.
- `simple-app`: confirm the AppKit modal lists Neo3, Stellar, Bitcoin and NeoX testnets.

Automation note:
- We may later add a headless smoke check (e.g., `pnpm preview` + `curl` / `wait-on`) but it's intentionally **not required** for v0.2.

## Environments

### Node
- Assumed: **Node 22.x LTS, 22.12+** (Vite 8 minimum; matches the repo CI and the sample workflow).
- Local may vary; if issues appear, align to Node 22.

### Package manager
- **Canonical:** `pnpm` 9 (examples declare `packageManager: pnpm@9.15.9`), Rush for the adapter packages.
- `npm` is not canonical for validation due to install-time variability under strict execution caps.

## Pass criteria
- After `rush build-packages`, each example (`vite-react-neo3`, `simple-app`) can:
  - install from clean state (no preexisting `node_modules/`), and
  - build successfully (`pnpm build`, which includes `tsc -b`).

## Reporting / logging
- Record all validation runs in `skills/appkit-adapters/examples/VALIDATION_LOG.md`.
- Include: date, example, environment (OS/Node/pnpm), commands run, and outcome.