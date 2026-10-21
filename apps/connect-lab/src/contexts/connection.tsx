import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { createContext, useEffect, useRef, useState } from 'react'
import { ChainController } from '@reown/appkit-controllers'
import { CaipNetworksUtil } from '@reown/appkit-utils'
import type { CaipNetwork } from '@reown/appkit/react'
import type { ChainNamespace } from '@reown/appkit/networks'
import type { TSupportedChain } from '@/helpers/chain'
import { ChainHelper } from '@/helpers/chain'
import { UtilsHelper } from '@/helpers/utils'

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
  connect: (chain: TSupportedChain) => Promise<void>
  disconnect: () => Promise<void>
}

type ConnectionProviderProps = {
  children: React.ReactNode
}

export const ConnectionProviderContext = createContext<TConnectionProviderState | null>(null)

export function ConnectionProvider({ children }: ConnectionProviderProps) {
  const appKitAccountState = useAppKitAccount()
  const { disconnect: appKitDisconnect } = useDisconnect()
  const { open } = useAppKit()

  const isFirstRender = useRef(true)

  const [connectionInfo, setConnectionInfo] = useState<TConnectionInfo>({
    status: 'connecting',
  })

  async function disconnect() {
    await appKitDisconnect()
  }

  async function connect(chain: TSupportedChain) {
    const namespace = ChainHelper.chainInfos[chain].namespace
    await open({ namespace })
  }

  useEffect(() => {
    let isCancelled = false

    async function handle() {
      if (appKitAccountState.status === 'connecting' || appKitAccountState.status === 'reconnecting') {
        setConnectionInfo({
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
        setConnectionInfo({
          status: 'not_connected',
          loading: false,
        })
        return
      }

      const [connectedNamespace, connectedNetworkId, connectedAddress] = appKitAccountState.caipAddress.split(':')
      let connectedChain: TSupportedChain | undefined

      for (const chain of ChainHelper.supportedChains) {
        const networks = ChainHelper.chainInfos[chain].networks

        const network = networks.find(
          networkItem =>
            networkItem.id.toString() === connectedNetworkId &&
            CaipNetworksUtil.getChainNamespace(networkItem) === connectedNamespace
        )
        if (!network) continue

        connectedChain = chain
        break
      }

      const activeCaipNetwork = ChainController.state.activeCaipNetwork

      if (!connectedChain || !activeCaipNetwork) {
        disconnect()
        return
      }

      const walletInfo = ChainController.state.chains.get(connectedNamespace as ChainNamespace)?.accountState
        ?.connectedWalletInfo

      setConnectionInfo({
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

  return (
    <ConnectionProviderContext.Provider value={{ connectionInfo, disconnect, connect }}>
      {children}
    </ConnectionProviderContext.Provider>
  )
}
