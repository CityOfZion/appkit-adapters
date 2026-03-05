# CI sample — Vite React demo build

This directory contains example GitHub Actions workflows you can copy into your repo.

## Notes
- Uses **pnpm** + cache for speed.
- This CI sample is a *build-only* check. Wallet connect flows are not run in CI.

## Tight loop (docs contract)

- Canonical example under test: `examples/vite-react-neo3/`
- Test plan: `tests/TESTPLAN__appkit-adapters.md`
- Local smoke script: `tests/ci-samples/local-smoke.sh`
- Sample workflows:
  - `tests/ci-samples/GHA__vite-react-neo3.yml`
  - `tests/ci-samples/gha__vite_demo_build.yml` (legacy/demo)

Related:
- Validation ledger: `examples/VALIDATION_LOG.md`

## Local smoke
For local (human) verification, run `tests/ci-samples/local-smoke.sh`.
