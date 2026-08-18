import type { ReactNode } from 'react'

import { cn } from '../utils/cn'

export interface KbdProps {
  children?: ReactNode
  value?: string
  className?: string
}

export function Kbd({ children, value, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex min-w-5 items-center justify-center rounded-sm border border-border bg-elevated px-1.5 py-0.5 font-sans text-xs font-medium text-foreground',
        className,
      )}
    >
      {value ?? children}
    </kbd>
  )
}
