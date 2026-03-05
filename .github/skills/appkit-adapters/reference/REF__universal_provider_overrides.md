---
status: draft
owner: Trinity
last_updated: 2026-03-04
version: 0.1
---

# Reference: universalProviderConfigOverride

## Why it exists
WalletConnect (via AppKit) negotiates supported RPC methods in the session. AppKit’s defaults do not include Neo3/Stellar methods.

## Neo3
- constant: `Neo3Constants.OVERRIDES`
- required: yes

## Stellar
- constant: `StellarConstants.OVERRIDES`
- required: yes

## NeoX
Not used (EVM uses default `eip155` methods).
