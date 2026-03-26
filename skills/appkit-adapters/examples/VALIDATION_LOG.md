---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Run–Break–Fix Validation Log

Keep this as a chronological ledger of validation cycles.

For each cycle, log:
- **Command used** (`pnpm install`, `pnpm dev`, `pnpm build`, etc.)
- **Outcome** (success/failure + error text)
- **Env notes** (tool cap, network flakiness, dependency caching, etc.)

## Conventions

- Canonical validation runs use **pnpm**.
- Any `npm` attempts should be annotated as **non-canonical / for reference only**.

Note: `examples/vite-react-neo3/node_modules/` may appear from local runs. It is not part of the AKB contract and should normally be ignored in reviews/PR diffs.

Environment:
- runtime/tooling: this execution environment enforces a ~60s cap on some commands (notably `npm install`), which can cause false-negative install failures.
- node: v24.14.0
- npm: v11.9.0
- recommendation in this environment: prefer `pnpm` installs; for CI/agent runs use dependency caching or prebuilt images.

## Cycle 1 — vite-react-neo3

### Step: scaffold project
- Command: `npm create vite@latest . -- --template react-ts` (Note: npm — non-canonical, for reference only (pnpm is canonical for validation).)
- Result: ✅ success

### Step: install deps
- Attempt 1: `npm install @reown/appkit @reown/appkit/react @cityofzion/appkit-neo3-adapter` (Note: npm — non-canonical, for reference only (pnpm is canonical for validation).)
- Result: ❌ failed
- Error: tried to install `@reown/appkit/react` (invalid as a package; it is an import subpath)

- Attempt 2: `npm install @reown/appkit @cityofzion/appkit-neo3-adapter` (Note: npm — non-canonical, for reference only (pnpm is canonical for validation).)
- Result: ⚠️ timed out at ~60s (environment cap)
- Interpretation: likely environment/runtime limit, not a package issue.
- Next action:
  - prefer `pnpm add ...` in this environment (often faster)
  - for CI/agent runs with strict caps: enable dependency caching (pnpm store / npm cache) or use prebuilt images
  - if available, increase job timeout / allow longer install steps

## Known correctness constraints (from upstream docs)
- Neo3: must set `universalProviderConfigOverride: Neo3Constants.OVERRIDES`
- Stellar: must set `universalProviderConfigOverride: StellarConstants.OVERRIDES`
- NeoX: EVM (`eip155`); use WagmiAdapter; use `sendTransaction` helper for anti-MEV networks
