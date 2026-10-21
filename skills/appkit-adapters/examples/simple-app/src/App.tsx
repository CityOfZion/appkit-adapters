import { useState } from 'react'
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import type { BitcoinProvider } from '@cityofzion/appkit-bitcoin-adapter'
import type { Neo3Provider } from '@cityofzion/appkit-neo3-adapter'
import { isAntiMevNetwork, neoXTestnetNetwork, sendTransaction } from '@cityofzion/appkit-neox-adapter'
import type { StellarProvider } from '@cityofzion/appkit-stellar-adapter'
import type { Hex } from 'viem'
import { projectId, wagmiAdapter } from './appkit'

type TNamespace = 'neo3' | 'stellar' | 'bip122' | 'eip155'

export default function App() {
  const { open } = useAppKit()
  const account = useAppKitAccount()
  const neoXAccount = useAppKitAccount({ namespace: 'eip155' })

  // @ts-expect-error AppKit types do not yet include the neo3 namespace.
  const { walletProvider: neo3Provider } = useAppKitProvider<Neo3Provider>('neo3')
  // @ts-expect-error AppKit types do not yet include the stellar namespace.
  const { walletProvider: stellarProvider } = useAppKitProvider<StellarProvider>('stellar')
  const { walletProvider: bitcoinProvider } = useAppKitProvider<BitcoinProvider>('bip122')

  const [result, setResult] = useState('')
  const [error, setError] = useState('')

  async function run(action: () => Promise<unknown>) {
    setError('')
    setResult('')

    try {
      const response = await action()

      if (response !== undefined) setResult(JSON.stringify(response, null, 2))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    }
  }

  function connect(namespace: TNamespace) {
    // @ts-expect-error AppKit types do not yet include neo3 and stellar namespaces.
    return run(() => open({ namespace }))
  }

  function loadNeo3WalletInfo() {
    return run(async () => {
      if (!neo3Provider) throw new Error('Connect a Neo3 wallet first.')

      return await neo3Provider.getWalletInfo()
    })
  }

  function loadStellarNetworkInfo() {
    return run(async () => {
      if (!stellarProvider) throw new Error('Connect a Stellar wallet first.')

      return await stellarProvider.getNetwork()
    })
  }

  function loadBitcoinAccountAddresses() {
    return run(async () => {
      if (!bitcoinProvider) throw new Error('Connect a Bitcoin wallet first.')

      return await bitcoinProvider.getAccountAddresses()
    })
  }

  function sendNeoXTransaction() {
    return run(async () => {
      if (!neoXAccount.address) throw new Error('Connect a NeoX wallet first.')

      return await sendTransaction(wagmiAdapter.wagmiConfig, {
        to: neoXAccount.address as Hex,
        value: 0n,
      })
    })
  }

  return (
    <div className="shell">
      <h1>Simple AppKit Integration</h1>
      <p>This example wires Neo3, Stellar, Bitcoin and NeoX into a single minimal AppKit setup.</p>
      <p><strong>Project ID:</strong> {projectId ? 'configured' : 'missing'}</p>
      <p><strong>Status:</strong> {account.status}</p>
      <p><strong>Address:</strong> {account.address ?? 'not connected'}</p>

      <section className="card">
        <h2>Neo3</h2>
        <p>Uses the CityOfZion Neo3 adapter and Neo3 universal provider overrides.</p>
        <div className="actions">
          <button onClick={() => connect('neo3')} disabled={!projectId}>Connect Neo3 wallet</button>
          <button onClick={loadNeo3WalletInfo} disabled={!neo3Provider}>getWalletInfo()</button>
        </div>
      </section>

      <section className="card">
        <h2>Stellar</h2>
        <p>Uses the CityOfZion Stellar adapter and Stellar universal provider overrides.</p>
        <div className="actions">
          <button onClick={() => connect('stellar')} disabled={!projectId}>Connect Stellar wallet</button>
          <button onClick={loadStellarNetworkInfo} disabled={!stellarProvider}>getNetwork()</button>
        </div>
      </section>

      <section className="card">
        <h2>Bitcoin</h2>
        <p>Uses the CityOfZion Bitcoin adapter on the native bip122 namespace.</p>
        <div className="actions">
          <button onClick={() => connect('bip122')} disabled={!projectId}>Connect Bitcoin wallet</button>
          <button onClick={loadBitcoinAccountAddresses} disabled={!bitcoinProvider}>getAccountAddresses()</button>
        </div>
      </section>

      <section className="card">
        <h2>NeoX</h2>
        <p>
          Uses Reown's WagmiAdapter with the CityOfZion NeoX networks
          {isAntiMevNetwork(neoXTestnetNetwork) ? ' (anti-MEV RPC)' : ''}.
        </p>
        <div className="actions">
          <button onClick={() => connect('eip155')} disabled={!projectId}>Connect NeoX wallet</button>
          <button onClick={sendNeoXTransaction} disabled={!neoXAccount.address}>sendTransaction()</button>
        </div>
      </section>

      {result ? <pre>{result}</pre> : null}
      {error ? <pre className="error">{error}</pre> : null}
    </div>
  )
}