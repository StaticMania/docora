'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

import { cn } from '../utils/cn'
import { useMessages } from '../i18n/context'
import { useSearch } from './search-provider'

/** Opens the search palette. Also reachable with the keyboard shortcut. */
export function SearchButton({
  className,
  iconOnly = false,
}: Readonly<{
  className?: string
  iconOnly?: boolean
}>) {
  const { setOpen } = useSearch()
  const messages = useMessages()
  const [modifier, setModifier] = useState('CTRL')

  useEffect(() => {
    if (navigator.platform.toLowerCase().includes('mac')) setModifier('⌘')
  }, [])

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={messages.searchButton}
        className={cn(
          'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-elevated hover:text-highlighted',
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
      onClick={() => setOpen(true)}
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground transition-colors hover:border-border-accented',
        className,
      )}
    >
      <Search className="size-4 shrink-0 text-dimmed" />
      <span>{messages.searchButton}</span>
      <kbd className="ml-auto rounded border border-border bg-elevated px-1.5 py-0.5 font-sans text-[10px] font-medium text-dimmed">
        {modifier}
      </kbd>
      <kbd className="rounded border border-border bg-elevated px-1.5 py-0.5 font-sans text-[10px] font-medium text-dimmed">
        K
      </kbd>
    </button>
  )
}
