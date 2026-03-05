---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Packages & Import Paths

This is the most common pitfall:

- ✅ Install the package: `@reown/appkit`
- ✅ Import React helpers from the **subpath**: `@reown/appkit/react`
- ❌ Do **not** run `npm install @reown/appkit/react` (it is **not** a package)

| Package | Type | Import example | Notes |
|---|---|---|---|
| `@reown/appkit` | core | `import { createAppKit } from '@reown/appkit'` | main install target |
| `@reown/appkit/react` | subpath | `import { AppKitProvider } from '@reown/appkit/react'` | NOT an npm package |
| `@cityofzion/appkit-neo3-adapter` | adapter | `import { neo3Adapter } from '@cityofzion/appkit-neo3-adapter'` | exact name verified |
| `@cityofzion/appkit-neox-adapter` | adapter | `import { neoxAdapter } from '@cityofzion/appkit-neox-adapter'` |  |
| `@cityofzion/appkit-stellar-adapter` | adapter | `import { stellarAdapter } from '@cityofzion/appkit-stellar-adapter'` |  |

## Notes
- Adapter export names (`neo3Adapter`, etc.) should be validated against upstream packages (run–break–fix). Until verified, treat as placeholders.
