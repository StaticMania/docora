'use client'

import { Children, isValidElement, useState, type ReactElement, type ReactNode } from 'react'

import { Icon } from '../components/icon'
import { iconForFilename } from '../mdx/code-meta'
import { cn } from '../utils/cn'

interface CodeChildProps {
  'data-filename'?: string
}

export interface CodeTreeProps {
  children?: ReactNode
  /** Filename to show first. MDC writes this as `default-value`. */
  defaultValue?: string
  'default-value'?: string
  className?: string
}

/** File tree beside the selected file's contents. */
export function CodeTree({ children, className, ...props }: CodeTreeProps) {
  const blocks = Children.toArray(children).filter(isValidElement<CodeChildProps>)
  const names = blocks.map((block, index) => block.props['data-filename'] ?? `File ${index + 1}`)

  const preferred = props.defaultValue ?? props['default-value']
  const initial = Math.max(0, names.indexOf(preferred ?? ''))
  const [active, setActive] = useState(initial)

  if (blocks.length === 0) return null

  return (
    <div className={cn('my-5 overflow-hidden rounded-md border border-border bg-muted sm:flex', className)}>
      <div className="shrink-0 border-b border-border p-2 sm:w-56 sm:border-e sm:border-b-0">
        {names.map((name, index) => (
          <button
            key={name}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              'flex w-full items-center gap-1.5 rounded-sm px-2 py-1 text-start text-xs transition-colors',
              index === active
                ? 'bg-elevated font-medium text-primary'
                : 'text-muted-foreground hover:text-highlighted',
            )}
          >
            <Icon name={iconForFilename(name)} className="size-3.5 shrink-0" />
            <span className="truncate font-mono">{name}</span>
          </button>
        ))}
      </div>

      {/* The nested block brings its own frame, which would double up here. */}
      <div className="min-w-0 flex-1 [&_.docs-code]:my-0 [&_.docs-code-header]:hidden [&_.docs-code_pre]:rounded-none [&_.docs-code_pre]:border-0">
        {blocks[active]}
      </div>
    </div>
  )
}
