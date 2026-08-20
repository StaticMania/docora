'use client'
import { ChevronDown } from 'lucide-react'
import { Collapsible as CollapsiblePrimitive } from 'radix-ui'
import { useState, type ReactNode } from 'react'
import { cn } from '../utils/cn'

export type CollapsibleProps = Readonly<{
  children?: ReactNode
  name?: string
  open?: boolean
  className?: string
}>

export function Collapsible({ children, name, open = false, className }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(open)
  const label = name ?? (isOpen ? 'Hide' : 'Show')

  return (
    <CollapsiblePrimitive.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn('my-5', className)}
    >
      <CollapsiblePrimitive.Trigger className="group inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:text-highlighted">
        {label}
        <ChevronDown
          className="size-3.5 transition-transform group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </CollapsiblePrimitive.Trigger>

      <CollapsiblePrimitive.Content className="[&>:first-child]:mt-3">
        {children}
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  )
}
