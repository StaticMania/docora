'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { useDocsConfig } from '../config/context'
import { cn } from '../utils/cn'
import { BrandMark } from './brand'
import { LanguageSwitcher } from './language-switcher'
import { MobileNav } from './mobile-nav'
import { SearchButton } from './search-button'
import { SocialIcon, socialLabels } from './social-icon'
import { ThemeToggle } from './theme-toggle'

export type SiteHeaderProps = Readonly<{
  children?: ReactNode
  logo?: ReactNode
  cta?: ReactNode
  className?: string
}>

function Logo() {
  const config = useDocsConfig()
  const title = config.header?.title ?? config.site.name

  return (
    <Link href="/" className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-70">
      <BrandMark priority />
      <span className="font-semibold tracking-tight whitespace-nowrap">{title}</span>
    </Link>
  )
}

export function SiteHeader({ children, logo, cta, className }: SiteHeaderProps) {
  const config = useDocsConfig()
  const pathname = usePathname()

  const links = config.header?.links ?? []
  const socials = Object.entries(config.socials ?? {}).filter(([, url]) => Boolean(url))
  const showSearch = config.header?.search !== false
  const searchPosition = config.header?.searchPosition ?? 'center'
  const showThemeToggle = !config.colorMode?.forced

  return (
    <header
      className={cn(
        'sticky top-0 z-40 box-border h-16 w-full border-b border-border bg-background/80 backdrop-blur-sm',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto flex h-full w-full max-w-8xl items-center gap-3 px-4 sm:px-6',
          showSearch &&
            searchPosition === 'center' &&
            'md:grid md:grid-cols-[1fr_minmax(0,28rem)_1fr]',
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <MobileNav />
          {logo ?? <Logo />}

          {links.length > 0 && (
            <nav
              aria-label="Main"
              className="ml-4 hidden min-w-0 items-center gap-4 overflow-x-auto lg:flex scrollbar-none"
            >
              {links.map(link => {
                const external = link.external ?? link.href.startsWith('http')
                const isActive =
                  !external && (pathname === link.href || pathname.startsWith(`${link.href}/`))

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className={cn(
                      'text-sm whitespace-nowrap shrink-0 transition-colors',
                      isActive
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          )}

          {cta}
        </div>

        {showSearch && searchPosition === 'center' && (
          <div className="hidden h-full items-center justify-center md:flex">
            <SearchButton className="w-full" />
          </div>
        )}

        <div
          className={cn(
            'flex shrink-0 items-center justify-end gap-1',
            showSearch && searchPosition === 'center' ? 'ml-auto md:ml-0' : 'ml-auto',
          )}
        >
          {showSearch && searchPosition === 'right' && (
            <SearchButton className="me-1 hidden md:inline-flex w-52 lg:w-60" />
          )}
          {showSearch && <SearchButton className="md:hidden" iconOnly />}
          {children}

          {socials.map(([network, url]) => (
            <Link
              key={network}
              href={url ?? ''}
              target="_blank"
              rel="noreferrer"
              aria-label={socialLabels[network] ?? network}
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-elevated hover:text-highlighted"
            >
              <SocialIcon network={network} className="size-4" />
            </Link>
          ))}

          <LanguageSwitcher />
          {showThemeToggle && <ThemeToggle />}
        </div>
      </div>
    </header>
  )
}
