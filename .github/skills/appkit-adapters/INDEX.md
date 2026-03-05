---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Skill Library: CityOfZion AppKit Adapters (Reown AppKit)

Purpose: teach agents (and humans) how to integrate `@cityofzion/appkit-*-adapter` packages into applications using Reown AppKit.

## Reading order

1. [Overview](./overview/WHAT_IS_APPKIT.md)
2. [Quickstart: create AppKit](./quickstarts/QS__create_appkit.md)
3. Quickstart: Vite + React
   - Base: [`QS__vite-react__base.md`](./quickstarts/QS__vite-react__base.md)
   - Neo3: [`QS__vite-react-neo3.md`](./quickstarts/QS__vite-react-neo3.md)

## Guides
- Directory: [`./guides/`](./guides/)
- Start here: [`GUIDE__adapter_selection.md`](./guides/GUIDE__adapter_selection.md)
- Also:
  - [`GUIDE__auth_and_sessions.md`](./guides/GUIDE__auth_and_sessions.md)
  - [`GUIDE__multi_chain_selection.md`](./guides/GUIDE__multi_chain_selection.md)
  - [`GUIDE__agent_tool_design.md`](./guides/GUIDE__agent_tool_design.md)
  - [`GUIDE__node_and_backend_patterns.md`](./guides/GUIDE__node_and_backend_patterns.md)

## Reference
- Directory: [`./reference/`](./reference/)

### Per-adapter references (canonical)
- Neo3: [`ADAPTER__neo3.md`](./reference/ADAPTER__neo3.md)
- NeoX: [`ADAPTER__neox.md`](./reference/ADAPTER__neox.md)
- Stellar: [`ADAPTER__stellar.md`](./reference/ADAPTER__stellar.md)

### Shared references
- Package inventory: [`PACKAGES.md`](./reference/PACKAGES.md)
- Networks: [`REF__networks.md`](./reference/REF__networks.md)
- Universal Provider overrides: [`REF__universal_provider_overrides.md`](./reference/REF__universal_provider_overrides.md)
- Exports and types: [`REF__exports_and_types.md`](./reference/REF__exports_and_types.md)

### Add a new adapter reference (how-to)
1. Create `reference/ADAPTER__<chain>.md` (singular, one chain per file).
2. Include: Install, React bindings pitfall, minimal init snippet, quirks/gotchas, and links to:
   - `examples/vite-react-neo3/README.md` (repro baseline)
   - `reference/PACKAGES.md` (React subpath pitfall)

## Checklists
- Directory: [`./checklists/`](./checklists/)
- Start here: [`CHK__new_integration.md`](./checklists/CHK__new_integration.md)

## Troubleshooting
- Directory: [`./troubleshooting/`](./troubleshooting/)
- Start here: [`TROUBLESHOOTING.md`](./troubleshooting/TROUBLESHOOTING.md)

## Examples
- Directory: [`./examples/`](./examples/)
- Start here: [`vite-react-neo3/`](./examples/vite-react-neo3/) (validated runnable example)
- Validation log: [`VALIDATION_LOG.md`](./examples/VALIDATION_LOG.md)

## Tests
- Directory: [`./tests/`](./tests/)
- Start here: [`TESTPLAN__appkit-adapters.md`](./tests/TESTPLAN__appkit-adapters.md)

## Upstream
- Repo: https://github.com/CityOfZion/appkit-adapters
- Packages:
  - `@cityofzion/appkit-neo3-adapter`
  - `@cityofzion/appkit-neox-adapter`
  - `@cityofzion/appkit-stellar-adapter`

## Run / Verify

Canonical runnable example (used for validation):

- `examples/vite-react-neo3/` (pnpm is canonical)

See also:

- `examples/VALIDATION_LOG.md` for run–break–fix history.
- `tests/TESTPLAN__appkit-adapters.md` + `tests/ci-samples/` for local smoke/CI scaffolds.
