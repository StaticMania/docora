import type { ReactNode } from 'react'

import { cn } from '../utils/cn'

export type FieldProps = Readonly<{
  children?: ReactNode
  name?: string
  type?: string
  required?: boolean | string
  className?: string
}>

export function Field({ children, name, type, required, className }: FieldProps) {
  const isRequired = required === true || required === 'true' || required === ''

  return (
    <div className={cn('py-3 text-sm', className)}>
      <p className="flex flex-wrap items-center gap-2">
        {name && <code className="font-mono text-highlighted">{name}</code>}
        {type && <span className="font-mono text-xs text-muted-foreground">{type}</span>}
        {isRequired && <span className="text-xs font-medium text-destructive">required</span>}
      </p>

      <div className="mt-1 text-muted-foreground [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function FieldGroup({
  children,
  className,
}: Readonly<{ children?: ReactNode; className?: string }>) {
  return (
    <div className={cn('my-5 divide-y divide-border border-y border-border', className)}>
      {children}
    </div>
  )
}
