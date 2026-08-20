'use client'

import { useState, type ReactNode } from 'react'
import { Icon, cn } from 'docora'

export type CodeSwitcherFile = Readonly<{
  name: string
  icon: string
  /** Pre-highlighted on the server and handed down as a node. */
  node: ReactNode
}>

export type CodeSwitcherProps = Readonly<{
  files: readonly CodeSwitcherFile[]
  className?: string
}>

/** File rail on the left, the selected file's source on the right. */
export function CodeSwitcher({ files, className }: CodeSwitcherProps) {
  const [active, setActive] = useState(0)

  if (files.length === 0) return null

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-background shadow-xl shadow-black/5 lg:flex dark:shadow-black/30',
        className,
      )}
    >
      <div className="shrink-0 border-b border-border bg-muted/60 p-2.5 lg:w-72 lg:border-e lg:border-b-0">
        <p className="px-2.5 pt-1 pb-2 text-[0.7rem] font-medium tracking-wide text-dimmed uppercase">
          Your project
        </p>

        <div className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
          {files.map((file, index) => (
            <button
              key={file.name}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={index === active}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-start text-xs transition-colors lg:w-full',
                index === active
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-elevated hover:text-highlighted',
              )}
            >
              <Icon name={file.icon} className="size-3.5 shrink-0" />
              <span className="truncate font-mono">{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0 flex-1 [&_.docs-code]:my-0 [&_.docs-code-header]:hidden [&_.docs-code_pre]:min-h-[19rem] [&_.docs-code_pre]:rounded-none [&_.docs-code_pre]:border-0 [&_.docs-code_pre]:bg-transparent">
        {files[active]?.node}
      </div>
    </div>
  )
}
