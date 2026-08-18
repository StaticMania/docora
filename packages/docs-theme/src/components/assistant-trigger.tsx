'use client'

import { Sparkles } from 'lucide-react'

import { useAssistant } from '../assistant/context'
import { cn } from '../utils/cn'

/** Floating button that opens the assistant. Absent when it is not configured. */
export function AssistantTrigger({ className }: { className?: string }) {
  const { enabled, setOpen } = useAssistant()

  if (!enabled) return null

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(
        'fixed end-4 bottom-4 z-30 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-highlighted shadow-lg transition-colors hover:border-primary/50',
        className,
      )}
    >
      <Sparkles className="size-4 text-primary" aria-hidden />
      Ask AI
    </button>
  )
}

/**
 * Asks the assistant about the page being read. Rendered under the table of
 * contents, mirroring Docus.
 */
export function ExplainWithAi({ className }: { className?: string }) {
  const { enabled, ask } = useAssistant()

  if (!enabled) return null

  return (
    <button
      type="button"
      onClick={() => ask('Explain the page at ' + window.location.pathname)}
      className={cn(
        'flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-highlighted',
        className,
      )}
    >
      <Sparkles className="size-4 shrink-0" aria-hidden />
      Explain with AI
    </button>
  )
}
