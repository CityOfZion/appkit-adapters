# AKB/SKILLS/appkit-adapters — Plan + Status (WIP)

## Canonical path
- `AKB/SKILLS/appkit-adapters/`

## Proposed IA (updated)
Top-level:
- `SKILL.md`
- `INDEX.md`
- `CHANGELOG.md` (optional)

Dirs:
- `00_overview/`
  - `WHAT_IS_APPKIT.md`
  - `ADAPTERS_ARCHITECTURE.md`
  - `SUPPORTED_ENVIRONMENTS.md`
- `01_quickstart/`
  - `QS__vite-react-neo3.md`
  - `QS__vite-react-neox.md`
  - `QS__vite-react-stellar.md`
  - `QS__nextjs-neo3.md` (optional)
- `02_guides/` (deeper, decision-oriented)
- `03_reference/` (APIs, constants, config)
- `checklists/` (ship-ready checks)
- `troubleshooting/`
- `04_examples/` (runnable scaffolds)
- `tests/` (test plan + CI samples)

## Current implementation in workspace (Trinity)
Exists now:
- numbered overview/quickstart/guides/reference/examples migrated:
  - `00_overview/`, `01_quickstart/`, `02_guides/`, `03_reference/`, `04_examples/`

## Reconciliation to do
- Ensure content coverage matches SKILL.md file map
- Maintain backwards compatibility via stub redirect files (optional)

## Validation loop
- Prefer pnpm for installs (speed)
- For each quickstart: create runnable example + verify build
- Record each run–break–fix cycle in `04_examples/VALIDATION_LOG.md`
