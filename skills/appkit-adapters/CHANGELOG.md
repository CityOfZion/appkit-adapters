---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.3
---

# Changelog — appkit-adapters skill library

## 0.3 — 2026-10-19
- Added Bitcoin adapter docs (`@cityofzion/appkit-bitcoin-adapter`, native `bip122` namespace, WalletConnect only): new [`reference/ADAPTER__bitcoin.md`](./reference/ADAPTER__bitcoin.md), plus Bitcoin coverage in SKILL, overview, quickstarts, references, and guides.
- Corrected Neo X docs: `@cityofzion/appkit-neox-adapter` is a networks + helpers package used with `new WagmiAdapter({ projectId, networks })`, not an AppKit adapter; real export names documented.
- Replaced the invented override precedence model with the real pattern: AppKit takes one `universalProviderConfigOverride`, merged per namespace by the app.
- Reown/WalletConnect packages documented as required peer dependencies (not a local-source workaround); Vite snippets use `import.meta.env`.
- Examples now link the adapters through local `file:` dependencies; `examples/simple-app` covers Neo3 + Stellar + Bitcoin + Neo X. Verification requires `rush install && rush build-packages` first.
- Bitcoin override documented as recommended (not required); override `EVENTS` keep AppKit's default `accountsChanged` / `chainChanged`. Neo X install commands include `wagmi` + `@tanstack/react-query` (peers of `@reown/appkit-adapter-wagmi`).
- Removed stale/stub docs (task lists, agent tool design, auth/sessions, multi-chain selection, duplicate Neo X helpers guide, stale CI sample, agent tool review checklist); INDEX now links every remaining doc.

## Earlier (pre-0.3)
- Removed vendored `examples/simple-app/node_modules` from the workspace.
- Added `.gitignore` to `examples/simple-app/` to prevent re-vendoring deps.