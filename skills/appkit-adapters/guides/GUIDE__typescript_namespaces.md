---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Guide: TypeScript + chain namespaces (neo3, stellar)

## Problem
Reown AppKit’s `ChainNamespace` types may not include `neo3` or `stellar`.

Symptoms:
- TS errors when calling `appKit.open({ namespace: 'neo3' })`
- TS errors when calling `useAppKitProvider('stellar')`

## Practical workaround
Use `@ts-expect-error` in the few call sites that pass these namespaces.

```ts
// @ts-expect-error ChainNamespace does not include neo3
await appKit.open({ namespace: 'neo3' })
```

## Preferred long-term fix (optional)
If you control a shared types package, augment AppKit’s namespace type via module augmentation.

This is not documented upstream; treat as advanced and verify with your TS config.
