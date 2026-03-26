import { useMemo, useState } from 'react'
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import type { Neo3Provider } from '@cityofzion/appkit-neo3-adapter'
import './App.css'

const gasTokenHash = '0xd2a4cff31913016155e38e474a2c06d08be276cf'

function App() {
  const projectId = import.meta.env.VITE_REOWN_PROJECT_ID
  const { open } = useAppKit()
  const account = useAppKitAccount()
  // @ts-expect-error AppKit types do not yet include the neo3 namespace.
  const { walletProvider } = useAppKitProvider<Neo3Provider>('neo3')

  const [walletInfoResult, setWalletInfoResult] = useState<string>('')
  const [testInvokeResult, setTestInvokeResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loadingAction, setLoadingAction] = useState<string>('')

  const connectionSummary = useMemo(() => {
    if (!account.caipAddress) return 'Not connected'
    return `${account.caipAddress}${account.address ? ` (${account.address})` : ''}`
  }, [account.address, account.caipAddress])

  async function connectNeo3() {
    setError('')
    // @ts-expect-error AppKit types do not yet include the neo3 namespace.
    await open({ namespace: 'neo3' })
  }

  async function readWalletInfo() {
    if (!walletProvider) {
      setError('Neo3 wallet provider is not available. Connect a wallet first.')
      return
    }

    setError('')
    setLoadingAction('wallet-info')

    try {
      const result = await walletProvider.getWalletInfo()
      setWalletInfoResult(JSON.stringify(result, null, 2))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setLoadingAction('')
    }
  }

  async function runTestInvoke() {
    if (!walletProvider || !account.address) {
      setError('Connect a Neo3 wallet before calling testInvoke.')
      return
    }

    setError('')
    setLoadingAction('test-invoke')

    try {
      const result = await walletProvider.testInvoke({
        invocations: [
          {
            scriptHash: gasTokenHash,
            operation: 'balanceOf',
            args: [
              {
                type: 'Hash160',
                value: account.address,
              },
            ],
          },
        ],
        signers: [{ scopes: 1 }],
      })

      setTestInvokeResult(JSON.stringify(result, null, 2))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setLoadingAction('')
    }
  }

  return (
    <main className="app-shell">
      <section className="hero card">
        <p className="eyebrow">CityOfZion AppKit Adapters</p>
        <h1>Neo3 adapter example</h1>
        <p className="lede">
          This example actually initializes Reown AppKit with <code>Neo3Adapter</code>, opens the
          Neo3 wallet modal, and calls real provider methods from the connected wallet session.
        </p>
      </section>

      <section className="card stack">
        <h2>1. Configure AppKit</h2>
        <p>
          Set <code>VITE_REOWN_PROJECT_ID</code> in a local <code>.env</code> file before running the
          app.
        </p>
        <pre>{projectId ? 'VITE_REOWN_PROJECT_ID is configured.' : 'Missing VITE_REOWN_PROJECT_ID'}</pre>
      </section>

      <section className="card stack">
        <h2>2. Connect a Neo3 wallet</h2>
        <p>Status: {account.status}</p>
        <p>Connection: {connectionSummary}</p>
        <div className="actions">
          <button type="button" onClick={connectNeo3} disabled={!projectId}>
            Open Neo3 wallet modal
          </button>
        </div>
      </section>

      <section className="card stack">
        <h2>3. Use the adapter-backed provider</h2>
        <p>
          These buttons call methods exposed by the Neo3 provider returned from{' '}
          <code>useAppKitProvider('neo3')</code>.
        </p>
        <div className="actions">
          <button
            type="button"
            onClick={readWalletInfo}
            disabled={!walletProvider || loadingAction !== ''}
          >
            {loadingAction === 'wallet-info' ? 'Loading wallet info...' : 'getWalletInfo()'}
          </button>
          <button
            type="button"
            onClick={runTestInvoke}
            disabled={!walletProvider || !account.address || loadingAction !== ''}
          >
            {loadingAction === 'test-invoke' ? 'Running testInvoke...' : 'testInvoke(balanceOf)'}
          </button>
        </div>

        {error ? (
          <div className="result error">
            <h3>Error</h3>
            <pre>{error}</pre>
          </div>
        ) : null}

        {walletInfoResult ? (
          <div className="result">
            <h3>Wallet info</h3>
            <pre>{walletInfoResult}</pre>
          </div>
        ) : null}

        {testInvokeResult ? (
          <div className="result">
            <h3>testInvoke result</h3>
            <pre>{testInvokeResult}</pre>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default App
