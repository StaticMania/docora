'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { PageSurround } from '../content/types'
import { useMessages } from '../i18n/context'
import { cn } from '../utils/cn'

/** Previous / next links at the foot of a document. */
export function DocsPager({ prev, next, className }: PageSurround & { className?: string }) {
  const messages = useMessages()

  if (!prev && !next) return null

  return (
    <nav aria-label="Pagination" className={cn('mt-12 grid gap-4 border-t border-border pt-6 sm:grid-cols-2', className)}>
      {prev?.href ? (
        <Link
          href={prev.href}
          className="group flex flex-col gap-1 rounded-md border border-border p-4 transition-colors hover:border-border-accented"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ChevronLeft className="size-3" aria-hidden />
            {messages.previous}
          </span>
          <span className="truncate font-medium text-highlighted transition-colors group-hover:text-primary">
            {prev.label}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next?.href && (
        <Link
          href={next.href}
          className="group flex flex-col gap-1 rounded-md border border-border p-4 text-end transition-colors hover:border-border-accented sm:col-start-2"
        >
          <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
            {messages.next}
            <ChevronRight className="size-3" aria-hidden />
          </span>
          <span className="truncate font-medium text-highlighted transition-colors group-hover:text-primary">
            {next.label}
          </span>
        </Link>
      )}
    </nav>
  )
}
