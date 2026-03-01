import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ClipboardPaste, RefreshCw } from 'lucide-react'
import { useState, type ChangeEvent, type ReactNode } from 'react'

type TProps = {
  children: ReactNode
  onConfirm?: (json: string) => void
}

export function ImportJsonModal({ children, onConfirm }: TProps) {
  const [json, setJson] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setError(null)
    setJson(e.target.value)
  }

  function handleConfirm() {
    try {
      if (!json.trim()) {
        setError('Input cannot be empty. Please enter valid JSON.')
        return
      }

      setLoading(true)
      onConfirm?.(json)
      setIsOpen(false)
      setJson('')
    } catch (error) {
      setError('Invalid JSON. Please check your input and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content className="sm:max-w-2xl">
        <Dialog.Header className="w-full flex-row items-center gap-4">
          <ClipboardPaste className="size-6" />

          <div className="flex grow flex-col justify-center">
            <Dialog.Title className="text-2xl">Import JSON</Dialog.Title>

            <p className="font-sans text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              {/* {requestState.method} */}
            </p>
          </div>

          <Dialog.Close />
        </Dialog.Header>

        <Dialog.Body>
          <p className="font-grotesk text-sm text-slate-600">
            Paste a JSON array or object. The system will automatically map the structure to the recursive builder.
          </p>

          <div className="flex flex-col gap-1">
            <Textarea
              data-error={!!error}
              className="h-64"
              placeholder='e.g. { "to": "0x...", "value": "1000000000" }'
              value={json}
              onChange={handleChange}
            />

            <p className="font-grotesk text-sm text-red-500">{error}</p>
          </div>

          <Button onClick={handleConfirm} className="mt-5 h-12" disabled={loading || !json.length}>
            {loading ? <RefreshCw className="size-4 animate-spin" /> : 'Import'}
          </Button>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  )
}
