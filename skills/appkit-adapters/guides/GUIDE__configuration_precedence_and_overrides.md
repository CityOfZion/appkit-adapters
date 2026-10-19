# Guide: Universal provider overrides with one or more adapters

Status: draft
Owner: Trinity
Last updated: 2026-10-19

## Purpose

Explain how `universalProviderConfigOverride` actually works with the CityOfZion adapters and how to combine several of them.

## How it works

- `createAppKit` (or `AppKitProvider`) accepts **one** `universalProviderConfigOverride` object.
- Its shape is `{ methods?, chains?, events?, rpcMap? }`, each keyed by namespace (`neo3`, `stellar`, `bip122`, ...).
- AppKit does not merge anything for you. There is no layered "defaults / chain / runtime" precedence: whatever object you pass is what the universal provider uses to extend the WalletConnect session request.

Per adapter:
- Neo3: REQUIRED — `Neo3Constants.OVERRIDES`
- Stellar: REQUIRED — `StellarConstants.OVERRIDES`
- Bitcoin: recommended — `BitcoinConstants.OVERRIDES` (AppKit requests the methods already; this adds the `bip122_addressesChanged` event)
- Neo X: not used (EVM defaults)

## Single adapter

Pass the constant directly:

```ts
universalProviderConfigOverride: Neo3Constants.OVERRIDES
```

## Several adapters: merge per namespace

Passing just one constant silently drops the other adapters' methods, so wallet calls on those chains fail. Merge them into one object, concatenating the per-namespace arrays:

```ts
universalProviderConfigOverride: mergeUniversalProviderConfigOverride(
  Neo3Constants.OVERRIDES,
  StellarConstants.OVERRIDES,
  BitcoinConstants.OVERRIDES
)
```

The full `mergeUniversalProviderConfigOverride` implementation is in [REF__universal_provider_overrides.md](../reference/REF__universal_provider_overrides.md); it mirrors `apps/connect-lab/src/helpers/appkit.ts` and `examples/simple-app/src/appkit.ts`.

If you add app-specific methods or events, add them as one more argument to the same merge call.

## Misconfiguration policy (fail-fast vs fallback)

Fail fast (throw / hard error) when:
- required overrides are missing for Neo3/Stellar
- required env (e.g. `VITE_REOWN_PROJECT_ID`) is missing

Fallback acceptable when:
- cosmetic metadata is missing (labels, icons)

## Relation to other docs

- [REF__universal_provider_overrides.md](../reference/REF__universal_provider_overrides.md) lists what each constant contains and the merge helper.
- [SKILL.md](../SKILL.md) documents the per-chain override constants at a glance.
