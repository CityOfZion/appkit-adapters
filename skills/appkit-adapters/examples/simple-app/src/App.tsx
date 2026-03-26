import { useState } from 'react'
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import type { Neo3Provider } from '@cityofzion/appkit-neo3-adapter'
import type { StellarProvider } from '@cityofzion/appkit-stellar-adapter'

export default function App() {
  const projectId = import.meta.env.VITE_REOWN_PROJECT_ID
  const { open } = useAppKit()
  const account = useAppKitAccount()

  // @ts-expect-error AppKit types do not yet include the neo3 namespace.
  const { walletProvider: neo3Provider } = useAppKitProvider<Neo3Provider>('neo3')
  // @ts-expect-error AppKit types do not yet include the stellar namespace.
  const { walletProvider: stellarProvider } = useAppKitProvider<StellarProvider>('stellar')
  const [neo3WalletInfo, setNeo3WalletInfo] = useState('')
  const [stellarNetworkInfo, setStellarNetworkInfo] = useState('')
  const [error, setError] = useState('')

  async function connect(namespace: 'neo3' | 'stellar') {
    setError('')
    setNeo3WalletInfo('')
    setStellarNetworkInfo('')

    try {
      // @ts-expect-error AppKit types do not yet include neo3 and stellar namespaces.
      await open({ namespace })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    }
  }

  async function loadNeo3WalletInfo() {
    if (!neo3Provider) {
      setError('Connect a Neo3 wallet first.')
      return
    }

    setError('')

    try {
      const result = await neo3Provider.getWalletInfo()
      setNeo3WalletInfo(JSON.stringify(result, null, 2))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    }
  }

  async function loadStellarNetworkInfo() {
    if (!stellarProvider) {
      setError('Connect a Stellar wallet first.')
      return
    }

    setError('')

    try {
      const result = await stellarProvider.getNetwork()
      setStellarNetworkInfo(JSON.stringify(result, null, 2))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    }
  }

  return (
    <div className="shell">
      <h1>Simple AppKit Integration</h1>
      <p>This example wires Neo3 and Stellar into a single minimal AppKit setup.</p>
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
        {neo3WalletInfo ? <pre>{neo3WalletInfo}</pre> : null}
      </section>

      <section className="card">
        <h2>Stellar</h2>
        <p>Uses the CityOfZion Stellar adapter and Stellar universal provider overrides.</p>
        <div className="actions">
          <button onClick={() => connect('stellar')} disabled={!projectId}>Connect Stellar wallet</button>
          <button onClick={loadStellarNetworkInfo} disabled={!stellarProvider}>getNetwork()</button>
        </div>
        {stellarNetworkInfo ? <pre>{stellarNetworkInfo}</pre> : null}
      </section>

      {error ? <pre className="error">{error}</pre> : null}
    </div>
  )
}
