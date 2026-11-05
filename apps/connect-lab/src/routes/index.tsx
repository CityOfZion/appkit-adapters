import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { ChainHelper } from '@/helpers/chain'
import { useConnection } from '@/hooks/use-connection'
import { AnimatedAppLogo } from '@/components/app-logo'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { selectChain, selectedChain } = useConnection()
  const navigate = useNavigate()

  useEffect(() => {
    if (selectedChain) {
      void navigate({ to: '/connect' })

      return
    }
  }, [])

  return (
    <Fragment>
      <AnimatedAppLogo className="mt-24" />

      <h1 className="font-grotesk animate-in fade-in slide-in-from-bottom-20 mt-6 text-7xl font-bold -tracking-widest duration-500 max-sm:text-4xl">
        Connect<span className="text-primary font-black">Lab</span>
      </h1>

      <h2 className="animate-in fade-in slide-in-from-bottom-20 mt-4 max-w-md items-center gap-2 text-center text-2xl font-medium text-slate-400 duration-500 max-sm:text-base">
        The Premier Visual Sandbox for <span className="font-black text-white">WalletConnect</span> Testing & Debugging.
      </h2>

      <ul className="animate-in fade-in slide-in-from-bottom-20 mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-3 duration-500">
        {ChainHelper.supportedChains.map(chain => {
          const info = ChainHelper.chainInfos[chain]

          return (
            <li key={chain}>
              <button
                className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border border-white/5 px-5 py-3 shadow-lg transition-all duration-300 hover:scale-105 focus:scale-105"
                onClick={() => {
                  selectChain(chain)
                  void navigate({ to: '/connect' })
                }}
              >
                <div
                  className="absolute top-0 left-0 size-full opacity-0 transition-all duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: info.color }}
                />

                <info.icon className="relative size-6" />

                <span className="relative text-sm font-bold tracking-widest text-white uppercase">{info.name}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </Fragment>
  )
}
