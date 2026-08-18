'use client'

import { Children, isValidElement, type ReactNode } from 'react'
import { Accordion as AccordionPrimitive } from 'radix-ui'
import { ChevronDown } from 'lucide-react'

import { Icon } from '../components/icon'
import { cn } from '../utils/cn'

export interface AccordionItemProps {
  children?: ReactNode
  label?: string
  icon?: string
  className?: string
}

/**
 * Rendered by `Accordion`, which reads the label and icon off each child.
 * On its own it just renders its body.
 */
export function AccordionItem({ children }: AccordionItemProps) {
  return <>{children}</>
}

export function Accordion({ children, className }: { children?: ReactNode; className?: string }) {
  const items = Children.toArray(children).filter(isValidElement<AccordionItemProps>)

  return (
    <AccordionPrimitive.Root type="single" collapsible className={cn('my-5 divide-y divide-border border-y border-border', className)}>
      {items.map((item, index) => (
        <AccordionPrimitive.Item key={index} value={String(index)}>
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center gap-2 py-3 text-left text-sm font-medium text-highlighted">
              {item.props.icon && <Icon name={item.props.icon} className="size-4 shrink-0 text-dimmed" />}
              <span className="min-w-0 flex-1 truncate">{item.props.label}</span>
              <ChevronDown
                className="size-4 shrink-0 text-dimmed transition-transform group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>

          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-none">
            <div className="pb-4 text-sm text-muted-foreground [&>:first-child]:mt-0 [&>:last-child]:mb-0">
              {item}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}
