import { Link, Navigate, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeftRight, Link2 } from 'lucide-react'
import { useEffect, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ChainHelper } from '@/helpers/chain'
import { useConnection } from '@/hooks/use-connection'

export const Route = createFileRoute('/connect')({
  component: RouteComponent,
})

function RouteComponent() {
  const { connect, connectionInfo, selectedChain } = useConnection()
  const navigate = useNavigate()
  const [isOpening, startOpening] = useTransition()

  useEffect(() => {
    if (connectionInfo.status !== 'connected') return

    const timeoutId = setTimeout(() => {
      navigate({ to: '/connected' })
    }, 1500)

    return () => clearTimeout(timeoutId)
  }, [connectionInfo.status])

  if (!selectedChain) {
    return <Navigate to="/" />
  }

  const chainInfo = ChainHelper.chainInfos[selectedChain]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-20 mt-24 flex flex-col items-center duration-500">
      <div
        className="flex size-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 max-sm:size-20"
        style={{ boxShadow: `0 0 80px -10px ${chainInfo.color}` }}
      >
        <chainInfo.icon className="size-14 max-sm:size-10" />
      </div>

      <span className="mt-8 text-sm font-bold tracking-widest text-slate-500 uppercase">Selected blockchain</span>

      <h1 className="font-grotesk mt-2 text-6xl font-bold -tracking-widest max-sm:text-4xl">{chainInfo.name}</h1>

      <ul className="mt-4 flex max-w-md flex-wrap justify-center gap-2">
        {chainInfo.networks.map(network => (
          <li
            key={network.id}
            className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-400"
          >
            {network.name}
          </li>
        ))}
      </ul>

      {connectionInfo.status === 'not_connected' ? (
        <div className="mt-12 flex gap-3 max-sm:w-full max-sm:flex-col">
          <Button size="lg" disabled={isOpening} onClick={() => startOpening(connect)}>
            {isOpening ? <Spinner className="animate-spin" /> : <Link2 aria-hidden />}
            Connect
          </Button>

          <Button size="lg" variant="secondary" asChild>
            <Link to="/">
              <ArrowLeftRight aria-hidden />
              Change network
            </Link>
          </Button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-20 mt-12 flex flex-col items-center duration-500">
          <Spinner className="size-8 animate-spin text-blue-500" />

          {connectionInfo.status === 'connecting' ? (
            <span className="font-grotesk mt-4 text-lg font-bold text-white">Connecting</span>
          ) : (
            <div className="mt-4 flex flex-col items-center">
              <span className="text-primary font-grotesk text-lg font-bold">Connected</span>

              <span className="text-center text-sm font-medium text-slate-400">
                Redirecting to your connected dapp…
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
