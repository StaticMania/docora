import { readFile } from 'node:fs/promises'

import { tool } from 'ai'
import { z } from 'zod'

import type { DocsConfig } from '../config/types'
import type { DocsSource } from '../content/index'
import { buildSearchIndex } from '../search/build'
import { searchDocuments } from '../search/match'

/**
 * The two tools the assistant answers with.
 *
 * They mirror the MCP server's pair, so an editor connecting over MCP and the
 * in-page chat read the documentation exactly the same way.
 */
export function createAssistantTools(source: DocsSource, config: DocsConfig) {
  return {
    'search-docs': tool({
      description:
        'Search the documentation. Returns matching pages with their path, title and a short excerpt. Use this first, then read promising pages with get-page.',
      inputSchema: z.object({
        query: z.string().describe('Words to search for, e.g. "sidebar icons" or "colour mode".'),
        locale: z.string().optional().describe('Restrict to one locale, e.g. "en".'),
      }),
      async execute({ query, locale }) {
        const index = await buildSearchIndex(source, config.i18n)

        const documents = locale
          ? index.documents.filter(document => document.locale === locale)
          : index.documents

        return {
          results: searchDocuments(documents, query, 8).map(result => ({
            path: result.document.path,
            title: result.document.title,
            section: result.document.section ?? '',
            description: result.document.description ?? '',
            excerpt: result.excerpt ?? '',
          })),
        }
      },
    }),

    'get-page': tool({
      description:
        'Read one documentation page in full, as markdown. Use the exact path from search-docs.',
      inputSchema: z.object({
        path: z.string().describe('Page path, e.g. "/docs/getting-started/installation".'),
      }),
      async execute({ path }) {
        const normalized = path.startsWith('/') ? path : `/${path}`
        const pages = await source.getPages()
        const page = pages.find(candidate => candidate.path === normalized)

        if (!page) {
          return {
            error: `No page at "${normalized}". Use search-docs to find the right path.`,
          }
        }

        return {
          path: page.path,
          title: page.title,
          description: page.frontmatter.description ?? '',
          content: await readFile(page.filePath, 'utf8'),
        }
      },
    }),
  }
}
