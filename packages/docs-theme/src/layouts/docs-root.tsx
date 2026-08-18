import type { ReactNode } from 'react'

import { DocsConfigProvider } from '../config/context'
import { fallbackDocsConfig } from '../config/define'
import type { DocsConfig } from '../config/types'
import { RouteProgress } from '../components/route-progress'
import { ThemeProvider } from '../components/theme-provider'
import { docsFont } from '../font'
import { cn } from '../utils/cn'

export interface DocsRootProps {
  children: ReactNode
  /** Site configuration, usually the default export of `docs.config.ts`. */
  config?: DocsConfig
  className?: string
  bodyClassName?: string
}

/**
 * The `<html>` / `<body>` shell for a docs site.
 *
 * Mounts the colour-mode and configuration providers, so everything the theme
 * renders below can read the site config.
 */
export function DocsRoot({ children, config = fallbackDocsConfig, className, bodyClassName }: DocsRootProps) {
  return (
    <html lang={config.site.locale ?? 'en'} className={cn(docsFont.variable, className)} suppressHydrationWarning>
      <body className={cn('min-h-svh bg-background font-sans text-foreground antialiased', bodyClassName)}>
        <ThemeProvider colorMode={config.colorMode}>
          <DocsConfigProvider config={config}>
            {config.loadingIndicator?.enabled !== false && (
              <RouteProgress color={config.loadingIndicator?.color} height={config.loadingIndicator?.height} />
            )}
            {children}
          </DocsConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
