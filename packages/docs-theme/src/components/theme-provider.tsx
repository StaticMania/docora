'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'

import type { DocsConfig } from '../config/types'

export function ThemeProvider({
  colorMode,
  children,
}: {
  colorMode?: DocsConfig['colorMode']
  children: ReactNode
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={colorMode?.default ?? 'system'}
      forcedTheme={colorMode?.forced}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
