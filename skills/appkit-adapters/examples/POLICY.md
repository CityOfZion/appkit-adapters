# Examples policy

Status: draft
Owner: Trinity
Last updated: 2026-10-19

## Purpose

Define what we **guarantee** about examples under `examples/` and how they relate to the adapters skill.

## Canonical example

- `examples/vite-react-neo3/` is the **canonical example** for automated checks and end-to-end flows (Neo3 only).
- `examples/simple-app/` is the **multi-chain example** (Neo3 + Stellar + Bitcoin + NeoX via `WagmiAdapter`, testnets) and is validated the same way.
- New examples should only be added when they are **materially divergent** (different framework, chain, or integration pattern).

## Adapter dependencies

- Examples consume the CityOfZion adapters from this repo via `file:../../../../packages/<name>`, not from npm, so they always track the current source (including unpublished packages such as `@cityofzion/appkit-bitcoin-adapter`).
- Consequently, `rush install && rush build-packages` (repo root) is a prerequisite for installing or building any example; READMEs must say so.
- Reown / third-party dependencies are pinned (e.g. `@reown/appkit@1.8.19`) and committed with a `pnpm-lock.yaml`.

## Required contents per example

Each example **must** include:

- A `README.md` with:
  - Prerequisites (including the adapter packages build)
  - Setup steps
  - Run commands
- A `.env.example` file (required) listing every environment variable, at minimum `VITE_REOWN_PROJECT_ID`, read via `import.meta.env` (never `process.env`).
- Minimal `package.json` scripts to run the example (`dev`, `build`, and/or `test`); `build` must typecheck (`tsc -b && vite build`).
- A `packageManager` field (`pnpm@9.15.9`) and a committed `pnpm-lock.yaml`.

## Prohibited contents

- **No `node_modules` or `dist` directories** are committed under `examples/`.
- No secrets or real API keys in any `.env` or config files.

## Relationship to validation

- `examples/VALIDATION_LOG.md` records which examples have been recently validated and on which environments.
- `tests/TESTPLAN__appkit-adapters.md` describes how examples are used in manual and automated validation.
