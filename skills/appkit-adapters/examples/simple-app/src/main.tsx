import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setupAppKit } from './appkit'
import './index.css'
import App from './App'

setupAppKit()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
