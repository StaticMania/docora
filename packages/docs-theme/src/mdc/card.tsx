import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { Icon } from '../components/icon'
import { cn } from '../utils/cn'

export interface CardProps {
  children?: ReactNode
  title?: string
  icon?: string
  /** Turns the card into a link. */
  to?: string
  target?: string
  className?: string
}

export function Card({ children, title, icon, to, target, className }: CardProps) {
  const external = to?.startsWith('http') ?? false

  const body = (
    <>
      {icon && <Icon name={icon} className="size-5 shrink-0 text-primary" />}

      {title && (
        <p className="flex items-center gap-1 font-semibold text-highlighted">
          {title}
          {to && external && <ArrowUpRight className="size-3.5 text-dimmed" aria-hidden />}
        </p>
      )}

      <div className="text-sm text-muted-foreground [&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
    </>
  )

  const classes = cn(
    'flex flex-col gap-2 rounded-md border border-border p-4 transition-colors',
    to && 'hover:border-primary/50',
    className,
  )

  if (to) {
    return (
      <Link
        href={to}
        {...(target ? { target } : external ? { target: '_blank', rel: 'noreferrer' } : {})}
        className={classes}
      >
        {body}
      </Link>
    )
  }

  return <div className={classes}>{body}</div>
}

export interface CardGroupProps {
  children?: ReactNode
  /** Columns on wide viewports. Defaults to 2. */
  cols?: number | string
  className?: string
}

export function CardGroup({ children, cols = 2, className }: CardGroupProps) {
  const columns = Number(cols) || 2

  return (
    <div
      className={cn('my-5 grid gap-4', columns >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2', className)}
    >
      {children}
    </div>
  )
}
