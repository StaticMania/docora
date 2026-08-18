import { CircleAlert, Info, Lightbulb, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '../utils/cn'

export type CalloutType = 'note' | 'tip' | 'warning' | 'caution'

const VARIANTS = {
  note: { icon: Info, className: 'border-sky-500/30 bg-sky-500/5', iconClassName: 'text-sky-500' },
  tip: { icon: Lightbulb, className: 'border-primary/30 bg-primary/5', iconClassName: 'text-primary' },
  warning: { icon: TriangleAlert, className: 'border-amber-500/30 bg-amber-500/5', iconClassName: 'text-amber-500' },
  caution: {
    icon: CircleAlert,
    className: 'border-destructive/30 bg-destructive/5',
    iconClassName: 'text-destructive',
  },
} as const

export interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
  className?: string
}

export function Callout({ type = 'note', title, children, className }: CalloutProps) {
  const variant = VARIANTS[type] ?? VARIANTS.note
  const Icon = variant.icon

  return (
    <div className={cn('mt-6 flex gap-3 rounded-md border p-4 text-sm', variant.className, className)}>
      <Icon className={cn('mt-0.5 size-4 shrink-0', variant.iconClassName)} aria-hidden />

      <div className="min-w-0 [&>:first-child]:mt-0">
        {title && <p className="mb-1 font-semibold text-highlighted">{title}</p>}
        {children}
      </div>
    </div>
  )
}

export const Note = (props: Omit<CalloutProps, 'type'>) => <Callout type="note" {...props} />
export const Tip = (props: Omit<CalloutProps, 'type'>) => <Callout type="tip" {...props} />
export const Warning = (props: Omit<CalloutProps, 'type'>) => <Callout type="warning" {...props} />
export const Caution = (props: Omit<CalloutProps, 'type'>) => <Callout type="caution" {...props} />
