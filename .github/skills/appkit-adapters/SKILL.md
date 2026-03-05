---
status: draft
owner: Trinity
last_updated: 2026-03-05
version: 0.1
---

# SKILL: Integrate CityOfZion AppKit Adapters

## Proved integration contract (current SoT)

These are **not examples**; they are the **tested, version-specific contract** for this skill and MUST remain true unless `appkit-play` and logs are updated.

### Provider contract — `@reown/appkit@1.8.19`

- We **do not** construct or pass an `appKit` instance.
- We **do** pass a **createAppKit options/config object** into the provider via spread props.
- Type name note (proved in this workspace):
  - Use `CreateAppKit` from `@reown/appkit`.
  - In this workspace, `AppKitProviderProps = CreateAppKit & { children }` (see Evidence notes).
  - Do **not** assert a different exported type name unless a real build confirms it.

```ts
// src/lib/appkit.ts
// NOTE: Type name is version-dependent. Use the library-exported options type.
import type { CreateAppKit } from '@reown/appkit'

import { mainnet } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// NeoX: networks only (see below)
import type { AppKitNetwork } from '@reown/appkit/networks'
import {
  neoXMainnetNetwork,
  neoXTestnetNetwork,
} from '@cityofzion/appkit-neox-adapter'

export const appKitConfig: CreateAppKit = {
  projectId,
  networks: [mainnet, neoXMainnetNetwork, neoXTestnetNetwork] satisfies AppKitNetwork[],
  adapters: [new WagmiAdapter({ wagmiConfig })],
}
```

```tsx
// src/providers.tsx
import { AppKitProvider } from '@reown/appkit/react'
import { appKitConfig } from './lib/appkit'

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppKitProvider {...appKitConfig}>{children}</AppKitProvider>
}
```

**Any guidance using `<AppKitProvider appKit={...}>` or a `client/config` prop is incorrect for 1.8.19 and will be treated as a regression.**

### NeoX adapter reality — `@cityofzion/appkit-neox-adapter@1.0.0`

What exists today (SoT):

- The package exports **network definitions** (e.g. `neoXMainnetNetwork`, `neoXTestnetNetwork`).
- It also exports some **wagmi actions**.

What does **not** exist today:

- There is **no** NeoX-specific AppKit adapter factory for use in `adapters: [...]`.
  Do **not** claim or show examples of:

```ts
// ❌ does not exist in 1.0.0
import { createNeoxAdapter } from '@cityofzion/appkit-neox-adapter'

const adapters = [createNeoxAdapter(...)]
```

How we wire NeoX in the proved harness:

```ts
import {
  neoXMainnetNetwork,
  neoXTestnetNetwork,
} from '@cityofzion/appkit-neox-adapter'

export const appKitConfig = {
  // ...
  networks: [mainnet, neoXMainnetNetwork, neoXTestnetNetwork],
  adapters: [new WagmiAdapter({ wagmiConfig })], // wagmi-only today
} satisfies CreateAppKit
```

### NeoX support scope (as of `@cityofzion/appkit-neox-adapter@1.0.0`)

**Supported today**

- Use NeoX networks with AppKit:
  - Import from `@cityofzion/appkit-neox-adapter`
  - Treat them as standard AppKit `Network` objects:
    - `networks: [mainnet, neoXMainnetNetwork, neoXTestnetNetwork, ...]`
- Combine NeoX with wagmi:
  - AppKit is configured with a **wagmi-only** adapter:
    - `adapters: [new WagmiAdapter({ wagmiConfig })]`
  - Downstream wallet / contract calls are handled via wagmi on the configured chains.
- React surface:
  - **Only** AppKit’s official React provider/hooks/components (`@reown/appkit/react`)
  - **No additional** React provider from the NeoX package.

**Not provided / Out of scope (1.0.0)**

- No NeoX-specific AppKit adapter factory:
  - There is **no** `createNeoxAdapter(...)` or similar for `adapters: [...]`.
  - Do not show or rely on any examples that add a NeoX adapter into the `adapters` array.
- No extra React primitives:
  - The NeoX package does **not** expose its own `NeoxProvider`, custom hooks, or UI components.
  - All React integration is via AppKit’s `<AppKitProvider {...appKitConfig}>` + wagmi.
- No version-agnostic provider contract:
  - For `@reown/appkit@1.8.19`, the only supported pattern in this skill is:
    - `return <AppKitProvider {...appKitConfig}>{children}</AppKitProvider>`
  - Any use of `appKit`, `client`, or `config` props on `AppKitProvider` is considered a regression and must be rejected unless:
    - `appkit-play` and this section are updated to reflect a **new, tested** version.

### Version policy (enforced)

- Default stance: **target latest stable** `@reown/appkit`, `@reown/appkit-adapter-wagmi`, and `@cityofzion/appkit-neox-adapter`.
- Only pin or downgrade if:
  - `pnpm build` in `appkit-play` fails due to a breaking change, **and**
  - we capture:
    - `pnpm list` for these three packages, and
    - the failing build log (first 60–120 lines including the first TypeScript error),
    - plus a minimal patch / SKILL.md delta that restores green builds.
- Any future change to the provider contract or NeoX exports **must**:
  - update `appkit-play`,
  - run `pnpm install && pnpm build` in a real env,
  - and update this “Proved integration contract” section with new, concrete snippets.


## When to use

When an agent needs to add Neo N3, NeoX, or Stellar wallet connectivity to an app using Reown AppKit.

This skill generates **framework-specific integration steps** (config, example code, and checklists) for Reown AppKit wallet connectivity on Neo N3, NeoX, and Stellar.

Non-goals: this skill does **not** validate chain RPC health, wallet behavior, or end-to-end signing; those must be tested in the target environment/CI.

## Supported combinations (v0.1)

This skill only treats the following combinations as **in scope** for v0.1:

| Environment            | Neo N3 | NeoX | Stellar | Status       | Notes                                                     |
|------------------------|--------|------|---------|--------------|-----------------------------------------------------------|
| React + Vite           | ✅     | ✅   | ✅      | In-scope     | Canonical example path for this skill                     |
| Next.js (Pages router) | ✅     | ✅   | ✅      | In-scope     | All wallet/AppKit usage must be in client-safe components |
| Next.js (App Router)   | ✅     | ✅   | ✅      | In-scope     | **Supported via client components only** (see below)      |
| Node (no React UI)     | ⚠️     | ⚠️   | ⚠️      | Limited      | RPC-only helpers; **no AppKit UI**; see “Non-goals”       |
| React Native           | 🚧     | 🚧   | 🚧      | Out-of-scope | Not covered in v0.1; agents MUST NOT generate RN code     |

### Next.js App Router support

For **Next.js App Router**:

- All wallet/AppKit-related components and hooks MUST be used in **client components only**.
- Agents SHOULD:
  - generate or update a client component such as `app/providers.tsx` to host `AppKitProvider`,
  - ensure any relevant components begin with `"use client";`,
  - import that provider from `app/layout.tsx` (or equivalent) to wrap the tree.
- Agents MUST NOT:
  - call wallet/AppKit hooks from server components,
  - attempt to render the AppKit modal from server components.

## Inputs to ask for

### Required

- Target environment: React/Vite, Next.js, Node, React Native
- Target chain(s): Neo3, NeoX, Stellar (one or more)

### Required before production configuration

- Reown `projectId`
  - Placeholder OK for code scaffolding
  - Real ID required before deployment

### Optional / feature flags

- NeoX anti-MEV preference (`true`/`false`)
  - Default: `false` (if not specified)

## Version assumptions (v0.1)

- Node.js: **18 or 20 (LTS)**
- pnpm: **>= 9**
- React: **18**
- Vite: **>= 5**
- Next.js: **>= 14**
- wagmi: **>= 2**
- Adapter package versions: default to the **latest published stable** versions.
  - Only pin/downgrade if a breaking change blocks the harness build.
  - For this repo’s proved contract, `appkit-play` passed with `@reown/appkit@1.8.19`.

## Quickstart (local dev / CI)

Canonical build validation commands:

```bash
pnpm install --frozen-lockfile && pnpm build
```

npm fallback:

```bash
npm ci && npm run build
```

### `.env` guidance

Required:
- `REOWN_PROJECT_ID`

Optional (per chain / local dev):
- `NEO3_RPC_URL`
- `NEOX_RPC_URL`
- `STELLAR_HORIZON_URL`

Suggested `.env.example` snippet (recommended, but this skill does **not** require it be checked into the repo):

```bash
# Required
REOWN_PROJECT_ID=

# Optional
NEO3_RPC_URL=
NEOX_RPC_URL=
STELLAR_HORIZON_URL=
```

## Outputs (what the agent must produce)

### 1) Dependencies

- Provide exact install commands for required packages.
- **No downgrades**: do not lower existing versions in `package.json` unless explicitly requested.
- Prefer adding missing deps over swapping out the user’s chosen tooling.

### 2) App entry / provider wiring (by environment)

The agent must output the exact file(s) to create/update to wire providers:

- React + Vite: `src/main.tsx`
- Next.js (Pages): `pages/_app.tsx`
- Next.js (App Router): `app/providers.tsx` and `app/layout.tsx`

Provider contract note (proved in `appkit-play` with `@reown/appkit@1.8.19`):
- `AppKitProvider` should be mounted as:
  - `return <AppKitProvider {...appKitConfig}>{children}</AppKitProvider>`
- `appKitConfig` should be the **createAppKit options/config object** (do not pass an `appKit` instance prop).
  - In this workspace, type it as `CreateAppKit` (proved via `@reown/appkit` typings).

NeoX package limitation note (proved in `appkit-play` with `@cityofzion/appkit-neox-adapter@1.0.0`):
- NeoX integration is via **NeoX `Network` exports** added to `networks: [...]`.
- This package does **not** expose a NeoX AppKit adapter factory/blueprint for `adapters: [...]`.
- No additional React providers/hooks are provided beyond AppKit + wagmi.

For Next.js App Router, ensure anything that touches AppKit/wallet hooks is inside a client component (`"use client"`).

### 3) Minimal connect UI

- Provide a minimal connect/disconnect UI scaffold (a single component is sufficient) that:
  - renders a “Connect” affordance when disconnected
  - renders a “Disconnect” affordance when connected
  - is explicit about where it should be mounted (e.g., `App.tsx`, a page, or a layout slot)

## Proven wiring (React) — `@reown/appkit@1.8.19`

**Contract (proved via `appkit-play` build):**
- `AppKitProvider` expects the **createAppKit options/config props**, **not** an object returned by `createAppKit(...)`.
- Wire the provider by **spreading the config object**:
  - `return <AppKitProvider {...appKitConfig}>{children}</AppKitProvider>`

### Example: React + Vite harness (proved in `appkit-play`)

> This example mirrors the **actual, passing harness** used to validate the contract for
> `@reown/appkit@1.8.19` and `@cityofzion/appkit-neox-adapter@1.0.0`. Do not change this
> pattern without updating `appkit-play` and re-running `pnpm build`.

#### `src/lib/appkit.ts`

```ts
import type { CreateAppKit } from '@reown/appkit'
import { mainnet } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  neoXMainnetNetwork,
  neoXTestnetNetwork,
} from '@cityofzion/appkit-neox-adapter'

// Example-only placeholders; replace with your own env/config.
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID ?? ''
const wagmiConfig = {} as const

const wagmiAdapter = new WagmiAdapter({ wagmiConfig })

export const appKitConfig: CreateAppKit = {
  projectId,
  networks: [mainnet, neoXMainnetNetwork, neoXTestnetNetwork],
  adapters: [wagmiAdapter],
}
```

#### `src/providers.tsx`

```tsx
import type { ReactNode } from 'react'
import { AppKitProvider } from '@reown/appkit/react'
import { appKitConfig } from './lib/appkit'

export function Providers({ children }: { children: ReactNode }) {
  // Proven contract for @reown/appkit@1.8.19:
  // - spread the config object
  // - do NOT pass an appKit/client/config prop
  return <AppKitProvider {...appKitConfig}>{children}</AppKitProvider>
}
```

### `src/lib/appkit.ts` (config-only; no `createAppKit` call required)

```ts
import type { CreateAppKit } from '@reown/appkit'
import { mainnet, sepolia } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// NeoX package exports networks; it does NOT export an AppKit adapter factory.
import {
  neoXMainnetNetwork,
  neoXTestnetNetwork
} from '@cityofzion/appkit-neox-adapter'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID ?? ''

const wagmiAdapter = new WagmiAdapter({ projectId })

export const appKitConfig: CreateAppKit = {
  projectId,
  networks: [mainnet, sepolia, neoXMainnetNetwork, neoXTestnetNetwork],
  adapters: [wagmiAdapter]
}
```

### `src/providers.tsx` (spread config into provider)

```tsx
import type { ReactNode } from 'react'
import { AppKitProvider } from '@reown/appkit/react'
import { appKitConfig } from './lib/appkit'

export function Providers({ children }: { children: ReactNode }) {
  return <AppKitProvider {...appKitConfig}>{children}</AppKitProvider>
}
```

### Limitation / non-goal (as of `@cityofzion/appkit-neox-adapter@1.0.0`)

- Integration is via NeoX `Network` exports from `@cityofzion/appkit-neox-adapter` combined with wagmi.
- There is currently **no NeoX-specific AppKit adapter factory** to include in `adapters: [...]`.
- The NeoX package does **not** provide additional React providers or hooks beyond what AppKit + wagmi expose.

## Outputs

See **“Outputs (what the agent must produce)”** below for the authoritative list of required artifacts and behaviors.

## Acceptance checks (v0.1)

Scope: only what we can reasonably validate via **static inspection of generated code** plus a **TypeScript build** (`pnpm build` / `npm run build`). This skill does **not** assert runtime wallet behavior, signing, or RPC health.

0) **Provider contract + NeoX package reality (version-specific)**
   - For `@reown/appkit@1.8.19` (proved via `appkit-play`):
     - `AppKitProvider` is mounted as `<AppKitProvider {...appKitConfig}>`.
     - `appKitConfig` is a **createAppKit-shaped options/config object** (the same shape you would pass to `createAppKit`), and you **do not** pass an `appKit` instance prop.
   - For `@cityofzion/appkit-neox-adapter@1.0.0` (proved via `appkit-play`):
     - The package provides **NeoX network definitions** (e.g., `neoXMainnetNetwork`, `neoXTestnetNetwork`, etc.) compatible with AppKit’s `networks: [...]` configuration.
     - These NeoX network definitions can be **mixed with AppKit core networks** (e.g., `mainnet`) in the same `networks` array.
     - The package does **not** expose a NeoX AppKit adapter factory/blueprint to include in `adapters: [...]`.
     - The package does **not** provide additional React providers or hooks beyond what AppKit + wagmi provide.

1) **Dependencies**
   - All required AppKit + adapter packages for the requested environment/chain(s) are present in `dependencies` / `devDependencies`.
   - **No package downgrades** relative to the existing `package.json` (unless explicitly requested).

2) **Provider wiring**
   - For each supported environment, the expected entry files exist and import the correct provider wiring:
     - **React + Vite:** `src/main.tsx` wraps the app with `AppKitProvider` (and any chain-specific providers).
     - **Next.js Pages:** `pages/_app.tsx` is wired similarly.
     - **Next.js App Router:**
       - `app/providers.tsx` is a **`"use client"`** component that hosts providers.
       - `app/layout.tsx` wraps the tree with that providers component.

3) **Connect UI**
   - At least one React component exists that:
     - renders a “Connect” control when disconnected
     - renders a “Disconnect” control (or wallet state) when connected

4) **Build sanity**
   - `pnpm build` (preferred) or `npm run build` succeeds in a clean clone with the generated code.

## Conventions

- Package manager: **`pnpm`** (canonical for examples and validation).
  - All example commands and CI snippets are written in **pnpm-first** form.
  - `npm` variants are provided as secondary equivalents where helpful.
  - Constrained runtimes may hit a ~60s limit for `pnpm install` / `npm install`; treat any in-runtime install/build as **best-effort only**.
  - Canonical validation must run in local/CI:
    - `pnpm install && pnpm build`
    - or `npm ci && npm run build`.

### Proven provider wiring contract (AppKit 1.8.19)

- This skill’s examples follow the **proved AppKit 1.8.19 provider contract**: you pass the **createAppKit options/config props** into `AppKitProvider` via spread (`<AppKitProvider {...appKitConfig}>`), **not** an object returned by `createAppKit(...)`.

## Evidence notes (what is proved vs. what is a placeholder)

**Log-proved (via `appkit-play` + `pnpm build` in a real env)**

- Provider wiring contract for `@reown/appkit@1.8.19`:
  - The correct mounting pattern is:
    - `<AppKitProvider {...appKitConfig}>{children}</AppKitProvider>`
  - Passing `appKit`, `client`, or `config` props to `AppKitProvider` is treated as a regression unless re-proved.
- NeoX integration surface for `@cityofzion/appkit-neox-adapter@1.0.0`:
  - NeoX is integrated via **Network objects only**.
  - NeoX network imports in this skill are from:
    - `@cityofzion/appkit-neox-adapter`
  - There is **no** NeoX AppKit adapter factory to include in `adapters: [...]`.

**Not log-proved / placeholders (must be confirmed by build before being treated as canonical)**

- The *exact exported TypeScript type name* for the AppKit “createAppKit options/config object” **in other versions**.
  - In this workspace (`@reown/appkit@1.8.19`), typings prove the name is `CreateAppKit`.
  - If a future build shows a different exported type name, update the snippets + this note together, and capture new logs.
