import { Fragment } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { StyleHelper } from '@/helpers/style'

type TProps = {
  label?: ReactNode
} & ComponentProps<'div'>

export function InfoBox({ children, label, className, ...props }: TProps) {
  return (
    <div
      className={StyleHelper.merge(
        'flex flex-col rounded-2xl border border-white/5 px-4 py-2 backdrop-blur-xs',
        className
      )}
      {...props}
    >
      {label && (
        <Fragment>
          {typeof label === 'object' ? (
            label
          ) : (
            <p className="font-grotesk truncate text-xs font-medium whitespace-nowrap text-slate-500 capitalize">
              {label}
            </p>
          )}
        </Fragment>
      )}

      {typeof children === 'object' ? (
        children
      ) : (
        <p className="truncate font-sans text-sm font-black text-white capitalize">{children}</p>
      )}
    </div>
  )
}
