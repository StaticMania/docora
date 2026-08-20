import type { ReactNode } from 'react'
import { cn, compileMdx } from 'docora'

/** Strips the standalone code-block chrome so a fence can sit inside a window. */
export const bareCode =
  '[&_.docs-code]:my-0 [&_.docs-code-header]:hidden [&_.docs-code_pre]:rounded-none [&_.docs-code_pre]:border-0 [&_.docs-code_pre]:bg-transparent'

/**
 * Runs a snippet through the same Shiki pipeline the docs use, so the marketing
 * page and the documentation highlight code identically.
 */
export async function highlight(code: string, lang = 'tsx'): Promise<ReactNode> {
  const trimmed = code.replace(/^\n+|\n+$/g, '')
  // Outrun any fence inside the snippet itself.
  const longest = Math.max(2, ...[...trimmed.matchAll(/^`{3,}/gm)].map(match => match[0].length))
  const fence = '`'.repeat(longest + 1)

  const { content } = await compileMdx(`${fence}${lang}\n${trimmed}\n${fence}`)
  return content
}

export type WindowProps = Readonly<{
  children?: ReactNode
  /** Shown next to the traffic lights. */
  filename?: string
  tabs?: readonly string[]
  actions?: ReactNode
  className?: string
  bodyClassName?: string
}>

/** Editor-style frame: traffic lights, an optional filename, then the body. */
export function Window({
  children,
  filename,
  tabs,
  actions,
  className,
  bodyClassName,
}: WindowProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-background shadow-xl shadow-black/5 dark:shadow-black/30',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-border-accented" />
          <span className="size-2.5 rounded-full bg-border-accented" />
          <span className="size-2.5 rounded-full bg-border-accented" />
        </span>

        {filename && (
          <span className="ms-2 truncate font-mono text-xs text-muted-foreground">{filename}</span>
        )}

        {tabs && tabs.length > 0 && (
          <span className="ms-2 flex min-w-0 items-center gap-1">
            {tabs.map((tab, index) => (
              <span
                key={tab}
                className={cn(
                  'truncate rounded-full px-2.5 py-1 font-mono text-[0.7rem]',
                  index === 0 ? 'bg-elevated text-highlighted' : 'text-dimmed',
                )}
              >
                {tab}
              </span>
            ))}
          </span>
        )}

        {actions && <span className="ms-auto flex items-center gap-1.5">{actions}</span>}
      </div>

      <div className={cn('min-w-0', bodyClassName)}>{children}</div>
    </div>
  )
}

export type CodeWindowProps = Readonly<{
  code: string
  lang?: string
  filename?: string
  className?: string
  bodyClassName?: string
}>

/** A `Window` whose body is a single highlighted fence. */
export async function CodeWindow({
  code,
  lang = 'tsx',
  filename,
  className,
  bodyClassName,
}: CodeWindowProps) {
  return (
    <Window filename={filename} className={className} bodyClassName={cn(bareCode, bodyClassName)}>
      {await highlight(code, lang)}
    </Window>
  )
}
