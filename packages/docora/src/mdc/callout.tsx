import Link from 'next/link'
import type { ReactNode } from 'react'

import { Icon } from '../components/icon'
import { cn } from '../utils/cn'

export type CalloutColor = 'neutral' | 'info' | 'success' | 'warning' | 'error'

const COLORS: Record<CalloutColor, string> = {
  neutral: 'border-border bg-muted text-foreground [--callout-accent:var(--color-highlighted)]',
  info: 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300 [--callout-accent:var(--color-sky-500)] dark:[--callout-accent:var(--color-sky-400)]',
  success:
    'border-primary/25 bg-primary/10 text-emerald-700 dark:text-emerald-300 [--callout-accent:var(--primary)]',
  warning:
    'border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-300 [--callout-accent:var(--color-amber-500)] dark:[--callout-accent:var(--color-amber-400)]',
  error:
    'border-destructive/25 bg-destructive/10 text-red-700 dark:text-red-300 [--callout-accent:var(--destructive)]',
}

export type CalloutProps = Readonly<{
  children?: ReactNode
  icon?: string
  color?: CalloutColor
  to?: string
  target?: string
  className?: string
}>

export function Callout({
  children,
  icon,
  color = 'neutral',
  to,
  target,
  className,
}: CalloutProps) {
  const body = (
    <>
      {icon && <Icon name={icon} className="size-4 shrink-0 text-(--callout-accent)" />}
      <div className="min-w-0 [&_p]:my-0 [&_p]:leading-6">{children}</div>
    </>
  )

  const classes = cn(
    'my-5 flex items-center gap-2.5 rounded-md border px-4 py-3 text-sm/6',
    COLORS[color] ?? COLORS.neutral,
    className,
  )

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
