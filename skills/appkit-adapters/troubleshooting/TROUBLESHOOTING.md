---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Troubleshooting

## Neo3/Stellar: connect works, but calls fail
Likely missing `universalProviderConfigOverride`.

Fix:
- Neo3: add `universalProviderConfigOverride: Neo3Constants.OVERRIDES`
- Stellar: add `universalProviderConfigOverride: StellarConstants.OVERRIDES`

## TypeScript errors about namespace
AppKit types may not include `neo3` / `stellar`.

Fix:
- Use `@ts-expect-error` at the call site(s)
- Or implement module augmentation (advanced)

## NeoX anti-MEV transactions not protected
If you use anti-MEV networks but call standard wagmi `sendTransaction`, protection may be bypassed.

Fix:
- Use `sendTransaction` helper from `@cityofzion/appkit-neox-adapter`.
