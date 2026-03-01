import { BookOpen } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { Tooltip } from './ui/tooltip'

type TProps = {
  name: string
  docUrl?: string
  description: string
  onPlay?: () => void
}

export function MethodCard({ name, docUrl, description, onPlay }: TProps) {
  return (
    <div className="relative flex h-full flex-col items-start gap-2 rounded-2xl border border-white/5 p-4 backdrop-blur-xs transition-all duration-300">
      <p className="truncate font-sans text-sm font-black text-white capitalize">{name}</p>

      <p className="text-[0.625rem] font-bold tracking-wider text-slate-500">{description}</p>

      <div className="mt-auto flex w-full gap-1">
        <Button size="sm" className="grow" variant="default" onClick={onPlay}>
          Execute
        </Button>

        {docUrl && (
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Button size="icon-sm" aria-label="View documentation" variant="outline" asChild>
                <Link to={docUrl} target="_blank" rel="noopener noreferrer">
                  <BookOpen aria-hidden className="size-4" />
                </Link>
              </Button>
            </Tooltip.Trigger>

            <Tooltip.Content>
              <span>View documentation</span>
            </Tooltip.Content>
          </Tooltip.Root>
        )}
      </div>
    </div>
  )
}
