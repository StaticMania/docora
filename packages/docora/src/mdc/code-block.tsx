'use client'

import { useRef, useState, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'

import { Icon } from '../components/icon'
import { iconForFilename } from '../mdx/code-meta'
import { cn } from '../utils/cn'

export interface CodeBlockProps {
  children?: ReactNode
  /** Set by the Shiki transformer from `[filename]` in the fence meta. */
  'data-filename'?: string
  'data-language'?: string
  'data-line-numbers'?: string
  className?: string
}

/**
 * Wraps every highlighted fence: optional filename header, copy button, and
 * the `<pre>` Shiki produced.
 */
export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const filename = props['data-filename']
  const language = props['data-language']
  const lineNumbers = props['data-line-numbers'] === 'true'

  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  async function copy() {
    const text = preRef.current?.textContent ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be denied; leaving the button idle is enough.
    }
  }

  return (
    <div className="group relative my-5 overflow-hidden rounded-md border border-border bg-muted">
      {filename && (
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-xs text-muted-foreground">
          <Icon name={iconForFilename(filename)} className="size-3.5 shrink-0 text-dimmed" />
          <span className="truncate font-mono">{filename}</span>
        </div>
      )}

      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code'}
        className="absolute end-2 z-10 inline-flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        style={{ top: filename ? '2.6rem' : '0.5rem' }}
      >
        {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
      </button>

      <pre
        ref={preRef}
        data-language={language}
        className={cn(
          'overflow-x-auto p-4 font-mono text-sm leading-6',
          lineNumbers && 'docs-line-numbers',
          className,
        )}
      >
        {children}
      </pre>
    </div>
  )
}
