import { useState } from 'react'

export default function App(){
  const [connected, setConnected] = useState(false)

  return (
    <div style={{fontFamily:'system-ui, sans-serif',padding:20}}>
      <h1>Simple AppKit Integration</h1>
      <p>Connected: {connected ? 'yes' : 'no'}</p>
      <button onClick={() => setConnected(!connected)}>{connected ? 'Disconnect' : 'Connect'}</button>
    </div>
  )
}
