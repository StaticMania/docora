import type { DocsConfig } from './types'

/**
 * Identity helper that gives `docs.config.ts` its types.
 *
 * ```ts
 * export default defineDocsConfig({ site: { name: 'Acme' } })
 * ```
 */
export function defineDocsConfig(config: DocsConfig): DocsConfig {
  return config
}

/** Used when a `DocsRoot` is mounted without a config. */
export const fallbackDocsConfig: DocsConfig = {
  site: { name: 'Documentation' },
}
