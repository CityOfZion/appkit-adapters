# Examples policy

Status: draft
Owner: Trinity
Last updated: 2026-03-04

## Purpose

Define what we **guarantee** about examples under `examples/` and how they relate to the adapters skill.

## Canonical example

- `examples/vite-react-neo3/` is the **canonical example** for automated checks and end-to-end flows.
- New examples should only be added when they are **materially divergent** (different framework, chain, or integration pattern).

## Required contents per example

Each example **must** include:

- A `README.md` with:
  - Prerequisites
  - Setup steps
  - Run commands
- A `.env.example` file for any required environment variables.
- Minimal `package.json` scripts to run the example (`dev`, `build`, and/or `test`).

## Prohibited contents

- **No `node_modules` directories** are committed under `examples/`.
- No secrets or real API keys in any `.env` or config files.

## Relationship to validation

- `examples/VALIDATION_LOG.md` records which examples have been recently validated and on which environments.
- `tests/TESTPLAN__appkit-adapters.md` describes how examples are used in manual and automated validation.
