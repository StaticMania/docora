'use client'

import { Children, isValidElement, useState, type ReactElement, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

import { Icon } from '../components/icon'
import { iconForFilename } from '../mdx/code-meta'
import { cn } from '../utils/cn'

interface CodeChildProps {
  'data-filename'?: string
  'data-language'?: string
}

function labelOf(child: ReactElement<CodeChildProps>, index: number): string {
  return child.props['data-filename'] ?? child.props['data-language'] ?? `Snippet ${index + 1}`
}

/** Tabbed group of code blocks — one tab per fence, labelled by its filename. */
export function CodeGroup({ children, className }: { children?: ReactNode; className?: string }) {
  const blocks = Children.toArray(children).filter(isValidElement<CodeChildProps>)
  const [active, setActive] = useState(0)

  if (blocks.length === 0) return null

  return (
    <div className={cn('my-5 overflow-hidden rounded-md border border-border bg-muted', className)}>
      <div role="tablist" className="flex items-center gap-1 overflow-x-auto border-b border-border px-2">
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

      {/* The nested blocks bring their own chrome, which would double up here. */}
      <div className="[&_>div]:my-0 [&_>div]:rounded-none [&_>div]:border-0">{blocks[active]}</div>
    </div>
  )
}

/** A code block that starts collapsed behind a toggle. */
export function CodeCollapse({
  children,
  className,
  name = 'code',
}: {
  children?: ReactNode
  className?: string
  name?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('my-5 overflow-hidden rounded-md border border-border bg-muted', className)}>
      <div
        className={cn(
          'relative [&_>div]:my-0 [&_>div]:rounded-none [&_>div]:border-0',
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
        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
    </div>
  )
}

/** Rendered output on one tab, its source on the other. */
export function CodePreview({ children, className }: { children?: ReactNode; className?: string }) {
  const parts = Children.toArray(children).filter(isValidElement)
  const [tab, setTab] = useState<'preview' | 'code'>('preview')

  // A `#code` slot holds the source; everything else is the preview.
  const code = parts.find(part => (part.props as { slot?: string }).slot === 'code')
  const preview = parts.filter(part => part !== code)

  return (
    <div className={cn('my-5 overflow-hidden rounded-md border border-border', className)}>
      <div className="flex items-center gap-1 border-b border-border bg-muted px-2">
        {(['preview', 'code'] as const).map(value => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              '-mb-px border-b-2 px-2.5 py-2 text-xs capitalize transition-colors',
              tab === value
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-highlighted',
            )}
          >
            {value}
          </button>
        ))}
      </div>

      {tab === 'preview' ? (
        <div className="p-4 [&>:first-child]:mt-0 [&>:last-child]:mb-0">{preview}</div>
      ) : (
        <div className="[&_>div]:my-0 [&_>div]:rounded-none [&_>div]:border-0">{code ?? null}</div>
      )}
    </div>
  )
}
