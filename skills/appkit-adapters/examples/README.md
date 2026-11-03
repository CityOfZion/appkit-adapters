---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.2
---

# Examples

This directory contains runnable examples.

## Front door / golden path

- Canonical (golden path) example: `vite-react-neo3/` (Vite + React + TS + Neo3 only)
- Multi-chain example: `simple-app/` (Vite + React + TS; Neo3 + Stellar + Bitcoin + NeoX via `WagmiAdapter`, testnets, port 4173)

Separate `vite-react-neox/` / `vite-react-stellar/` examples are not planned; `simple-app/` covers those chains.

## Prerequisite: build the adapter packages

Both examples link the adapters from this repo via `file:../../../../packages/<name>` (not from npm), so build the packages first, from the repo root:

```bash
rush install && rush build-packages
```

Then, in the example:

```bash
cp .env.example .env   # set VITE_REOWN_PROJECT_ID
pnpm install
pnpm build             # tsc -b && vite build
```

After rebuilding a package, run `pnpm install` again in the example to pick up the new build output.

## Conventions

- Package manager: **`pnpm`** (canonical for examples and validation; `packageManager: pnpm@9.15.9`).
- Examples are intentionally standalone; no `pnpm-workspace.yaml` is required for this directory.
- Env vars are read with `import.meta.env.VITE_REOWN_PROJECT_ID` (never `process.env`).

## Links (keep this tight)

- Validation ledger: `examples/VALIDATION_LOG.md`
- Test plan: `tests/TESTPLAN__appkit-adapters.md`
- Local smoke script: `tests/ci-samples/local-smoke.sh`
- Policy: `examples/POLICY.md`

> Note on `node_modules/` and `dist/`
>
> `examples/*/node_modules/` and `examples/*/dist/` may appear from local runs. They are git-ignored and should normally be ignored in reviews/PR diffs. The canonical behavior is defined by:
> - `examples/vite-react-neo3/README.md`, `examples/simple-app/README.md`
> - `examples/VALIDATION_LOG.md`
> - `tests/TESTPLAN__appkit-adapters.md`

Run–break–fix cycle (chronological ledger; keep notes in `VALIDATION_LOG.md`):
1) build the adapter packages (`rush install && rush build-packages`)
2) install deps (`pnpm install`)
3) run dev server (`pnpm dev`)
4) confirm connect flow opens
5) confirm provider exists after connection

## Tests & CI

For both examples:

- Local smoke test: `tests/ci-samples/local-smoke.sh`
- Test plan and tiers: `tests/TESTPLAN__appkit-adapters.md`
- Sample GitHub Actions workflow (matrix over both examples): `tests/ci-samples/GHA__vite-react-neo3.yml`