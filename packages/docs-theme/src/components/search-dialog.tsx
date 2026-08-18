'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog } from 'radix-ui'
import { FileText, Hash, Search } from 'lucide-react'

import { headingSlug, searchDocuments, type SearchResult } from '../search/match'
import type { SearchIndex } from '../search/types'
import { cn } from '../utils/cn'

export interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where the index is served from. */
  endpoint?: string
}

function resultHref(result: SearchResult): string {
  return result.heading ? `${result.document.path}#${headingSlug(result.heading.text)}` : result.document.path
}

export function SearchDialog({ open, onOpenChange, endpoint = '/api/search' }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<SearchIndex>()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  // Fetch once, the first time the dialog is opened.
  useEffect(() => {
    if (!open || index || status === 'loading') return

    setStatus('loading')
    fetch(endpoint)
      .then(response => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: SearchIndex) => {
        setIndex(data)
        setStatus('idle')
      })
      .catch(() => setStatus('error'))
  }, [open, index, status, endpoint])

  const results = useMemo(
    () => (index ? searchDocuments(index.documents, query) : []),
    [index, query],
  )

  useEffect(() => setActive(0), [query])

  const go = useCallback(
    (result: SearchResult) => {
      onOpenChange(false)
      setQuery('')
      router.push(resultHref(result))
    },
    [onOpenChange, router],
  )

  function onKeyDown(event: React.KeyboardEvent) {
    if (results.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive(current => (current + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive(current => (current - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const result = results[active]
      if (result) go(result)
    }
  }

  // Keep the highlighted row in view while arrowing through.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]" />

        <Dialog.Content
          onKeyDown={onKeyDown}
          className="fixed top-[12vh] left-1/2 z-50 flex max-h-[70vh] w-[92vw] max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-lg border border-border bg-background shadow-2xl focus:outline-none"
        >
          <Dialog.Title className="sr-only">Search documentation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Type to search. Use the arrow keys to move between results and Enter to open one.
          </Dialog.Description>

          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="size-4 shrink-0 text-dimmed" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search documentation..."
              aria-label="Search documentation"
              className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-dimmed focus:outline-none"
            />
          </div>

          <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-2">
            {status === 'loading' && <p className="p-4 text-sm text-muted-foreground">Loading index…</p>}

            {status === 'error' && (
              <p className="p-4 text-sm text-destructive">Could not load the search index.</p>
            )}

            {status === 'idle' && query && results.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                No results for <span className="text-highlighted">{query}</span>
              </p>
            )}

            {results.map((result, position) => (
              <button
                key={resultHref(result)}
                type="button"
                data-active={position === active}
                onMouseEnter={() => setActive(position)}
                onClick={() => go(result)}
                className={cn(
                  'flex w-full items-start gap-2.5 rounded-md px-3 py-2 text-start transition-colors',
                  position === active ? 'bg-elevated' : 'hover:bg-elevated/60',
                )}
              >
                {result.heading ? (
                  <Hash className="mt-0.5 size-4 shrink-0 text-dimmed" aria-hidden />
                ) : (
                  <FileText className="mt-0.5 size-4 shrink-0 text-dimmed" aria-hidden />
                )}

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-highlighted">
                    <span className="truncate">{result.heading?.text ?? result.document.title}</span>
                    {result.document.section && (
                      <span className="shrink-0 text-xs font-normal text-dimmed">
                        {result.document.section}
                      </span>
                    )}
                  </span>

                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {result.excerpt ?? result.document.description ?? result.document.path}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-dimmed">
            <span>
              <kbd className="font-sans">↑</kbd> <kbd className="font-sans">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-sans">↵</kbd> to open
            </span>
            <span>
              <kbd className="font-sans">esc</kbd> to close
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
