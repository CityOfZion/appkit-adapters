import * as React from 'react'
import { StyleHelper } from '@/helpers/style'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={StyleHelper.merge(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground font-grotesk h-12 w-full min-w-0 rounded-xl border border-white/5 bg-black/40 px-4 py-1 text-sm font-black shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-blue-500/50',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  )
}

export { Input }
