import * as React from 'react'
import { StyleHelper } from '@/helpers/style'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={StyleHelper.merge(
        'border-input placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content h-12 min-h-12 w-full resize-none overflow-hidden rounded-xl border bg-black/40 p-4 font-mono text-base font-medium shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'data-[error=true]:border-red-500/50 data-[error=true]:bg-red-500/5',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
