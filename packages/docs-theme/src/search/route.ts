import type { DocsSource } from '../content/index'
import type { I18nConfig } from '../i18n/types'
import { buildSearchIndex } from './build'

/**
 * Route handler serving the search index.
 *
 * ```ts
 * // app/api/search/route.ts
 * import { createSearchRoute } from 'docs-theme'
 * import { source } from '../../../lib/source'
 *
 * export const { GET, dynamic } = createSearchRoute(source)
 * ```
 *
 * `dynamic: 'force-static'` makes Next prerender it, so the index is a static
 * file in production and rebuilt per request in development.
 */
export function createSearchRoute(source: DocsSource, i18n?: I18nConfig) {
  return {
    dynamic: 'force-static' as const,
    async GET() {
      const index = await buildSearchIndex(source, i18n)

      return Response.json(index, {
        headers: { 'cache-control': 'public, max-age=0, must-revalidate' },
      })
    },
  }
}
