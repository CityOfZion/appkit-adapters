---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Skill Library: CityOfZion AppKit Adapters (Reown AppKit)

Purpose: teach agents and humans how to integrate `@cityofzion/appkit-*-adapter` packages (Neo3, Neo X, Stellar, Bitcoin) into applications using Reown AppKit, with the examples directory as the implementation source of truth.

## Canonical examples

Start with the runnable examples first:
- [`examples/vite-react-neo3/`](./examples/vite-react-neo3) — validated Neo3-only example
- [`examples/simple-app/`](./examples/simple-app) — validated multi-chain example (Neo3 + Stellar + Bitcoin + Neo X via `WagmiAdapter`), testnet networks only, port 4173

Both examples link the adapters from this repository through local `file:../../../../packages/<name>` dependencies, so the packages must be built first (see [Verification](#verification)). Both read `VITE_REOWN_PROJECT_ID` (an `.env.example` is provided).

These examples are the primary contract for this skill.

## Reading order

1. [Skill overview](./SKILL.md)
2. [What is AppKit](./overview/WHAT_IS_APPKIT.md)
3. [Quickstart: create AppKit](./quickstarts/QS__create_appkit.md)
4. Quickstarts:
   - [`QS__vite-react__base.md`](./quickstarts/QS__vite-react__base.md)
   - [`QS__vite-react-neo3.md`](./quickstarts/QS__vite-react-neo3.md)

## Overview
- [`WHAT_IS_APPKIT.md`](./overview/WHAT_IS_APPKIT.md)
- [`ADAPTERS_ARCHITECTURE.md`](./overview/ADAPTERS_ARCHITECTURE.md)
- [`SUPPORTED_ENVIRONMENTS.md`](./overview/SUPPORTED_ENVIRONMENTS.md)

## Guides
- Start here: [`GUIDE__adapter_selection.md`](./guides/GUIDE__adapter_selection.md)
- [`GUIDE__neo3__react.md`](./guides/GUIDE__neo3__react.md)
- [`GUIDE__stellar__react.md`](./guides/GUIDE__stellar__react.md)
- [`GUIDE__neox__wagmi.md`](./guides/GUIDE__neox__wagmi.md)
- [`GUIDE__typescript_namespaces.md`](./guides/GUIDE__typescript_namespaces.md)
- [`GUIDE__configuration_precedence_and_overrides.md`](./guides/GUIDE__configuration_precedence_and_overrides.md)
- [`GUIDE__react_import_paths_and_ssr.md`](./guides/GUIDE__react_import_paths_and_ssr.md)
- [`GUIDE__node_and_backend_patterns.md`](./guides/GUIDE__node_and_backend_patterns.md)

## Reference
- Neo3: [`ADAPTER__neo3.md`](./reference/ADAPTER__neo3.md)
- Stellar: [`ADAPTER__stellar.md`](./reference/ADAPTER__stellar.md)
- Bitcoin: [`ADAPTER__bitcoin.md`](./reference/ADAPTER__bitcoin.md)
- Neo X: [`ADAPTER__neox.md`](./reference/ADAPTER__neox.md)
- Package/import rules: [`PACKAGES.md`](./reference/PACKAGES.md)
- Exports and types: [`REF__exports_and_types.md`](./reference/REF__exports_and_types.md)
- Networks: [`REF__networks.md`](./reference/REF__networks.md)
- Universal provider overrides: [`REF__universal_provider_overrides.md`](./reference/REF__universal_provider_overrides.md)

## Examples
- Overview: [`examples/README.md`](./examples/README.md)
- Policy: [`examples/POLICY.md`](./examples/POLICY.md)
- Neo3 example: [`vite-react-neo3/`](./examples/vite-react-neo3)
- Multi-chain example: [`simple-app/`](./examples/simple-app)
- Validation history: [`VALIDATION_LOG.md`](./examples/VALIDATION_LOG.md)

## Checklists
- Start here: [`CHK__new_integration.md`](./checklists/CHK__new_integration.md)
- [`CHK__integration_ready.md`](./checklists/CHK__integration_ready.md)
- [`CHK__pre_release.md`](./checklists/CHK__pre_release.md)
- [`CHK__security_and_privacy.md`](./checklists/CHK__security_and_privacy.md)

## Troubleshooting
- Start here: [`TROUBLESHOOTING.md`](./troubleshooting/TROUBLESHOOTING.md)
- [`FAQ.md`](./troubleshooting/FAQ.md)
- [`TROUBLE__install.md`](./troubleshooting/TROUBLE__install.md)
- [`TROUBLE__connect_flow.md`](./troubleshooting/TROUBLE__connect_flow.md)
- [`TROUBLE__rpc_and_tx.md`](./troubleshooting/TROUBLE__rpc_and_tx.md)

## Tests
- [`tests/README.md`](./tests/README.md)
- Test plan: [`TESTPLAN__appkit-adapters.md`](./tests/TESTPLAN__appkit-adapters.md)
- CI samples: [`tests/ci-samples/README.md`](./tests/ci-samples/README.md)

## Changelog
- [`CHANGELOG.md`](./CHANGELOG.md)

## Verification

Canonical verification commands. Build the local adapter packages first, from the repository root:

```bash
rush install
rush build-packages
```

Then build each example (from `skills/appkit-adapters/`):

```bash
cd examples/vite-react-neo3 && pnpm install && pnpm build
cd examples/simple-app && pnpm install && pnpm build
```