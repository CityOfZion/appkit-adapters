---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Checklist: Security & Privacy

- [ ] Only use Reown `projectId` from a trusted source; do not commit secrets
- [ ] Validate and restrict any RPC URLs if you override defaults
- [ ] Ensure connection prompts are user-initiated (no silent wallet popups)
- [ ] Log redaction: never log full addresses + signatures together with identifiers in production telemetry
- [ ] Consider phishing resistance: show connected chain + wallet address clearly in UI
- [ ] For transaction signing flows: display human-readable details before signing
