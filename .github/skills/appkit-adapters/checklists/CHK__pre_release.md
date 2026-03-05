---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Checklist — Pre-release (Wallet Flow)

Use this before shipping a wallet connect flow to users.

## Functional
- [ ] Connect works on all supported browsers/devices.
- [ ] Disconnect works and clears local session state as expected.
- [ ] Switching accounts updates app state correctly.
- [ ] Switching networks updates app state correctly.

## Edge cases
- [ ] No wallet installed: user sees a helpful path forward.
- [ ] User cancels connect: app returns to safe state.
- [ ] User rejects signature/tx: error is surfaced and recoverable.
- [ ] RPC down / rate limited: error message indicates retry/backoff.

## UX quality
- [ ] Error messages are understandable (no raw stack traces).
- [ ] Loading states are present for connect/sign/tx.
- [ ] UI avoids "stuck" states after failures.

## Observability (minimum)
- [ ] Basic telemetry/logging exists for:
  - [ ] connect started / connect succeeded / connect failed
  - [ ] disconnect
  - [ ] signature requested / succeeded / failed
  - [ ] transaction requested / broadcasted / failed
- [ ] Logs/telemetry include non-sensitive context:
  - [ ] adapter name
  - [ ] chain/network
  - [ ] error category (see troubleshooting docs)

## Security / privacy
- [ ] No secrets committed (Project IDs okay; private keys never).
- [ ] No sensitive wallet/user data logged.
