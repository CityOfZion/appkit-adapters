import { Link, Navigate, createFileRoute } from '@tanstack/react-router'
import { Command, Send, Unlink } from 'lucide-react'
import { Fragment, useTransition } from 'react'
import { RequestModal } from './-request-modal'
import { InfoBox } from './-info-box'
import { CustomRequest } from './-custom-request'
import { NeoxRpcToggle } from './-neox-rpc-toggle'
import type { TSupportedChain } from '@/helpers/chain'
import type { ComponentType } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ChainHelper } from '@/helpers/chain'
import { useConnection } from '@/hooks/use-connection'
import { EIP155Methods } from '@/components/methods/eip155-methods'
import { SolanaMethods } from '@/components/methods/solana-methods'
import { Neo3Methods } from '@/components/methods/neo3-methods'
import { StellarMethods } from '@/components/methods/stellar-methods'
import { BitcoinMethods } from '@/components/methods/bitcoin-methods'
import { NeoxMethods } from '@/components/methods/neox-methods'
import { Tabs } from '@/components/ui/tabs'
import { Tooltip } from '@/components/ui/tooltip'
import { CopyButton } from '@/components/copy-button'
import { StyleHelper } from '@/helpers/style'

export const Route = createFileRoute('/connected')({
  component: RouteComponent,
})

// It should be here because of fast refresh, otherwise it will cause an error when saving any methods component file
const methodsComponentByChain: Record<TSupportedChain, ComponentType> = {
  neo3: Neo3Methods,
  ethereum: EIP155Methods,
  arbitrum: EIP155Methods,
  base: EIP155Methods,
  neox: NeoxMethods,
  polygon: EIP155Methods,
  solana: SolanaMethods,
  stellar: StellarMethods,
  bitcoin: BitcoinMethods,
}

function RouteComponent() {
  const { connectionInfo, disconnect } = useConnection()
  const [isDisconnecting, startDisconnect] = useTransition()

  if (connectionInfo.status !== 'connected') {
    return <Navigate to="/" />
  }

  const MethodComponent = methodsComponentByChain[connectionInfo.chain]
  const chainInfo = ChainHelper.chainInfos[connectionInfo.chain]

  const addressExplorerUrl = chainInfo.addressUrlTemplate[connectionInfo.networkId]?.replace(
    '{address}',
    connectionInfo.address
  )

  const content = (
    <Fragment>
      <span className="font-grotesk w-full truncate text-xs font-medium text-slate-500 capitalize">Address</span>
      <span className="text-primary w-full truncate font-sans text-sm font-black capitalize">
        {connectionInfo.address}
      </span>
    </Fragment>
  )

  return (
    <div className="flex w-full min-w-0 flex-col gap-12">
      <RequestModal />

      <div className="flex flex-col gap-4">
        <div className="flex w-full min-w-0 gap-2 max-md:grid max-md:grid-cols-6 max-md:grid-rows-3 md:h-13">
          <InfoBox className="items-center justify-center">
            <chainInfo.icon className="size-4 min-h-4 min-w-4" style={{ color: chainInfo.color }} />
          </InfoBox>

          <InfoBox label="Blockchain" className="max-md:col-span-2">
            {chainInfo.name}
          </InfoBox>

          <InfoBox label="Network" className="max-md:col-span-3">
            {connectionInfo.networkId}
          </InfoBox>

          <Button
            className={StyleHelper.merge(
              'h-full min-w-0 shrink grow flex-col items-start gap-0 truncate rounded-xl px-4 py-2 max-md:col-span-5',
              {
                'pointer-events-none': !addressExplorerUrl,
              }
            )}
            variant="outline"
            asChild
          >
            {addressExplorerUrl ? (
              <Link to={addressExplorerUrl} target="_blank" rel="noopener noreferrer">
                {content}
              </Link>
            ) : (
              <span>{content}</span>
            )}
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
                <Unlink aria-hidden className="size-4" />
                Disconnect
              </Fragment>
            )}
          </Button>
        </div>

        {connectionInfo.walletInfo.name && connectionInfo.walletInfo.icon && (
          <div className="flex items-center gap-4 rounded-2xl border border-white/5 px-4 py-3 backdrop-blur-xs max-sm:flex-col">
            <img
              src={connectionInfo.walletInfo.icon}
              alt={connectionInfo.walletInfo.name}
              className="pointer-events-none size-8 rounded-lg object-contain"
            />

            <p className="text-left font-sans text-sm font-black text-white capitalize max-sm:text-center">
              {connectionInfo.walletInfo.name}
            </p>

            {connectionInfo.walletInfo.description && (
              <p className="text-left font-sans text-sm text-slate-400">{connectionInfo.walletInfo.description}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-12">
        <Tabs.Root defaultValue="methods">
          <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-2 max-sm:flex-col max-sm:items-start max-sm:justify-start">
            <h2 className="font-sans text-base font-bold text-slate-400">Methods</h2>

            <div className="flex items-center justify-end gap-2 max-sm:flex-col max-sm:items-start max-sm:justify-start">
              <Tabs.List>
                <Tabs.Trigger value="methods">
                  <Send aria-hidden />
                  Methods
                </Tabs.Trigger>
                <Tabs.Trigger value="custom">
                  <Command aria-hidden />
                  Custom
                </Tabs.Trigger>
              </Tabs.List>

              {connectionInfo.chain === 'neox' && <NeoxRpcToggle />}
            </div>
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
      </div>
    </div>
  )
}
