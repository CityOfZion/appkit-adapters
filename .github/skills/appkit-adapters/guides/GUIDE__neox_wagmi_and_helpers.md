# GUIDE: NeoX, WagmiAdapter, and Helper Transactions

## When to use this guide

Use this guide when:
- You are integrating **NeoX** via **Reown AppKit**.
- Your app uses or will use the **WagmiAdapter** for EVM-style interactions.
- You need to understand **when and how to use NeoX helper transaction methods** (e.g., for gas sponsorship or anti-MEV routing).

This guide assumes you have already:
- Read the SKILL contract: `AKB/SKILLS/appkit-adapters/SKILL.md`.
- Completed the relevant Quickstart for AppKit.

## Required inputs

Before following this guide, you should know:

- **Target environment**: e.g., React/Vite, Next.js.
- **NeoX network details**:
  - Which NeoX network (testnet / mainnet).
  - RPC endpoint(s) you will use.
- **Anti-MEV preference** for NeoX:
  - `true` if you want to enable anti-MEV transaction routing (where supported).
  - `false` otherwise (default).
- **Gas sponsorship strategy** (if any):
  - Are you using any gas sponsorship / paymaster-like flow?
  - Who/what pays gas under which conditions?

## Base setup: WagmiAdapter with NeoX

At a high level, NeoX is EVM-like and uses the **WagmiAdapter**. Your base setup will look structurally like:

```ts
// NOTE: illustrative only; see “Canonical happy path” below for the proved contract.
import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { neoXConfig } from './config/neox' // your app-level NeoX chain config

const wagmiAdapter = new WagmiAdapter({
  // wagmi-style config is app-specific; ensure this matches your wagmi setup.
  // Some projects use `chains` + `transports`; others use AppKit `networks`.
  chains: [neoXConfig.chain],
  transports: neoXConfig.transports
})

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId: process.env.APPKIT_PROJECT_ID!,
  // ...other AppKit options
})
```

> NOTE: The exact import paths must match the versions you install. Treat this snippet as illustrative; use the proved harness contract below as the reference for `@reown/appkit@1.8.19`.

## When you need NeoX helper transaction methods

You should reach for **NeoX helper transaction methods** when:

1. **Gas sponsorship / sponsored transactions**
   - A third party (protocol, dApp, relayer) covers gas for a user under certain conditions.
   - You need to construct or submit transactions that follow NeoX’s sponsorship rules.

2. **Anti-MEV routing**
   - You want to route transactions in a way that reduces exposure to MEV on NeoX where support exists.
   - You’ve set `NeoX anti-MEV preference = true` in the SKILL inputs.

3. **Chain-specific quirks**
   - There are NeoX-specific expectations (e.g., certain fields or metadata) that aren’t captured by a generic EVM transaction builder.

If none of the above apply (early prototypes, local-only experiments, etc.), you can typically start with **plain WagmiAdapter usage** and add helpers once your requirements solidify.

## Canonical happy path (blessed): React + Vite + NeoX — connect + send transaction

This section is the **blessed** minimal end-to-end pattern for NeoX using **only real, currently-supported API surfaces** from this repo’s reference docs.

Scenario:
- React + Vite
- AppKit initialized with a Wagmi adapter targeting NeoX networks
- A minimal connect UI
- A minimal “send transaction” button (via wagmi)

> Mapping to SKILL.md Outputs:
> - Provider wiring: SKILL.md “Outputs (what the agent must produce)” → **(2) App entry / provider wiring**
> - Minimal connect UI: SKILL.md “Outputs (what the agent must produce)” → **(3) Minimal connect UI**

### 1) AppKit init (NeoX + WagmiAdapter)

```ts
// Acceptance 1: Dependencies (imports reflect required packages)
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { neoXMainnetNetwork, neoXTestnetNetwork } from '@cityofzion/appkit-neox-adapter/networks'

// Proved in appkit-play with:
//   @reown/appkit@1.8.19
//   @cityofzion/appkit-neox-adapter@1.0.0
// Contract: NeoX package supplies networks; adapters remain wagmi-only.
const neoxNetworks: AppKitNetwork[] = [neoXMainnetNetwork, neoXTestnetNetwork]

export const wagmiAdapter = new WagmiAdapter({
  networks: neoxNetworks
})

// IMPORTANT: For @reown/appkit@1.8.19 React provider wiring,
// we do NOT need to call createAppKit() just to mount AppKitProvider.
// Instead, export the config object to spread into <AppKitProvider {...config} />.
export const appKitConfig = {
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
  adapters: [wagmiAdapter],
  networks: neoxNetworks
}
```

Notes:
- Import paths above are taken from `reference/PACKAGES.md` and `reference/ADAPTER__neox.md`.
- If `neoxMainnet` / `neoxTestnet` exports differ upstream, update this block to match the adapter package exports (run–break–fix).
- // Acceptance 4: build sanity (ensure `pnpm build` succeeds with these imports and wiring in a clean clone)

### 2) Provider wiring (React)

```tsx
// Acceptance 2: provider wiring
import { AppKitProvider } from '@reown/appkit/react'
import { appKitConfig } from './lib/appkit'

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppKitProvider {...appKitConfig}>{children}</AppKitProvider>
}
```

### 3) Minimal connect UI

```tsx
// Acceptance 3: connect UI
import { useAppKit } from '@reown/appkit/react'

export function WalletConnectButton() {
  const { open, close } = useAppKit()

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <button onClick={() => open()}>Connect</button>
      <button onClick={() => close()}>Disconnect</button>
    </div>
  )
}
```

### 4) Simple transaction (wagmi)

```tsx
import { useSendTransaction } from 'wagmi'

export function SendTxButton() {
  const { sendTransaction, isPending } = useSendTransaction()

  // Replace with a known-safe address for your test environment.
  const to = '0x0000000000000000000000000000000000000000'

  return (
    <button
      disabled={isPending}
      onClick={() =>
        sendTransaction({
          to,
          // minimal value send; adjust as needed
          value: 0n
        })
      }
    >
      Send transaction
    </button>
  )
}
```

---

## Pattern: base Wagmi vs Wagmi + helpers

### Base Wagmi-style interaction (simplified)

```ts
// PSEUDOCODE: helper API surface not finalized
import { useWriteContract } from 'wagmi';
import { myContractConfig } from './contracts/myContract';

function DoSomethingButton() {
  const { writeContract, isPending } = useWriteContract();

  const onClick = () => {
    writeContract({
      address: myContractConfig.address,
      abi: myContractConfig.abi,
      functionName: 'doSomething',
      args: ['example'],
    });
  };

  return (
    <button onClick={onClick} disabled={isPending}>
      Do something on NeoX
    </button>
  );
}
```

### With NeoX helper methods (conceptual)

```ts
// PSEUDOCODE: helper API surface not finalized
import { useNeoXHelpers } from './neox/helpers'; // your abstraction around official helpers
import { myContractConfig } from './contracts/myContract';

function DoSomethingSponsoredButton() {
  const { sendSponsoredTx, isPending } = useNeoXHelpers();

  const onClick = async () => {
    await sendSponsoredTx({
      contract: myContractConfig,
      functionName: 'doSomething',
      args: ['example'],
      // Any sponsorship / anti-MEV options you support
    });
  };

  return (
    <button onClick={onClick} disabled={isPending}>
      Do sponsored action on NeoX
    </button>
  );
}
```

The exact shape of `useNeoXHelpers` and the underlying helper methods will be defined in the NeoX-specific libraries you use. This guide’s goal is to:

- Make it clear **when** you need such helpers.
- Encourage you to wrap them behind a small, well-typed abstraction instead of scattering helper calls across the app.

## Configuration hooks

When wiring NeoX + helpers via this SKILL, make sure you:

- Capture **anti-MEV preference** as a first-class configuration field.
- Decide whether your app **supports sponsorship** at all, and if so, under what conditions.
- Keep the following config items in a single place (e.g., `config/neox.ts`):
  - Network (testnet/mainnet) and chain ID.
  - RPC URLs and fallbacks.
  - Sponsorship/relayer endpoints.
  - Anti-MEV toggles and related endpoints/routes.

## Gotchas and troubleshooting

Common pitfalls when working with NeoX + WagmiAdapter + helpers:

1. **Mismatched chain configuration**
   - Symptom: transactions fail or are rejected immediately.
   - Check: chain ID, RPC URL, and NeoX configuration match the network you intend.

2. **Helpers called without required config**
   - Symptom: helper functions throw or return errors about missing endpoints/keys.
   - Check: sponsorship/relayer URLs and keys are set before calling helpers.

3. **Anti-MEV enabled without supporting infra**
   - Symptom: timeouts or failures on submission.
   - Check: you actually have an anti-MEV-capable route; if not, disable the flag.

4. **Leaking helpers across chains**
   - Symptom: code that assumes NeoX helpers exist for non-NeoX chains.
   - Check: keep NeoX helpers clearly scoped to NeoX-specific modules and contexts.

## Next steps

- If you’re wiring NeoX for the first time:
  - Start with **base WagmiAdapter** integration and a simple test transaction.
  - Add **helper methods** once you have clear sponsorship / anti-MEV requirements.
- When in doubt:
  - Re-check the SKILL contract at `AKB/SKILLS/appkit-adapters/SKILL.md`.
  - Align imports and configuration with `reference/PACKAGES.md` and any official NeoX docs.

## Pseudocode-only APIs (v0.1)

Some helper names in this guide are placeholders until the NeoX helpers surface is finalized. All pseudocode snippets are explicitly marked in comments.

- `useNeoXHelpers`
- `createNeoXHelpers`
- `sendSponsoredTx`
- any config fields marked with `// TODO: confirm` or `// PSEUDOCODE`

Convention:

- Code blocks that are **not** safe to copy-paste into production MUST include a line comment such as:

  ```ts
  // PSEUDOCODE: helper API surface not finalized
  ```

- Once the real helper APIs are published, these placeholders SHOULD be replaced with the concrete function and type names.

## Related artifacts

- Contract for environments, outputs, and acceptance checks:
  - `AKB/SKILLS/appkit-adapters/SKILL.md`
- Scratch validation app (non-SoT):
  - `appkit-play/README.md`
