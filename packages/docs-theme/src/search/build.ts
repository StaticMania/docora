import { readFile } from 'node:fs/promises'

import type { DocsSource } from '../content/index'
import type { NavItem } from '../config/types'
import { extractHeadings, toSearchableText } from './text'
import type { SearchDocument, SearchIndex } from './types'

/** Keeps the shipped index small; matches still rank on the whole prefix. */
const MAX_CONTENT_LENGTH = 8000

/** path → the section heading it sits under, for grouping results. */
function sectionsByPath(items: NavItem[], section?: string, map = new Map<string, string>()) {
  for (const item of items) {
    if (item.href) map.set(item.href, section ?? '')
    if (item.children) sectionsByPath(item.children, item.label, map)
  }

  return map
}

/**
 * Reads every page once and reduces it to a searchable record.
 *
 * Built on the server — either at build time through a static route, or per
 * request in development — so the client only ever downloads the result.
 */
export async function buildSearchIndex(source: DocsSource): Promise<SearchIndex> {
  const [pages, navigation] = await Promise.all([source.getPages(), source.getNavigation()])
  const sections = sectionsByPath(navigation)

  const documents = await Promise.all(
    pages.map(async (page): Promise<SearchDocument> => {
      const raw = await readFile(page.filePath, 'utf8')
      const section = sections.get(page.path)

      return {
        path: page.path,
        title: page.title,
        ...(page.frontmatter.description ? { description: page.frontmatter.description } : {}),
        ...(section ? { section } : {}),
        headings: extractHeadings(raw),
        content: toSearchableText(raw).slice(0, MAX_CONTENT_LENGTH),
      }
    }),
  )

  return { documents }
}
