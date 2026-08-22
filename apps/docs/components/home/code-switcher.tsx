'use client'
import { Icon, cn } from 'docora'
import { useState, type ReactNode } from 'react'

export type CodeSwitcherFile = Readonly<{
  name: string
  icon: string
  node: ReactNode
}>

export type CodeSwitcherProps = Readonly<{
  files: readonly CodeSwitcherFile[]
  className?: string
}>

export function CodeSwitcher({ files, className }: CodeSwitcherProps) {
  const [active, setActive] = useState(0)

  if (files.length === 0) return null

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-background lg:flex',
        className,
      )}
    >
      <div className="shrink-0 border-b border-border bg-muted/60 p-2.5 lg:w-56 lg:border-e lg:border-b-0">
        <p className="px-2.5 pt-1 pb-2 text-xs font-medium tracking-wide text-dimmed uppercase">
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
                'inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-start text-sm transition-colors lg:w-full',
                index === active
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-elevated hover:text-highlighted',
              )}
            >
              <Icon name={file.icon} className="size-4 shrink-0" />
              <span className="truncate font-mono">{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0 flex-1 [&_.docs-code]:my-0 [&_.docs-code-header]:hidden [&_.docs-code_pre]:min-h-[19rem] [&_.docs-code_pre]:rounded-none [&_.docs-code_pre]:border-0 [&_.docs-code_pre]:bg-transparent [&_.docs-code_pre]:text-base [&_.docs-code_pre]:leading-7">
        {files[active]?.node}
      </div>
    </div>
  )
}
