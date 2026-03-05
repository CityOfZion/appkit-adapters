# Guide: React import paths and SSR-safe usage

Status: draft
Owner: Trinity
Last updated: 2026-03-04

## Purpose

Document the **supported React import paths** for AppKit adapters and the minimal rules for **SSR-safe usage** in React/Next.js apps.

## Supported import paths (React)

- ✅ Install: `@reown/appkit`
- ✅ Import React helpers from the subpath: `@reown/appkit/react`
- ❌ Do not install: `@reown/appkit/react` (it is not a published npm package)
- ❌ Do not import from `dist/`, `cjs/`, `esm`, or other build output folders
- ❌ Do not deep-import internal files

## SSR safety rules (minimal contract)

### Rule 1 — Create AppKit only in the browser

In SSR frameworks (Next.js), avoid creating AppKit on the server.

Pattern:
- create AppKit inside a client-only module/component
- or guard it with `typeof window !== 'undefined'`

### Rule 2 — No wallet calls during server render

- Do not access `window`, `localStorage`, injected providers, or wallet globals during server render.
- Do not attempt connect/sign/send inside render.

### Rule 3 — Prefer client components (Next.js)

If using Next.js App Router, keep wallet wiring in a client component:
- add `"use client"`
- render providers and connect UI only client-side

## Common failure modes

- Build error / import resolution error for `@reown/appkit/react`:
  - you likely tried to install `@reown/appkit/react` as a package, or your bundler is misconfigured.

## Relation to other docs

- This guide is the **source of truth** for React import DO/DON’T examples.
- `reference/PACKAGES.md` is the short “pitfall” reference.
