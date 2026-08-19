'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { useDocsConfig } from '../config/context'
import { cn } from '../utils/cn'
import { MobileNav } from './mobile-nav'
import { SearchButton } from './search-button'
import { LanguageSwitcher } from './language-switcher'
import { SocialIcon, socialLabels } from './social-icon'
import { ThemeToggle } from './theme-toggle'

export type SiteHeaderProps = Readonly<{
  /** Rendered at the far right, before the language and theme controls. */
  children?: ReactNode
  /** Replaces the default logo and site name. */
  logo?: ReactNode
  /** Rendered after the navigation links — a call to action, say. */
  cta?: ReactNode
  className?: string
}>

function Logo() {
  const config = useDocsConfig()
  const logo = config.header?.logo
  const title = config.header?.title ?? config.site.name

  return (
    <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-70">
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
      <span className="font-semibold tracking-tight">{title}</span>
    </Link>
  )
}

export function SiteHeader({ children, logo, cta, className }: SiteHeaderProps) {
  const config = useDocsConfig()
  const pathname = usePathname()

  const links = config.header?.links ?? []
  const socials = Object.entries(config.socials ?? {}).filter(([, url]) => Boolean(url))
  const showSearch = config.header?.search !== false
  const showThemeToggle = !config.colorMode?.forced

  return (
    <header
      className={cn(
        // The border is inside the 4rem so the sticky asides line up with it.
        'sticky top-0 z-40 box-border h-16 w-full border-b border-border bg-background/80 backdrop-blur-sm',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto flex h-full w-full max-w-8xl items-center gap-3 px-4 sm:px-6',
          showSearch && 'md:grid md:grid-cols-[1fr_minmax(0,28rem)_1fr]',
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <MobileNav />
          {logo ?? <Logo />}

          {links.length > 0 && (
            <nav aria-label="Main" className="ml-4 hidden items-center gap-4 lg:flex">
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
                      'text-sm transition-colors',
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

        {showSearch && (
          <div className="hidden h-full items-center justify-center md:flex">
            <SearchButton className="w-full" />
          </div>
        )}

        <div className="ml-auto flex items-center justify-end gap-1 md:ml-0">
          {showSearch && <SearchButton className="md:hidden" iconOnly />}
          {children}

          {socials.map(([network, url]) => (
            <a
              key={network}
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={socialLabels[network] ?? network}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-elevated hover:text-highlighted"
            >
              <SocialIcon network={network} className="size-4" />
            </a>
          ))}

          <LanguageSwitcher />
          {showThemeToggle && <ThemeToggle />}
        </div>
      </div>
    </header>
  )
}
