import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export type StepsProps = Readonly<{
  children?: ReactNode
  level?: number | string
  className?: string
}>

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
