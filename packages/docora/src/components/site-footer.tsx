'use client'

import Link from 'next/link'

import { useDocsConfig } from '../config/context'
import { cn } from '../utils/cn'

export function SiteFooter({ className }: { className?: string }) {
  const config = useDocsConfig()
  const credits = config.footer?.credits
  const links = config.footer?.links ?? []

  if (!credits && links.length === 0) return null

  return (
    <footer className={cn('border-t border-border', className)}>
      <div className="mx-auto flex w-full max-w-8xl flex-col items-center gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        {credits && <p>{credits}</p>}

        {links.length > 0 && (
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-4">
            {links.map(link => {
              const external = link.external ?? link.href.startsWith('http')

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </footer>
  )
}
