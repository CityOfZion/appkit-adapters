import { useEffect, useState } from 'react'
import type { ComponentProps } from 'react'
import { StyleHelper } from '@/helpers/style'

import AppLogo from '@/assets/icons/app-logo.svg?react'

export function AnimatedAppLogo({ className, ...props }: ComponentProps<'div'>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true)
    }, 500)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div
      className={StyleHelper.merge(
        'animate-in fade-in slide-in-from-bottom-20 flex flex-col items-center justify-center duration-500',
        {
          'animate-float': mounted,
        },
        className
      )}
      {...props}
    >
      <div className="group relative scale-125">
        <div className="animate-orbit absolute inset-0 animate-pulse bg-blue-500 opacity-20 blur-[80px]" />
        <div
          className="absolute inset-0 animate-pulse bg-indigo-600 opacity-10 blur-2xl"
          style={{ animationDelay: '1s' }}
        />

        <div className="animate-energy absolute -inset-3 rounded-[3rem] border border-blue-500/20" />

        <AppLogo className="relative z-10 size-32 max-sm:size-24" />

        <div className="pointer-events-none absolute top-0 left-0 h-full w-full rounded-[2.5rem] bg-linear-to-tr from-transparent via-white/5 to-transparent max-sm:rounded-4xl" />
      </div>
    </div>
  )
}
