'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { SearchDialog } from './search-dialog'

interface SearchContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  enabled: boolean
}

const SearchContext = createContext<SearchContextValue>({
  open: false,
  setOpen: () => {},
  enabled: false,
})

export function useSearch() {
  return useContext(SearchContext)
}

/** Owns the palette and the ⌘K / Ctrl-K shortcut that opens it. */
export function SearchProvider({
  children,
  enabled = true,
  endpoint,
}: Readonly<{
  children: ReactNode
  enabled?: boolean
  endpoint?: string
}>) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!enabled) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(current => !current)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])

  const value = useMemo(() => ({ open, setOpen, enabled }), [open, enabled])

  return (
    <SearchContext.Provider value={value}>
      {children}
      {enabled && <SearchDialog open={open} onOpenChange={setOpen} endpoint={endpoint} />}
    </SearchContext.Provider>
  )
}
