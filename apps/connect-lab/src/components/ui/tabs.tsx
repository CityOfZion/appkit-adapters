import * as React from 'react'
import { Tabs as TabsPrimitive } from 'radix-ui'
import { StyleHelper } from '@/helpers/style'

function Root({ className, orientation = 'horizontal', ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={StyleHelper.merge('group/tabs flex gap-8 data-[orientation=horizontal]:flex-col', className)}
      {...props}
    />
  )
}

function List({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className="flex w-fit items-center justify-center gap-1 rounded-2xl border border-white/5 p-1 shadow-inner group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col"
      {...props}
    />
  )
}

function Trigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={StyleHelper.merge(
        "font-grotesk hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-lg border border-transparent px-6 py-2.5 text-xs font-black whitespace-nowrap text-slate-500 transition-all duration-300 group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:bg-white/5 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        'data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/20',
        className
      )}
      {...props}
    />
  )
}

function Content({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={StyleHelper.merge(
        'animate-in fade-in slide-in-from-top-2 flex-1 duration-500 outline-none',
        className
      )}
      {...props}
    />
  )
}

export const Tabs = { Root, List, Trigger, Content }
