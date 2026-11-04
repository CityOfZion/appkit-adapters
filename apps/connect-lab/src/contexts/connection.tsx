import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { createContext, useEffect, useRef, useState } from 'react'
import { ChainController } from '@reown/appkit-controllers'
import { CaipNetworksUtil } from '@reown/appkit-utils'
import type { CaipNetwork } from '@reown/appkit/react'
import type { ChainNamespace } from '@reown/appkit/networks'
import type { TSupportedChain } from '@/helpers/chain'
import { ChainHelper } from '@/helpers/chain'
import { UtilsHelper } from '@/helpers/utils'
import { AppKitHelper } from '@/helpers/appkit'

type TConnectingConnectionInfo = {
  status: 'connecting'
}

type TConnectedConnectionInfo = {
  status: 'connected'
  loading: false
  address: string
  networkId: string
  chain: TSupportedChain
  namespace: ChainNamespace
  activeCaipNetwork: CaipNetwork
  walletInfo: {
    name?: string
    icon?: string
    description?: string
  }
}

type TNotConnectedConnectionInfo = {
  status: 'not_connected'
  loading: false
}

type TConnectionInfo = TConnectingConnectionInfo | TConnectedConnectionInfo | TNotConnectedConnectionInfo

type TConnectionProviderState = {
  connectionInfo: TConnectionInfo
  selectedChain: TSupportedChain | undefined
  /** Returns false when the page is reloading to boot AppKit with the new chain */
  selectChain: (chain: TSupportedChain) => boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

type ConnectionProviderProps = {
  children: React.ReactNode
}

export const ConnectionProviderContext = createContext<TConnectionProviderState | null>(null)

// AppKit hooks throw until createAppKit is called, so AppKit is only created (with the selected chain) on demand.
// The hooks live in a sibling component rendering `null`, so `children` keeps the same position in the tree and is
// not remounted when AppKit gets initialized.
export function ConnectionProvider({ children }: ConnectionProviderProps) {
  const [selectedChain, setSelectedChain] = useState(AppKitHelper.initializedChain)
  // AppKit booted with a stored chain, so it may be restoring a previous session
  const [isRestoringSession] = useState(!!AppKitHelper.initializedChain)

  const [connectionInfo, setConnectionInfo] = useState<TConnectionInfo>(
    selectedChain ? { status: 'connecting' } : { status: 'not_connected', loading: false }
  )

  const actionsRef = useRef<TAppKitActions | null>(null)

  function selectChain(chain: TSupportedChain) {
    const isReady = AppKitHelper.setup(chain)
    if (isReady) setSelectedChain(chain)
    return isReady
  }

  async function connect() {
    await actionsRef.current?.open()
  }

  async function disconnect() {
    await actionsRef.current?.disconnect()
  }

  return (
    <ConnectionProviderContext.Provider value={{ connectionInfo, selectedChain, selectChain, disconnect, connect }}>
      {selectedChain && (
        <AppKitConnectionSync
          chain={selectedChain}
          isRestoringSession={isRestoringSession}
          actionsRef={actionsRef}
          onChange={setConnectionInfo}
        />
      )}

      {children}
    </ConnectionProviderContext.Provider>
  )
}

type TAppKitActions = {
  open: () => Promise<void>
  disconnect: () => Promise<void>
}

type AppKitConnectionSyncProps = {
  chain: TSupportedChain
  isRestoringSession: boolean
  actionsRef: React.RefObject<TAppKitActions | null>
  onChange: (connectionInfo: TConnectionInfo) => void
}

function AppKitConnectionSync({ chain, isRestoringSession, actionsRef, onChange }: AppKitConnectionSyncProps) {
  const appKitAccountState = useAppKitAccount()
  const { disconnect: appKitDisconnect } = useDisconnect()
  const { open } = useAppKit()

  // Only wait on first render when a previous session may be restored
  const isFirstRender = useRef(isRestoringSession)

  async function disconnect() {
    await appKitDisconnect()
  }

  async function openModal() {
    await open({ namespace: ChainHelper.chainInfos[chain].namespace })
  }

  useEffect(() => {
    actionsRef.current = { open: openModal, disconnect }
  })

  useEffect(() => {
    let isCancelled = false

    async function handle() {
      if (appKitAccountState.status === 'connecting' || appKitAccountState.status === 'reconnecting') {
        onChange({
          status: 'connecting',
        })

        return
      }

      // This is a workaround to prevent a flash of the initial page
      if (isFirstRender.current) {
        isFirstRender.current = false

        await UtilsHelper.sleep(2000)
      }

      if (isCancelled) return

      if (!appKitAccountState.caipAddress) {
        onChange({
          status: 'not_connected',
          loading: false,
        })
        return
      }

      const [connectedNamespace, connectedNetworkId, connectedAddress] = appKitAccountState.caipAddress.split(':')
      const isConnectedToChain = ChainHelper.chainInfos[chain].networks.some(
        networkItem =>
          networkItem.id.toString() === connectedNetworkId &&
          CaipNetworksUtil.getChainNamespace(networkItem) === connectedNamespace
      )
      const connectedChain = isConnectedToChain ? chain : undefined

      const activeCaipNetwork = ChainController.state.activeCaipNetwork

      if (!connectedChain || !activeCaipNetwork) {
        disconnect()
        return
      }

      const walletInfo = ChainController.state.chains.get(connectedNamespace as ChainNamespace)?.accountState
        ?.connectedWalletInfo

      onChange({
        status: 'connected',
        address: connectedAddress,
        networkId: connectedNetworkId,
        chain: connectedChain,
        loading: false,
        activeCaipNetwork,
        namespace: connectedNamespace as ChainNamespace,
        walletInfo: {
          icon: walletInfo?.icon,
          name: walletInfo?.name,
          description: walletInfo?.description as string | undefined,
        },
      })
    }

    handle()

    return () => {
      isCancelled = true
    }
  }, [appKitAccountState.caipAddress, appKitAccountState.status])

  return null
}
