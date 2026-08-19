'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { useDocsConfig } from '../config/context'
import type { NavLink } from '../config/types'
import { cn } from '../utils/cn'

function FooterLink({ link }: Readonly<{ link: NavLink }>) {
  const external = link.external ?? link.href.startsWith('http')

  return (
    <Link
      href={link.href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-highlighted"
    >
      {link.label}
      {external && <ArrowUpRight className="size-3.5 text-dimmed" aria-hidden />}
    </Link>
  )
}

function Brand() {
  const config = useDocsConfig()
  const logo = config.header?.logo
  const title = config.header?.title ?? config.site.name

  return (
    <Link href="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-70">
      {logo?.light && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo.light}
          alt={logo.alt ?? title}
          className={cn('h-6 w-auto', logo.dark && 'dark:hidden', logo.className)}
        />
      )}
      {logo?.dark && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo.dark}
          alt={logo.alt ?? title}
          className={cn('hidden h-6 w-auto dark:block', logo.className)}
        />
      )}
      <span className="font-semibold tracking-tight text-highlighted">{title}</span>
    </Link>
  )
}

export function SiteFooter({ className }: Readonly<{ className?: string }>) {
  const config = useDocsConfig()
  const credits = config.footer?.credits
  const links = config.footer?.links ?? []
  const columns = config.footer?.columns ?? []
  const year = new Date().getFullYear()

  if (!credits && links.length === 0 && columns.length === 0) return null

  const groups =
    columns.length > 0
      ? columns
      : links.length > 0
        ? [{ title: undefined as string | undefined, links }]
        : []

  return (
    <footer className={cn('mt-auto border-t border-border bg-muted/40', className)}>
      <div className="mx-auto w-full max-w-8xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-xs">
            <Brand />
            {config.site.description && (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {config.site.description}
              </p>
            )}
          </div>

          {groups.length > 0 && (
            <nav
              aria-label="Footer"
              className={cn(
                'grid gap-8 sm:gap-12',
                groups.length >= 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2',
              )}
            >
              {groups.map(group => (
                <div key={group.title ?? 'links'} className="flex flex-col gap-3">
                  {group.title && (
                    <p className="text-xs font-medium tracking-wide text-dimmed uppercase">
                      {group.title}
                    </p>
                  )}
                  {group.links.map(link => (
                    <FooterLink key={link.href} link={link} />
                  ))}
                </div>
              ))}
            </nav>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-border pt-6 text-xs text-dimmed sm:flex-row sm:justify-between">
          <p>
            © {year} {config.site.name}
          </p>
          {credits && <p>{credits}</p>}
        </div>
      </div>
    </footer>
  )
}
