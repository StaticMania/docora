import type { ReactNode } from 'react'

import { DocsConfigProvider } from '../config/context'
import { fallbackDocsConfig } from '../config/define'
import type { DocsConfig, NavItem } from '../config/types'
import { RouteProgress } from '../components/route-progress'
import { SearchProvider } from '../components/search-provider'
import { I18nProvider } from '../i18n/context'
import { ThemeProvider } from '../components/theme-provider'
import { docsFont } from '../font'
import { cn } from '../utils/cn'

export interface DocsRootProps {
  children: ReactNode
  /** Site configuration, usually the default export of `docs.config.ts`. */
  config?: DocsConfig
  /**
   * Sidebar tree, normally built from the content directory. Overrides
   * `config.navigation` when given.
   */
  navigation?: NavItem[]
  /** Active locale. Sets `<html lang>` and picks the interface strings. */
  locale?: string
  className?: string
  bodyClassName?: string
}

/**
 * The `<html>` / `<body>` shell for a docs site.
 *
 * Mounts the colour-mode and configuration providers, so everything the theme
 * renders below can read the site config.
 */
export function DocsRoot({
  children,
  config = fallbackDocsConfig,
  navigation,
  locale,
  className,
  bodyClassName,
}: DocsRootProps) {
  const resolvedConfig = navigation ? { ...config, navigation } : config
  const activeLocale = locale ?? config.i18n?.defaultLocale ?? config.site.locale ?? 'en'
  const direction = config.i18n?.locales.find(entry => entry.code === activeLocale)?.dir

  return (
    <html
      lang={activeLocale}
      {...(direction ? { dir: direction } : {})}
      className={cn(docsFont.variable, className)}
      suppressHydrationWarning
    >
      <body className={cn('min-h-svh bg-background font-sans text-foreground antialiased', bodyClassName)}>
        <ThemeProvider colorMode={config.colorMode}>
          <DocsConfigProvider config={resolvedConfig}>
            <I18nProvider locale={activeLocale} i18n={config.i18n}>
            <SearchProvider
              enabled={config.search?.enabled !== false}
              endpoint={config.search?.endpoint}
            >
              {config.loadingIndicator?.enabled !== false && (
                <RouteProgress color={config.loadingIndicator?.color} height={config.loadingIndicator?.height} />
              )}
              {children}
            </SearchProvider>
            </I18nProvider>
          </DocsConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
