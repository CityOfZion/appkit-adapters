---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Guide: TypeScript + chain namespaces (neo3, stellar, bip122)

## Problem
Reown AppKit's `ChainNamespace` type does not include `neo3` or `stellar`.

Symptoms:
- TS errors when calling `appKit.open({ namespace: 'neo3' })`
- TS errors when calling `useAppKitProvider('stellar')`

`bip122` (Bitcoin) and `eip155` (Neo X) **are** native AppKit namespaces: `useAppKitProvider<BitcoinProvider>('bip122')` and `open({ namespace: 'bip122' })` type-check without any workaround. Do not add `@ts-expect-error` there; it would itself fail with "unused directive".

## Practical workaround
Use `@ts-expect-error` in the few call sites that pass `neo3` or `stellar`.

```ts
// @ts-expect-error ChainNamespace does not include neo3
await appKit.open({ namespace: 'neo3' })
```

## Preferred long-term fix (optional)
If you control a shared types package, augment AppKit's namespace type via module augmentation.

This is not documented upstream; treat as advanced and verify with your TS config.
