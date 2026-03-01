import * as React from 'react'
import { Label as LabelPrimitive } from 'radix-ui'
import { StyleHelper } from '@/helpers/style'

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={StyleHelper.merge(
        'ml-1 flex items-center gap-2 font-mono text-xs leading-none font-medium tracking-widest text-slate-400 uppercase select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Label }
