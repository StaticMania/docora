'use client'
import { Tabs as TabsPrimitive } from 'radix-ui'
import { Children, isValidElement, type ReactNode } from 'react'

import { Icon } from '../components/icon'
import { cn } from '../utils/cn'

export type TabsItemProps = Readonly<{
  children?: ReactNode
  label?: string
  icon?: string
  className?: string
}>

export function TabsItem({ children }: TabsItemProps) {
  return <>{children}</>
}

export type TabsProps = Readonly<{
  children?: ReactNode
  items?: string[] | string
  className?: string
}>

export function Tabs({ children, items, className }: TabsProps) {
  const panels = Children.toArray(children).filter(isValidElement<TabsItemProps>)
  const labels = Array.isArray(items) ? items : undefined

  return (
    <TabsPrimitive.Root defaultValue="0" className={cn('my-5', className)}>
      <TabsPrimitive.List className="flex items-center gap-1 border-b border-border">
        {panels.map((panel, index) => (
          <TabsPrimitive.Trigger
            key={index}
            value={String(index)}
            className="-mb-px flex items-center gap-1.5 border-b-2 border-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-highlighted data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            {panel.props.icon && <Icon name={panel.props.icon} className="size-4 shrink-0" />}
            {panel.props.label ?? labels?.[index] ?? `Tab ${index + 1}`}
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
