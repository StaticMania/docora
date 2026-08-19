import type { ReactNode } from 'react'

import { cn } from '../utils/cn'

export type BadgeColor = 'primary' | 'neutral' | 'info' | 'warning' | 'error'

const COLORS: Record<BadgeColor, string> = {
  primary: 'bg-primary/10 text-primary',
  neutral: 'bg-elevated text-foreground',
  info: 'bg-sky-500/10 text-sky-500',
  warning: 'bg-amber-500/10 text-amber-500',
  error: 'bg-destructive/10 text-destructive',
}

export type BadgeProps = Readonly<{
  children?: ReactNode
  label?: string
  color?: BadgeColor
  className?: string
}>

export function Badge({ children, label, color = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium [&_p]:m-0',
        COLORS[color] ?? COLORS.primary,
        className,
      )}
    >
      {label ?? children}
    </span>
  )
}
