import { Link, Navigate, createFileRoute } from '@tanstack/react-router'
import { Command, Send, Unlink } from 'lucide-react'
import { Fragment, useTransition } from 'react'
import { RequestModal } from './-request-modal'
import { InfoBox } from './-info-box'
import { CustomRequest } from './-custom-request'
import type { TSupportedChain } from '@/helpers/chain'
import type { ComponentType } from 'react'
import { InteractiveBackground } from '@/components/interactive-background'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ChainHelper } from '@/helpers/chain'
import { useConnection } from '@/hooks/use-connection'
import { EIP155Methods } from '@/components/methods/eip155-methods'
import { SolanaMethods } from '@/components/methods/solana-methods'
import { Neo3Methods } from '@/components/methods/neo3-methods'
import { StellarMethods } from '@/components/methods/stellar-methods'

import { NeoxMethods } from '@/components/methods/neox-methods'
import { Tabs } from '@/components/ui/tabs'
import { Tooltip } from '@/components/ui/tooltip'
import { CopyButton } from '@/components/copy-button'

export const Route = createFileRoute('/connected')({
  component: RouteComponent,
})

// It should be here because of fast refresh, otherwise it will cause an error when saving any methods component file
const methodsComponentByChain: Record<TSupportedChain, ComponentType> = {
  neo3: Neo3Methods,
  ethereum: EIP155Methods,
  arbitrum: EIP155Methods,
  base: EIP155Methods,
  // TODO: Fix that
  neox: NeoxMethods,
  polygon: EIP155Methods,
  solana: SolanaMethods,
  stellar: StellarMethods,
}

function RouteComponent() {
  const { connectionInfo, disconnect } = useConnection()

  const [isDisconnecting, startDisconnect] = useTransition()

  if (connectionInfo.status !== 'connected') {
    return <Navigate to="/" />
  }

  const MethodComponent = methodsComponentByChain[connectionInfo.chain]
  const ChainIcon = ChainHelper.iconsByChain[connectionInfo.chain]
  const chainColor = ChainHelper.colorsByChain[connectionInfo.chain]

  const addressExplorerUrl = ChainHelper.addressExplorerUrlsByChain[connectionInfo.chain][connectionInfo.networkId] as
    | string
    | undefined
  const replacedAddressExplorerUrl = addressExplorerUrl?.replace('{address}', connectionInfo.address)

  return (
    <div className="relative flex justify-center">
      <InteractiveBackground />

      <RequestModal />

      <div className="flex min-h-screen w-full max-w-7xl flex-col gap-12 px-4 py-10">
        <header className="flex flex-col gap-4">
          <div className="flex w-full min-w-0 gap-2 max-md:grid max-md:grid-cols-6 max-md:grid-rows-3">
            <InfoBox className="items-center justify-center">
              <ChainIcon className="size-4 min-h-4 min-w-4" style={{ color: chainColor }} />
            </InfoBox>

            <InfoBox label="Blockchain" className="max-md:col-span-2">
              {connectionInfo.chain}
            </InfoBox>

            <InfoBox label="Network" className="max-md:col-span-3">
              {connectionInfo.networkId}
            </InfoBox>

            <Button
              className="h-full min-w-0 shrink grow flex-col items-start gap-0 truncate rounded-xl px-4 py-2 max-md:col-span-5"
              variant="outline"
              asChild
            >
              <Link to={replacedAddressExplorerUrl ?? '#'} target="_blank" rel="noopener noreferrer">
                <p className="font-grotesk text-xs font-medium whitespace-nowrap text-slate-500 capitalize">Address</p>

                <p className="text-primary w-full truncate font-sans text-sm font-black capitalize">
                  {connectionInfo.address}
                </p>
              </Link>
            </Button>

            <Tooltip.Root>
              <Tooltip.Trigger asChild onClick={e => e.preventDefault()}>
                <CopyButton
                  content={connectionInfo.address}
                  className="size-13 h-full rounded-xl max-md:w-full"
                  variant="outline"
                />
              </Tooltip.Trigger>

              <Tooltip.Content side="bottom">Copy Address</Tooltip.Content>
            </Tooltip.Root>

            <Button
              className="h-full min-w-40 rounded-xl max-md:col-span-6"
              variant="outline"
              onClick={() => startDisconnect(disconnect)}
            >
              {isDisconnecting ? (
                <Fragment>
                  <Spinner className="size-4" />
                  Disconnecting...
                </Fragment>
              ) : (
                <Fragment>
                  <Unlink className="size-4" />
                  Disconnect
                </Fragment>
              )}
            </Button>
          </div>

          {connectionInfo.walletInfo.name && connectionInfo.walletInfo.icon && (
            <div className="flex items-center gap-4 rounded-2xl border border-white/5 px-4 py-3 backdrop-blur-xs">
              <img
                src={connectionInfo.walletInfo.icon}
                alt={connectionInfo.walletInfo.name}
                className="size-8 rounded-lg object-contain"
              />

              <p className="font-sans text-sm font-black text-white capitalize">{connectionInfo.walletInfo.name}</p>

              {connectionInfo.walletInfo.description && (
                <Fragment>
                  <div className="h-full w-px bg-white/5" />
                  <p className="font-sans text-sm text-slate-400">{connectionInfo.walletInfo.description}</p>
                </Fragment>
              )}
            </div>
          )}
        </header>

        <main className="flex flex-col gap-12">
          <Tabs.Root defaultValue="methods">
            <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-2">
              <h2 className="font-sans text-base font-bold text-slate-400">Test Methods</h2>

              <Tabs.List>
                <Tabs.Trigger value="methods">
                  <Send />
                  Methods
                </Tabs.Trigger>
                <Tabs.Trigger value="custom">
                  <Command />
                  Custom
                </Tabs.Trigger>
              </Tabs.List>
            </div>

            <Tabs.Content value="methods">
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <MethodComponent />
              </ul>
            </Tabs.Content>

            <Tabs.Content value="custom">
              <CustomRequest />
            </Tabs.Content>
          </Tabs.Root>
        </main>
      </div>
    </div>
  )
}
