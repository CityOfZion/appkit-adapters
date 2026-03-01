import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { useRequest } from '@/hooks/use-request'
import { Code } from 'lucide-react'
import { StyleHelper } from '@/helpers/style'
import { CopyButton } from '@/components/copy-button'

export function RequestModal() {
  const { requestState, setRequestState } = useRequest()

  return (
    <Dialog.Root open={requestState.status !== 'idle'} onOpenChange={() => setRequestState({ status: 'idle' })}>
      {requestState.status !== 'idle' && (
        <Dialog.Content
          onInteractOutside={event => event.preventDefault()}
          className={StyleHelper.merge({
            'max-h-[90dvh] min-h-130 w-sm min-w-160 resize duration-0 sm:max-w-[90dvw]':
              requestState.status === 'success' || requestState.status === 'error',
          })}
        >
          <Dialog.Header className="w-full flex-row items-center">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Code className="size-4 text-blue-400" />
            </div>

            <div className="flex grow flex-col justify-center">
              <Dialog.Title>RPC Execution</Dialog.Title>

              <p className="font-sans text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                {requestState.method}
              </p>
            </div>

            <Dialog.Close />
          </Dialog.Header>

          {requestState.status === 'loading' ? (
            <Dialog.Body className="items-center text-center">
              <div className="flex animate-pulse flex-col items-center gap-4">
                <Spinner />
                <p className="font-brand text-lg font-bold text-white">Awaiting Confirmation</p>
                <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                  Please check your wallet for the incoming {requestState.method} request.
                </p>
              </div>
            </Dialog.Body>
          ) : (
            <Dialog.Body className="grow items-center py-5 text-center">
              <div
                data-status={requestState.status}
                className="relative w-full grow overflow-y-auto rounded-2xl border border-emerald-500/20 bg-black px-8 pt-12 pb-8 text-left text-emerald-400/90 backdrop-blur-lg data-[status=error]:border-red-500/20 data-[status=error]:bg-red-950/5 data-[status=error]:text-red-400/90"
              >
                <CopyButton content={requestState.data} />

                <pre className="h-full w-full font-mono text-sm leading-relaxed font-medium wrap-break-word whitespace-pre-wrap">
                  {JSON.stringify(requestState.data, null, 2)}
                </pre>
              </div>

              <Button className="mt-auto w-full" variant="outline" onClick={() => setRequestState({ status: 'idle' })}>
                Close
              </Button>
            </Dialog.Body>
          )}
        </Dialog.Content>
      )}
    </Dialog.Root>
  )
}
