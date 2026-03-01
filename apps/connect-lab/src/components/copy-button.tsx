import { Copy, Check } from 'lucide-react'
import { Button } from './ui/button'
import { useState, type ComponentProps } from 'react'

type TProps = {
  content: any
} & ComponentProps<typeof Button>

export function CopyButton({ content, ...props }: TProps) {
  const [hasCopied, setHasCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(JSON.stringify(content, null, 2))
    setHasCopied(true)

    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <Button variant="ghost" size="icon-sm" {...props} onClick={handleCopy}>
      <span className="relative">
        <Check
          className={`absolute size-4 transition-opacity duration-300 ${hasCopied ? 'opacity-100' : 'opacity-0'}`}
        />

        <Copy className={`size-4 transition-opacity duration-300 ${hasCopied ? 'opacity-0' : 'opacity-100'}`} />
      </span>
    </Button>
  )
}
