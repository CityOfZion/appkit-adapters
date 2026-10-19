---
status: draft
owner: Trinity
last_updated: 2026-10-19
version: 0.1
---

# Troubleshooting

## Neo3/Stellar: connect works, but calls fail
Likely missing `universalProviderConfigOverride` (or only one adapter's overrides passed in a multi-chain app).

Fix:
- Neo3: add `universalProviderConfigOverride: Neo3Constants.OVERRIDES`
- Stellar: add `universalProviderConfigOverride: StellarConstants.OVERRIDES`
- Bitcoin (recommended, not the cause of failing calls): `universalProviderConfigOverride: BitcoinConstants.OVERRIDES` adds the `bip122_addressesChanged` event
- Multiple chains: merge the `methods` / `chains` / `events` / `rpcMap` of every override into one object

## TypeScript errors about namespace
AppKit types do not include `neo3` / `stellar` (`bip122` and `eip155` are native and need nothing).

Fix:
- Use `@ts-expect-error` at the call site(s)
- Or implement module augmentation (advanced)

## Bitcoin: wrong adapter answers, or duplicated wallets/namespace errors
`@reown/appkit-adapter-bitcoin` is registered together with `BitcoinAdapter`; both claim `bip122`.

Fix:
- Keep only `new BitcoinAdapter()` from `@cityofzion/appkit-bitcoin-adapter` (WalletConnect-only, NEON Wallet compatible) and uninstall the Reown one.

## Bitcoin: wallet rejects `getAccountAddresses` (missing `account`)
The WalletConnect Bitcoin RPC requires an `account` param. Raw `universalProvider.request(...)` calls must send it.

Fix:
- Call through `useAppKitProvider<BitcoinProvider>('bip122').walletProvider`; it fills `account` with the connected address on every method.

## NeoX anti-MEV transactions not protected
If you use anti-MEV networks but call standard wagmi `sendTransaction` (or `useSendTransaction`), protection is bypassed.

Fix:
- Use `sendTransaction` / `signTransaction` from `@cityofzion/appkit-neox-adapter` with `wagmiAdapter.wagmiConfig`.
