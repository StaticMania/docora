'use client'

import Link from 'next/link'
import {
  Children,
  isValidElement,
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'

import { highlightCode } from '../assistant/highlight'
import { CodeBlock } from '../mdc/code-block'
import { cn } from '../utils/cn'

type FenceProps = {
  className?: string
  children?: ReactNode
  'data-filename'?: string
  'data-language'?: string
}

/**
 * Close an unterminated fence so streaming answers still render as a code
 * block instead of leaking raw backticks onto the page.
 */
export function stabilizeMarkdown(source: string): string {
  const fences = source.match(/^ {0,3}(`{3,}|~{3,})/gm) ?? []
  return fences.length % 2 === 1 ? `${source}\n\`\`\`` : source
}

/** Copy ` ```ts [docs.config.ts] ` filenames onto the hast node for the fence. */
function remarkFenceMeta() {
  return (tree: { type: string }) => {
    visit(
      tree,
      'code',
      (node: {
        lang?: string | null
        meta?: string | null
        data?: { hProperties?: Record<string, string> }
      }) => {
        const meta = node.meta ?? ''
        const open = meta.indexOf('[')
        const close = meta.indexOf(']')
        const filename = open >= 0 && close > open ? meta.slice(open + 1, close) : undefined
        const language = node.lang ?? undefined

        if (!filename && !language) return

        node.data ??= {}
        node.data.hProperties = {
          ...node.data.hProperties,
          ...(language ? { 'data-language': language } : {}),
          ...(filename ? { 'data-filename': filename } : {}),
        }
      },
    )
  }
}

function textOf(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

function ChatLink({ href = '', className, ...props }: ComponentProps<'a'>) {
  const classes = cn(
    'font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary',
    className,
  )

  if (href.startsWith('/')) {
    return <Link href={href} className={classes} {...props} />
  }

  return (
    <a
      href={href}
      className={classes}
      {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...props}
    />
  )
}

function ChatFence({
  language,
  filename,
  code,
}: Readonly<{ language?: string; filename?: string; code: string }>) {
  const [html, setHtml] = useState<string>()

  useEffect(() => {
    let cancelled = false
    const handle = window.setTimeout(() => {
      highlightCode(code, language ?? 'text')
        .then(result => {
          if (!cancelled) setHtml(result)
        })
        .catch(() => {
          if (!cancelled) setHtml(undefined)
        })
    }, 80)

    return () => {
      cancelled = true
      window.clearTimeout(handle)
    }
  }, [code, language])

  return (
    <CodeBlock
      compact
      className="my-2"
      data-filename={filename}
      data-language={language}
      {...(html ? { 'data-rehype-pretty-code-figure': '' } : {})}
    >
      {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <code>{code}</code>}
    </CodeBlock>
  )
}

function Fence({ children }: ComponentProps<'pre'>) {
  const child = Children.toArray(children)[0]

  if (isValidElement<FenceProps>(child)) {
    const { className, children: nested, ...rest } = child.props
    const language = rest['data-language'] ?? /language-([^\s]+)/.exec(className ?? '')?.[1]
    const filename = rest['data-filename']
    const code = textOf(nested).replace(/\n$/, '')

    return <ChatFence language={language} filename={filename} code={code} />
  }

  return <ChatFence code={textOf(children)} />
}

const markdownComponents = {
  h1: ({ className, ...props }: ComponentProps<'h1'>) => (
    <h1
      className={cn('mt-4 mb-2 text-base font-semibold text-highlighted', className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: ComponentProps<'h2'>) => (
    <h2 className={cn('mt-4 mb-2 text-sm font-semibold text-highlighted', className)} {...props} />
  ),
  h3: ({ className, ...props }: ComponentProps<'h3'>) => (
    <h3
      className={cn('mt-3 mb-1.5 text-sm font-semibold text-highlighted', className)}
      {...props}
    />
  ),
  h4: ({ className, ...props }: ComponentProps<'h4'>) => (
    <h4
      className={cn('mt-3 mb-1.5 text-sm font-semibold text-highlighted', className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentProps<'p'>) => (
    <p className={cn('my-2 text-sm/6', className)} {...props} />
  ),
  ul: ({ className, ...props }: ComponentProps<'ul'>) => (
    <ul className={cn('my-2 ml-5 list-disc space-y-0.5', className)} {...props} />
  ),
  ol: ({ className, ...props }: ComponentProps<'ol'>) => (
    <ol className={cn('my-2 ml-5 list-decimal space-y-0.5', className)} {...props} />
  ),
  li: ({ className, ...props }: ComponentProps<'li'>) => (
    <li className={cn('text-sm/6 marker:text-muted-foreground', className)} {...props} />
  ),
  strong: ({ className, ...props }: ComponentProps<'strong'>) => (
    <strong className={cn('font-semibold text-highlighted', className)} {...props} />
  ),
  em: ({ className, ...props }: ComponentProps<'em'>) => (
    <em className={cn('italic', className)} {...props} />
  ),
  a: ChatLink,
  blockquote: ({ className, ...props }: ComponentProps<'blockquote'>) => (
    <blockquote
      className={cn(
        'my-2 border-s-2 border-primary/40 ps-3 text-muted-foreground italic',
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: ComponentProps<'hr'>) => (
    <hr className={cn('my-4 border-border', className)} {...props} />
  ),
  table: ({ className, ...props }: ComponentProps<'table'>) => (
    <div className="my-2 w-full overflow-x-auto">
      <table className={cn('w-full border-collapse text-xs', className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }: ComponentProps<'th'>) => (
    <th
      className={cn(
        'border border-border bg-muted px-2 py-1 text-left font-semibold text-highlighted',
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: ComponentProps<'td'>) => (
    <td className={cn('border border-border px-2 py-1', className)} {...props} />
  ),
  pre: Fence,
  code: ({ className, children, ...props }: ComponentProps<'code'> & FenceProps) => {
    if (className || props['data-language']) {
      return (
        <code
          className={className}
          data-filename={props['data-filename']}
          data-language={props['data-language']}
        >
          {children}
        </code>
      )
    }

    return (
      <code className="rounded-sm border border-border bg-muted px-1 py-0.5 font-mono text-[0.85em] text-highlighted">
        {children}
      </code>
    )
  },
}

/**
 * Renders an assistant answer as Markdown — lists, emphasis, links and
 * highlighted fences — compact enough for the chat panel.
 */
export function AssistantMarkdown({ text }: Readonly<{ text: string }>) {
  return (
    <div className="docs-assistant-md text-sm/6 text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <Markdown remarkPlugins={[remarkGfm, remarkFenceMeta]} components={markdownComponents}>
        {stabilizeMarkdown(text)}
      </Markdown>
    </div>
  )
}
