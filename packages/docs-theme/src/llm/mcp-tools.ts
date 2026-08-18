import { readFile } from 'node:fs/promises'

import type { DocsConfig } from '../config/types'
import type { DocsSource } from '../content/index'
import { localeFromPath } from '../i18n/paths'

export interface McpTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  annotations?: Record<string, unknown>
  handler: (args: Record<string, unknown>) => Promise<unknown>
}

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
}

function pageUrl(config: DocsConfig, path: string): string {
  return config.site.url ? new URL(path, config.site.url).toString() : path
}

/**
 * The two tools an agent needs to read a documentation site: find the page,
 * then read it. Descriptions spell out when to reach for each, since that is
 * what the model actually plans against.
 */
export function createMcpTools(source: DocsSource, config: DocsConfig): McpTool[] {
  return [
    {
      name: 'list-pages',
      description: [
        'Lists every documentation page with its title, path and description.',
        '',
        'WHEN TO USE: when exploring what the documentation covers, or when you do',
        'not know the exact path of a page. Start here for open-ended questions.',
        '',
        'WHEN NOT TO USE: if you already know the exact path, call get-page instead.',
        '',
        'WORKFLOW: pick the relevant path from the result, then call get-page for its',
        'full contents.',
      ].join('\n'),
      annotations: READ_ONLY,
      inputSchema: {
        type: 'object',
        properties: {
          locale: {
            type: 'string',
            description: 'Restrict the list to one locale, e.g. "en". Omit for every page.',
          },
        },
        additionalProperties: false,
      },
      async handler({ locale }) {
        const pages = await source.getPages()
        const wanted = typeof locale === 'string' ? locale : undefined

        return {
          pages: pages
            .filter(page => !wanted || localeFromPath(page.path, config.i18n) === wanted)
            .map(page => ({
              title: page.title,
              path: page.path,
              description: page.frontmatter.description ?? '',
              url: pageUrl(config, page.path),
            })),
        }
      },
    },

    {
      name: 'get-page',
      description: [
        'Retrieves the full markdown of one documentation page.',
        '',
        'WHEN TO USE: when you know the exact path, either from list-pages or given',
        'by the user. Use it before answering questions about specific behaviour, so',
        'the answer comes from the documentation rather than memory.',
        '',
        'WHEN NOT TO USE: if you do not know the path yet — call list-pages first.',
      ].join('\n'),
      annotations: READ_ONLY,
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Exact page path from list-pages, e.g. "/docs/getting-started/installation".',
          },
        },
        required: ['path'],
        additionalProperties: false,
      },
      async handler({ path }) {
        if (typeof path !== 'string' || !path) {
          throw new Error('`path` is required and must be a string')
        }

        const normalized = path.startsWith('/') ? path : `/${path}`
        const pages = await source.getPages()
        const page = pages.find(candidate => candidate.path === normalized)

        if (!page) {
          throw new Error(`No page at "${normalized}". Call list-pages to see the available paths.`)
        }

        return {
          title: page.title,
          path: page.path,
          description: page.frontmatter.description ?? '',
          url: pageUrl(config, page.path),
          content: await readFile(page.filePath, 'utf8'),
        }
      },
    },
  ]
}
