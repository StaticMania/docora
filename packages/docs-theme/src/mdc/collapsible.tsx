'use client'

import { useState, type ReactNode } from 'react'
import { Collapsible as CollapsiblePrimitive } from 'radix-ui'
import { ChevronDown } from 'lucide-react'

import { cn } from '../utils/cn'

export interface CollapsibleProps {
  children?: ReactNode
  /** Trigger text. Defaults to Show / Hide. */
  name?: string
  open?: boolean
  className?: string
}

export function Collapsible({ children, name, open = false, className }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(open)
  const label = name ?? (isOpen ? 'Hide' : 'Show')

  return (
    <CollapsiblePrimitive.Root open={isOpen} onOpenChange={setIsOpen} className={cn('my-5', className)}>
      <CollapsiblePrimitive.Trigger className="group inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-sm text-muted-foreground transition-colors hover:text-highlighted">
        {label}
        <ChevronDown className="size-3.5 transition-transform group-data-[state=open]:rotate-180" aria-hidden />
      </CollapsiblePrimitive.Trigger>

      <CollapsiblePrimitive.Content className="[&>:first-child]:mt-3">{children}</CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  )
}
