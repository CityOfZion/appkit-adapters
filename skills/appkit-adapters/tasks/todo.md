# appkit-adapters — TODO

## Plan (converge to clean, non-numbered, no-vendored-deps layout)

- [ ] Align directory structure to target end-state (overview/quickstarts/guides/reference/checklists/troubleshooting/examples/tests)
- [ ] Prune quickstarts to the intended minimal set (create + vite-react base + vite-react-neo3)
- [x] Ensure examples do not vendor dependencies:
  - [x] Remove `examples/vite-react-neo3/node_modules/` (moved to `_trash/` in this workspace)
  - [ ] Ensure example `.gitignore` excludes `node_modules`, build output, env files
- [x] Update `INDEX.md` to match the intended end-state (only list intended docs; do not point to deprecated dirs)
- [ ] Decide on deprecation retention policy:
  - [ ] Keep `_deprecated__*/` as history (short-lived), or
  - [ ] Delete after verification

## Notes
- Current tree contains extra quickstarts: `QS__vite-react-neox.md`, `QS__vite-react-stellar.md`, `QS__nextjs-neo3.md`.
- Current examples include vendored `node_modules` (~2.3MB) under `examples/vite-react-neo3/`.
