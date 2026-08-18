'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

import { cn } from '../utils/cn'

/**
 * Search trigger.
 *
 * Phase 1 ships the affordance only — the index and the command palette are
 * built in Phase 4, so the button announces itself as unavailable rather than
 * pretending to work.
 */
export function SearchButton({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  const [modifier, setModifier] = useState('CTRL')

  useEffect(() => {
    if (navigator.platform.toLowerCase().includes('mac')) setModifier('⌘')
  }, [])

  if (iconOnly) {
    return (
      <button
        type="button"
        disabled
        aria-label="Search"
        title="Search arrives in a later phase"
        className={cn(
          'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-elevated hover:text-highlighted disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
      >
        <Search className="size-4" />
      </button>
    )
  }

  return (
    <button
      type="button"
      disabled
      title="Search arrives in a later phase"
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground transition-colors hover:border-border-accented disabled:cursor-not-allowed disabled:opacity-70',
        className,
      )}
    >
      <Search className="size-4 shrink-0 text-dimmed" />
      <span>Search...</span>
      <kbd className="ml-auto rounded border border-border bg-elevated px-1.5 py-0.5 font-sans text-[10px] font-medium text-dimmed">
        {modifier}
      </kbd>
      <kbd className="rounded border border-border bg-elevated px-1.5 py-0.5 font-sans text-[10px] font-medium text-dimmed">
        K
      </kbd>
    </button>
  )
}
