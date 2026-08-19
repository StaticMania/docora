'use client'

import { useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'

import { Icon } from '../components/icon'
import { iconForFilename } from '../mdx/code-meta'
import { cn } from '../utils/cn'

export interface CodeBlockProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
  /** Set from `[filename]` / `title="…"` in the fence meta. */
  'data-filename'?: string
  'data-language'?: string
  'data-line-numbers'?: string
  'data-rehype-pretty-code-figure'?: string
}

/**
 * Wraps every highlighted fence: optional filename header, copy button, and
 * the markup rehype-pretty-code produced.
 */
export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
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
    } catch {
      // Clipboard access can be denied; leaving the button idle is enough.
    }
  }

  return (
    <figure
      ref={rootRef}
      className={cn('docs-code group relative my-5', filename && 'docs-code-has-header', className)}
    >
      {filename && (
        <div className="docs-code-header relative flex items-center gap-1.5 rounded-t-md border border-border border-b-0 bg-background px-4 py-3 pe-12">
          <Icon name={iconForFilename(filename)} className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm/6 text-highlighted">{filename}</span>
        </div>
      )}

      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code'}
        className="absolute end-[11px] top-[11px] z-10 inline-flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
      </button>

      {isFigure ? (
        children
      ) : (
        <pre data-language={language} className="overflow-x-auto font-mono text-sm/6">
          {children}
        </pre>
      )}
    </figure>
  )
}
