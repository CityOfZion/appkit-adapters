# Tests and quick validation

Status: draft
Owner: Trinity
Last updated: 2026-03-04

## Purpose

Provide a **quick entrypoint** for validating the AppKit adapters skill locally or in CI.

## Test plan (source of truth)

- The detailed test plan lives in `TESTPLAN__appkit-adapters.md`.
- This file explains how to run a minimal smoke test and where to find CI samples.

## Quick local smoke flow

Run these from the skill root: `AKB/SKILLS/appkit-adapters/`.

### 1) Build the canonical example

Canonical validation target:

- `examples/vite-react-neo3/`

Commands:

```bash
cd examples/vite-react-neo3

# canonical
pnpm install
pnpm build

# optional local dev
pnpm dev
```

Notes:
- In constrained agent/CI runners, `npm install` may hit strict time caps. Prefer `pnpm` + caching.
- If the build fails due to imports, first re-check the import-path rule:
  - install: `@reown/appkit`
  - import react helpers: `@reown/appkit/react` (subpath)
  - never install: `@reown/appkit/react`

### 2) Optional lint

```bash
pnpm lint
```

## CI samples

- CI workflow and script samples live under `tests/ci-samples/`.
- Use these samples as a starting point when wiring adapters into a new project CI.

## Relation to examples

- Examples under `examples/` (especially `vite-react-neo3`) are used as **validation targets**.
- `examples/VALIDATION_LOG.md` records when and how examples were last validated.
