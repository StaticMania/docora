'use client'

import { Children, isValidElement, type ReactNode } from 'react'
import { Tabs as TabsPrimitive } from 'radix-ui'

import { cn } from '../utils/cn'

export interface TabsProps {
  /** Labels, in the same order as the `<Tab>` children. */
  items: string[]
  children: ReactNode
  className?: string
}

/**
 * ```mdx
 * <Tabs items={["npm", "pnpm"]}>
 *   <Tab>npm install</Tab>
 *   <Tab>pnpm add</Tab>
 * </Tabs>
 * ```
 */
export function Tabs({ items, children, className }: TabsProps) {
  // MDX puts whitespace text nodes between elements; keep only the panels.
  const panels = Children.toArray(children).filter(isValidElement)

  return (
    <TabsPrimitive.Root defaultValue="0" className={cn('mt-6', className)}>
      <TabsPrimitive.List className="flex items-center gap-1 border-b border-border">
        {items.map((item, index) => (
          <TabsPrimitive.Trigger
            key={item}
            value={String(index)}
            className="-mb-px border-b-2 border-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-highlighted data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            {item}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {panels.map((panel, index) => (
        <TabsPrimitive.Content
          key={index}
          value={String(index)}
          className="focus-visible:outline-none [&>:first-child]:mt-4"
        >
          {panel}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}

export function Tab({ children }: { children: ReactNode }) {
  return <>{children}</>
}
