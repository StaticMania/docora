'use client'

import { createContext, useContext, type ReactNode } from 'react'

import { fallbackDocsConfig } from './define'
import type { DocsConfig } from './types'

const DocsConfigContext = createContext<DocsConfig>(fallbackDocsConfig)

export function DocsConfigProvider({ config, children }: { config: DocsConfig; children: ReactNode }) {
  return <DocsConfigContext.Provider value={config}>{children}</DocsConfigContext.Provider>
}

/** Read the site configuration from any client component inside `DocsRoot`. */
export function useDocsConfig(): DocsConfig {
  return useContext(DocsConfigContext)
}
