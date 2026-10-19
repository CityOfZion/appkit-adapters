import { Server, ShieldCheck } from 'lucide-react'
import { Tabs } from '@/components/ui/tabs'
import { ChainHelper } from '@/helpers/chain'

export function NeoxRpcToggle() {
  function handleValueChange(value: string) {
    ChainHelper.setIsNeoXAntiMev(value === 'anti-mev')
  }

  return (
    <Tabs.Root value={ChainHelper.getIsNeoXAntiMev() ? 'anti-mev' : 'normal'} onValueChange={handleValueChange}>
      <Tabs.List aria-label="RPC">
        <Tabs.Trigger value="normal">
          <Server aria-hidden />
          Normal
        </Tabs.Trigger>

        <Tabs.Trigger value="anti-mev">
          <ShieldCheck aria-hidden />
          Anti-MEV
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  )
}
