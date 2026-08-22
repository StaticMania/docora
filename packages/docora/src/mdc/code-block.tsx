'use client'

import { Check, Copy } from 'lucide-react'
import { useRef, useState, type HTMLAttributes, type ReactNode } from 'react'

import { Icon } from '../components/icon'
import { iconForFilename } from '../mdx/code-meta'
import { cn } from '../utils/cn'

export type CodeBlockProps = Readonly<
  HTMLAttributes<HTMLElement> & {
    children?: ReactNode
    /** Tighter padding for the assistant chat. */
    compact?: boolean
    'data-filename'?: string
    'data-language'?: string
    'data-line-numbers'?: string
    'data-rehype-pretty-code-figure'?: string
  }
>

export function CodeBlock({ children, className, compact = false, ...props }: CodeBlockProps) {
  const filename = props['data-filename']
  const language = props['data-language']
  const isFigure = props['data-rehype-pretty-code-figure'] !== undefined

  const rootRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  async function copy() {
    const text = rootRef.current?.querySelector('pre')?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <figure
      ref={rootRef}
      className={cn(
        'docs-code group relative my-5',
        compact && 'docs-code-compact',
        filename && 'docs-code-has-header',
        className,
      )}
    >
      {filename && (
        <div
          className={cn(
            'docs-code-header relative flex items-center gap-1.5 rounded-t-md border border-border border-b-0 bg-background pe-12',
            compact ? 'px-3 py-1.5' : 'px-4 py-3',
          )}
        >
          <Icon
            name={iconForFilename(filename)}
            className="size-4 shrink-0 text-muted-foreground"
          />
          <span className={cn('truncate text-highlighted', compact ? 'text-xs' : 'text-sm/6')}>
            {filename}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code'}
        className={cn(
          'absolute z-10 inline-flex items-center justify-center rounded-full border border-border bg-background text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
          compact ? 'end-2 top-1.5 size-6' : 'end-[11px] top-[11px] size-7',
        )}
      >
        {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
      </button>

      {isFigure ? (
        children
      ) : (
        <pre
          data-language={language}
          className={cn('overflow-x-auto font-mono', compact ? 'text-xs/5' : 'text-sm/6')}
        >
          {children}
        </pre>
      )}
    </figure>
  )
}
