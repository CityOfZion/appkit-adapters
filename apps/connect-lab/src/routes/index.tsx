import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { ChainHelper } from '@/helpers/chain'
import { useConnection } from '@/hooks/use-connection'
import { AnimatedAppLogo } from '@/components/app-logo'
import { UtilsHelper } from '@/helpers/utils'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { connect, connectionInfo } = useConnection()
  const navigate = useNavigate()

  useEffect(() => {
    if (connectionInfo.status !== 'connected') return
    UtilsHelper.sleep(1500).then(() => {
      navigate({ to: '/connected' })
    })
  }, [connectionInfo.status])

  return (
    <Fragment>
      <AnimatedAppLogo className="mt-36" />

      <h1 className="font-grotesk animate-in fade-in slide-in-from-bottom-20 mt-6 text-7xl font-bold -tracking-widest duration-500 max-sm:text-4xl">
        Connect<span className="text-primary font-black">Lab</span>
      </h1>

      <h2 className="animate-in fade-in slide-in-from-bottom-20 mt-4 max-w-md items-center gap-2 text-center text-2xl font-medium text-slate-400 duration-500 max-sm:text-base">
        The Premier Visual Sandbox for <span className="font-black text-white">WalletConnect</span> Testing & Debugging.
      </h2>

      {connectionInfo.status !== 'not_connected' ? (
        <div className="animate-in fade-in slide-in-from-bottom-20 mt-12 flex flex-col items-center duration-500">
          <Spinner className="size-8 animate-spin text-blue-500" />

          {connectionInfo.status === 'connecting' ? (
            <div className="mt-4 flex flex-col items-center">
              <span className="font-grotesk text-lg font-bold text-white">Reconnecting</span>

              <span className="text-center text-sm font-medium text-slate-400">Checking previous sessions...</span>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-20 mt-4 flex flex-col items-center duration-500">
              <span className="text-primary font-grotesk text-lg font-bold">Connected</span>

              <span className="text-center text-sm font-medium text-slate-400">
                Redirecting to your connected dapp...
              </span>
            </div>
          )}
        </div>
      ) : (
        <ul className="animate-in fade-in slide-in-from-bottom-20 mx-auto mt-12 flex max-w-2xl flex-wrap justify-center gap-3 duration-500">
          {ChainHelper.supportedChains.map(chain => {
            const info = ChainHelper.chainInfos[chain]

            return (
              <li key={chain}>
                <button
                  className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border border-white/5 px-5 py-3 shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => connect(chain)}
                >
                  <div
                    className="absolute top-0 left-0 h-full w-full opacity-0 transition-all duration-300 group-hover:opacity-100"
                    style={{ backgroundColor: info.color }}
                  />

                  <info.icon className="relative size-6" />

                  <span className="font-brand relative text-sm font-bold tracking-widest text-white uppercase">
                    {info.name}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Fragment>
  )
}
