import type { ReactNode } from 'react'

import { cn } from '../utils/cn'

export interface StepsProps {
  children?: ReactNode
  /** Heading level that starts a new step. Defaults to 3 (`###`). */
  level?: number | string
  className?: string
}

/**
 * Numbers the headings it contains, drawing a rule down the left.
 *
 * The counter is CSS-driven so the markup stays plain markdown: authors write
 * headings, not step components.
 */
export function Steps({ children, level = 3, className }: StepsProps) {
  const heading = `h${Number(level) || 3}`

  return (
    <div
      className={cn('docs-steps my-5 ms-4 border-s border-border ps-8', className)}
      data-steps-heading={heading}
    >
      {children}
    </div>
  )
}
