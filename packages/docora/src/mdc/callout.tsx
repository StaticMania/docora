import Link from 'next/link'
import type { ReactNode } from 'react'

import { Icon } from '../components/icon'
import { cn } from '../utils/cn'

export type CalloutColor = 'neutral' | 'info' | 'success' | 'warning' | 'error'

const COLORS: Record<CalloutColor, string> = {
  neutral: 'border-border bg-muted text-foreground [--callout-accent:var(--color-muted-foreground)]',
  info: 'border-sky-500/25 bg-sky-500/5 [--callout-accent:var(--color-sky-500)]',
  success: 'border-primary/25 bg-primary/5 [--callout-accent:var(--primary)]',
  warning: 'border-amber-500/25 bg-amber-500/5 [--callout-accent:var(--color-amber-500)]',
  error: 'border-destructive/25 bg-destructive/5 [--callout-accent:var(--destructive)]',
}

export interface CalloutProps {
  children?: ReactNode
  /** Iconify or lucide icon name. Each shortcut supplies its own default. */
  icon?: string
  color?: CalloutColor
  /** Turns the whole callout into a link. */
  to?: string
  target?: string
  className?: string
}

export function Callout({ children, icon, color = 'neutral', to, target, className }: CalloutProps) {
  const body = (
    <>
      {icon && <Icon name={icon} className="mt-0.5 size-4 shrink-0 text-(--callout-accent)" />}
      <div className="min-w-0 [&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
    </>
  )

  const classes = cn('my-5 flex gap-2.5 rounded-md border px-4 py-3 text-sm', COLORS[color] ?? COLORS.neutral, className)

  if (to) {
    const external = to.startsWith('http')

    return (
      <Link
        href={to}
        {...(target ? { target } : external ? { target: '_blank', rel: 'noreferrer' } : {})}
        className={cn(classes, 'transition-colors hover:border-(--callout-accent)')}
      >
        {body}
      </Link>
    )
  }

  return <div className={classes}>{body}</div>
}

const shortcut = (color: CalloutColor, icon: string) =>
  function CalloutShortcut(props: CalloutProps) {
    return <Callout color={color} icon={icon} {...props} />
  }

export const Note = shortcut('info', 'i-lucide-info')
export const Tip = shortcut('success', 'i-lucide-lightbulb')
export const Warning = shortcut('warning', 'i-lucide-triangle-alert')
export const Caution = shortcut('error', 'i-lucide-circle-alert')
