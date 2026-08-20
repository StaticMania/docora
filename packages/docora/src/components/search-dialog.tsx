'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Dialog } from 'radix-ui'
import { Check, FileText, Hash, Monitor, Moon, Search, Sun, X } from 'lucide-react'

import { useDocsConfig } from '../config/context'
import type { NavItem } from '../config/types'
import { useLocale, useMessages } from '../i18n/context'
import { headingSlug, searchDocuments, type SearchResult } from '../search/match'
import type { SearchIndex } from '../search/types'
import { cn } from '../utils/cn'
import { Icon } from './icon'

export type SearchDialogProps = Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Where the index is served from. */
  endpoint?: string
}>

type ThemeValue = 'system' | 'light' | 'dark'

type PaletteItem =
  | { kind: 'link'; label: string; href: string; icon?: string }
  | { kind: 'theme'; label: string; value: ThemeValue }
  | { kind: 'result'; result: SearchResult }

function resultHref(result: SearchResult): string {
  return result.heading
    ? `${result.document.path}#${headingSlug(result.heading.text)}`
    : result.document.path
}

/** The first page a nav node opens — itself, or the first descendant with a href. */
function firstHref(item: NavItem): string | undefined {
  if (item.href) return item.href
  if (!item.children) return undefined

  for (const child of item.children) {
    const href = firstHref(child)
    if (href) return href
  }
}

function mainGroupLinks(items: NavItem[]): Extract<PaletteItem, { kind: 'link' }>[] {
  const links: Extract<PaletteItem, { kind: 'link' }>[] = []

  for (const item of items) {
    const href = firstHref(item)
    if (!href) continue
    links.push({ kind: 'link', label: item.label, href, ...(item.icon ? { icon: item.icon } : {}) })
  }

  return links
}

function PaletteRow({
  active,
  onMouseEnter,
  onClick,
  icon,
  label,
  selected,
}: Readonly<{
  active: boolean
  onMouseEnter: () => void
  onClick: () => void
  icon: ReactNode
  label: string
  selected?: boolean
}>) {
  return (
    <button
      type="button"
      data-active={active}
      aria-current={selected ? 'true' : undefined}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-start text-sm text-highlighted transition-colors',
        active ? 'bg-elevated' : 'hover:bg-elevated/60',
      )}
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {selected && <Check className="size-4 shrink-0 text-dimmed" aria-hidden />}
    </button>
  )
}

function PaletteHeading({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p className="px-3 py-1.5 text-[11px] font-medium tracking-wide text-dimmed uppercase">
      {children}
    </p>
  )
}

export function SearchDialog({ open, onOpenChange, endpoint = '/api/search' }: SearchDialogProps) {
  const router = useRouter()
  const messages = useMessages()
  const { locale, i18n } = useLocale()
  const config = useDocsConfig()
  const { theme, setTheme } = useTheme()
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<SearchIndex>()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const showTheme = !config.colorMode?.forced
  const trimmed = query.trim()

  // Fetch once, the first time the dialog is opened.
  useEffect(() => {
    if (!open || index || status === 'loading') return

    setStatus('loading')
    fetch(endpoint)
      .then(response =>
        response.ok ? response.json() : Promise.reject(new Error(String(response.status))),
      )
      .then((data: SearchIndex) => {
        setIndex(data)
        setStatus('idle')
      })
      .catch(() => setStatus('error'))
  }, [open, index, status, endpoint])

  const results = useMemo(() => {
    if (!index) return []

    // With i18n on, results stay inside the locale being read.
    const documents = i18n
      ? index.documents.filter(document => !document.locale || document.locale === locale)
      : index.documents

    return searchDocuments(documents, query)
  }, [index, query, i18n, locale])

  const groupLinks = useMemo(() => mainGroupLinks(config.navigation ?? []), [config.navigation])

  const themeItems = useMemo((): Extract<PaletteItem, { kind: 'theme' }>[] => {
    if (!showTheme) return []

    return [
      { kind: 'theme', label: messages.themeSystem, value: 'system' },
      { kind: 'theme', label: messages.themeLight, value: 'light' },
      { kind: 'theme', label: messages.themeDark, value: 'dark' },
    ]
  }, [messages.themeDark, messages.themeLight, messages.themeSystem, showTheme])

  const items = useMemo((): PaletteItem[] => {
    if (trimmed) return results.map(result => ({ kind: 'result' as const, result }))
    return [...groupLinks, ...themeItems]
  }, [groupLinks, results, themeItems, trimmed])

  useEffect(() => {
    if (!open) setQuery('')
    setActive(0)
  }, [open, query])

  const close = useCallback(() => {
    setQuery('')
    onOpenChange(false)
  }, [onOpenChange])

  const go = useCallback(
    (href: string) => {
      close()
      router.push(href)
    },
    [close, router],
  )

  const run = useCallback(
    (item: PaletteItem | undefined) => {
      if (!item) return
      if (item.kind === 'link') go(item.href)
      else if (item.kind === 'theme') {
        setTheme(item.value)
        close()
      } else {
        go(resultHref(item.result))
      }
    },
    [close, go, setTheme],
  )

  function onKeyDown(event: React.KeyboardEvent) {
    if (items.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive(current => (current + 1) % items.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive(current => (current - 1 + items.length) % items.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      run(items[active])
    }
  }

  // Keep the highlighted row in view while arrowing through.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const searching = Boolean(trimmed)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]" />

        <Dialog.Content
          onKeyDown={onKeyDown}
          className="fixed top-[12vh] left-1/2 z-50 flex max-h-[70vh] w-[92vw] max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-lg border border-border bg-background shadow-2xl focus:outline-none"
        >
          <Dialog.Title className="sr-only">{messages.searchPlaceholder}</Dialog.Title>
          <Dialog.Description className="sr-only">
            Type to search. Use the arrow keys to move between results and Enter to open one.
          </Dialog.Description>

          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="size-4 shrink-0 text-dimmed" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={messages.searchPlaceholder}
              aria-label={messages.searchPlaceholder}
              className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-dimmed focus:outline-none"
            />
            <Dialog.Close
              aria-label={messages.close}
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-dimmed transition-colors hover:bg-elevated hover:text-highlighted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-2">
            {searching ? (
              <>
                {status === 'loading' && (
                  <p className="p-4 text-sm text-muted-foreground">{messages.searchLoading}</p>
                )}

                {status === 'error' && (
                  <p className="p-4 text-sm text-destructive">{messages.searchError}</p>
                )}

                {status === 'idle' && results.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground">
                    {messages.searchEmpty} <span className="text-highlighted">{query}</span>
                  </p>
                )}

                {results.map((result, position) => (
                  <button
                    key={resultHref(result)}
                    type="button"
                    data-active={position === active}
                    onMouseEnter={() => setActive(position)}
                    onClick={() => go(resultHref(result))}
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
                        <span className="truncate">
                          {result.heading?.text ?? result.document.title}
                        </span>
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
              </>
            ) : (
              <>
                {groupLinks.length > 0 && (
                  <div>
                    <PaletteHeading>{messages.searchLinks}</PaletteHeading>
                    {groupLinks.map((item, position) => (
                      <PaletteRow
                        key={item.href}
                        active={position === active}
                        onMouseEnter={() => setActive(position)}
                        onClick={() => go(item.href)}
                        icon={
                          item.icon ? (
                            <Icon name={item.icon} className="size-4 shrink-0 text-dimmed" />
                          ) : (
                            <FileText className="size-4 shrink-0 text-dimmed" aria-hidden />
                          )
                        }
                        label={item.label}
                      />
                    ))}
                  </div>
                )}

                {themeItems.length > 0 && (
                  <div className={cn(groupLinks.length > 0 && 'mt-1 border-t border-border pt-1')}>
                    <PaletteHeading>{messages.searchTheme}</PaletteHeading>
                    {themeItems.map((item, index) => {
                      const position = groupLinks.length + index
                      const iconClass = 'size-4 shrink-0 text-dimmed'

                      return (
                        <PaletteRow
                          key={item.value}
                          active={position === active}
                          selected={theme === item.value}
                          onMouseEnter={() => setActive(position)}
                          onClick={() => {
                            setTheme(item.value)
                            close()
                          }}
                          icon={
                            item.value === 'system' ? (
                              <Monitor className={iconClass} aria-hidden />
                            ) : item.value === 'light' ? (
                              <Sun className={iconClass} aria-hidden />
                            ) : (
                              <Moon className={iconClass} aria-hidden />
                            )
                          }
                          label={item.label}
                        />
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-dimmed">
            <span>
              <kbd className="font-sans">↑</kbd> <kbd className="font-sans">↓</kbd>{' '}
              {messages.searchNavigate}
            </span>
            <span>
              <kbd className="font-sans">↵</kbd> {messages.searchOpen}
            </span>
            <span>
              <kbd className="font-sans">esc</kbd> {messages.searchClose}
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
