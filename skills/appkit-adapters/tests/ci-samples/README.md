# CI sample — Vite React examples build

This directory contains an example GitHub Actions workflow you can copy into your repo.

## Notes
- Uses **pnpm** + cache for speed.
- This CI sample is a *build-only* check. Wallet connect flows are not run in CI.
- The examples link the adapters from `packages/` (`file:` dependencies), so the workflow runs `rush install` + `rush build-packages` before installing each example.

## Tight loop (docs contract)

- Examples under test: `examples/vite-react-neo3/` and `examples/simple-app/`
- Test plan: `tests/TESTPLAN__appkit-adapters.md`
- Local smoke script: `tests/ci-samples/local-smoke.sh`
- Sample workflow (matrix over both examples): `tests/ci-samples/GHA__vite-react-neo3.yml`

Related:
- Validation ledger: `examples/VALIDATION_LOG.md`

## Local smoke
For local (human) verification, run `tests/ci-samples/local-smoke.sh` (optionally pass example names, e.g. `local-smoke.sh simple-app`; set `SKIP_PACKAGES=1` if the packages are already built).