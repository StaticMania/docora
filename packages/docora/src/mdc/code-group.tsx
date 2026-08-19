'use client'

import { ChevronDown } from 'lucide-react'
import { Children, isValidElement, useState, type ReactElement, type ReactNode } from 'react'

import { Icon } from '../components/icon'
import { iconForFilename } from '../mdx/code-meta'
import { cn } from '../utils/cn'

type CodeChildProps = Readonly<{
  'data-filename'?: string
  'data-language'?: string
}>

function labelOf(child: ReactElement<CodeChildProps>, index: number): string {
  return child.props['data-filename'] ?? child.props['data-language'] ?? `Snippet ${index + 1}`
}

export function CodeGroup({
  children,
  className,
}: Readonly<{ children?: ReactNode; className?: string }>) {
  const blocks = Children.toArray(children).filter(isValidElement<CodeChildProps>)
  const [active, setActive] = useState(0)

  if (blocks.length === 0) return null

  return (
    <div className={cn('my-5 overflow-hidden rounded-md border border-border bg-muted', className)}>
      <div
        role="tablist"
        className="flex items-center gap-1 overflow-x-auto border-b border-border px-2"
      >
        {blocks.map((block, index) => {
          const label = labelOf(block, index)

          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
              className={cn(
                '-mb-px flex items-center gap-1.5 border-b-2 px-2.5 py-2 text-xs whitespace-nowrap transition-colors',
                index === active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-highlighted',
              )}
            >
              <Icon name={iconForFilename(label)} className="size-3.5 shrink-0" />
              {label}
            </button>
          )
        })}
      </div>

      <div className="[&_.docs-code]:my-0 [&_.docs-code-header]:hidden [&_.docs-code_pre]:rounded-none [&_.docs-code_pre]:border-0">
        {blocks[active]}
      </div>
    </div>
  )
}

export function CodeCollapse({
  children,
  className,
  name = 'code',
}: Readonly<{
  children?: ReactNode
  className?: string
  name?: string
}>) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('my-5 overflow-hidden rounded-md border border-border bg-muted', className)}>
      <div
        className={cn(
          'relative [&_.docs-code]:my-0 [&_.docs-code-header]:rounded-none [&_.docs-code-header]:border-0 [&_.docs-code-header]:border-b [&_.docs-code_pre]:rounded-none [&_.docs-code_pre]:border-0',
          !open && 'max-h-48 overflow-hidden',
        )}
      >
        {children}
        {!open && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-muted to-transparent" />
        )}
      </div>

      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="flex w-full items-center justify-center gap-1 border-t border-border py-2 text-xs text-muted-foreground transition-colors hover:text-highlighted"
      >
        {open ? `Collapse ${name}` : `Expand ${name}`}
        <ChevronDown
          className={cn('size-3.5 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>
    </div>
  )
}

function slotName(element: ReactElement): string | undefined {
  const props = element.props as Record<string, unknown>
  if (typeof props['data-slot'] === 'string') return props['data-slot']
  if (typeof props.dataSlot === 'string') return props.dataSlot
  if (typeof props.slot === 'string') return props.slot
  return undefined
}

export function CodePreview({
  children,
  className,
  label = 'Preview',
  icon = 'i-lucide-eye',
}: Readonly<{
  children?: ReactNode
  className?: string
  label?: string
  icon?: string
}>) {
  const parts = Children.toArray(children).filter(isValidElement)
  const [tab, setTab] = useState<'preview' | 'code'>('preview')

  const slotted =
    parts.find(part => slotName(part) === 'code') ?? parts.find(part => slotName(part))
  const headingIndex = parts.findIndex(
    part => part.type === 'h1' && (part.props as { id?: string }).id === 'code',
  )

  const code = slotted ?? (headingIndex >= 0 ? parts.slice(headingIndex + 1) : undefined)
  const preview = slotted
    ? parts.filter(part => part !== slotted)
    : headingIndex >= 0
      ? parts.slice(0, headingIndex)
      : parts
  const hasCode = Boolean(slotted) || headingIndex >= 0

  if (!hasCode) {
    return (
      <div className={cn('my-5 [&>:first-child]:mt-0 [&>:last-child]:mb-0', className)}>
        {children}
      </div>
    )
  }

  return (
    <div className={cn('my-5', className)}>
      <div className="flex items-center gap-1 border-b border-border">
        <button
          type="button"
          onClick={() => setTab('preview')}
          className={cn(
            '-mb-px flex items-center gap-1.5 border-b-2 px-3 py-1.5 text-sm transition-colors',
            tab === 'preview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-highlighted',
          )}
        >
          <Icon name={icon} className="size-4 shrink-0" />
          {label}
        </button>
        <button
          type="button"
          onClick={() => setTab('code')}
          className={cn(
            '-mb-px flex items-center gap-1.5 border-b-2 px-3 py-1.5 text-sm transition-colors',
            tab === 'code'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-highlighted',
          )}
        >
          <Icon name="i-lucide-code" className="size-4 shrink-0" />
          Code
        </button>
      </div>

      {tab === 'preview' ? (
        <div className="mt-4 [&>:first-child]:mt-0 [&>:last-child]:mb-0">{preview}</div>
      ) : (
        <div className="mt-4 [&_.docs-code]:my-0">{code}</div>
      )}
    </div>
  )
}
