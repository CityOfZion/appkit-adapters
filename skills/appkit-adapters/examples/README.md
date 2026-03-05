---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Examples

This directory contains runnable examples.

## Front door / golden path

- Canonical (golden path) example: `vite-react-neo3/` (Vite + React + TS + Neo3)

Optional (later):
- `vite-react-neox/`
- `vite-react-stellar/`

## Conventions

- Package manager: **`pnpm`** (canonical for examples and validation).
- `npm` commands may be shown for reference, but may fail under strict ~60s execution caps.

## Links (keep this tight)

- Validation ledger: `examples/VALIDATION_LOG.md`
- Test plan: `tests/TESTPLAN__appkit-adapters.md`
- Local smoke script: `tests/ci-samples/local-smoke.sh`

> Note on `node_modules/`
>
> `examples/vite-react-neo3/node_modules/` may appear from local runs. It is not part of the AKB contract and should normally be ignored in reviews/PR diffs. The canonical behavior is defined by:
> - `examples/vite-react-neo3/README.md`
> - `examples/VALIDATION_LOG.md`
> - `tests/TESTPLAN__appkit-adapters.md`

Run–break–fix cycle (chronological ledger; keep notes in `VALIDATION_LOG.md`):
1) create project
2) install deps (pnpm)
3) run dev server
4) confirm connect flow opens
5) confirm provider exists after connection

## Tests & CI

For the canonical `vite-react-neo3` example:

- Local smoke test: `tests/ci-samples/local-smoke.sh`
- Test plan and tiers: `tests/TESTPLAN__appkit-adapters.md`
- Sample GitHub Actions workflow: `tests/ci-samples/GHA__vite-react-neo3.yml`
