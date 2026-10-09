import { readFile } from 'node:fs/promises'

import type { DocsSource } from '../content/index'
import type { ContentPage } from '../content/types'
import { normalizeMdcToMarkdown } from './mdc'

export function rawSlug(page: Pick<ContentPage, 'slug'>): string[] {
  if (page.slug.length === 0) return ['index.md']
  return [...page.slug.slice(0, -1), `${page.slug.at(-1)}.md`]
}

export function rawPath(page: Pick<ContentPage, 'slug'>): string {
  return `/raw/${rawSlug(page).join('/')}`
}

export function createRawRoute(source: DocsSource) {
  return {
    dynamic: 'force-static' as const,

    async generateStaticParams() {
      const pages = await source.getPages()

      return pages.map(page => ({ slug: rawSlug(page) }))
    },

    async GET(_request: Request, context: { params: Promise<{ slug: string[] }> }) {
      const { slug } = await context.params
      const last = slug.at(-1)

      if (!last?.endsWith('.md')) return new Response('Not found', { status: 404 })

      const name = last.slice(0, -3)
      const lookup = name === 'index' && slug.length === 1 ? [] : [...slug.slice(0, -1), name]

      const page = await source.getPage(lookup)
      if (!page) return new Response('Not found', { status: 404 })

      const raw = await readFile(page.filePath, 'utf8')
      const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)
      const frontmatterBlock = match ? match[0].replace(/\r\n/g, '\n').trimEnd() : ''
      const body = match ? raw.slice(match[0].length) : raw
      const normalized = normalizeMdcToMarkdown(body)

      const content = frontmatterBlock
        ? `${frontmatterBlock}\n\n${normalized}\n`
        : `${normalized}\n`

      return new Response(content, {
        headers: { 'content-type': 'text/markdown; charset=utf-8' },
      })
    },
  }
}
