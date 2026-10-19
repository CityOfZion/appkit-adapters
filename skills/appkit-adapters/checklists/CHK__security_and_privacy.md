---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.1
---

# Checklist: Security & Privacy

- [ ] Only use Reown `projectId` from a trusted source; do not commit secrets
- [ ] Validate and restrict any RPC URLs if you override defaults
- [ ] Ensure connection prompts are user-initiated (no silent wallet popups)
- [ ] Log redaction: never log full addresses + signatures together with identifiers in production telemetry
- [ ] Consider phishing resistance: show connected chain + wallet address clearly in UI
- [ ] For transaction signing flows: display human-readable details before signing
- [ ] Bitcoin: show amounts converted from satoshis and the recipient address before `sendTransfer` / `signPsbt`; only set `broadcast: true` on `signPsbt` when the user intends to send
- [ ] NeoX: keep anti-MEV networks on the package `sendTransaction` / `signTransaction` so transactions are not broadcast in plain text
