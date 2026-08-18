import { readFile } from 'node:fs/promises'

import type { DocsSource } from '../content/index'
import type { NavItem } from '../config/types'
import type { I18nConfig } from '../i18n/types'
import { localeFromPath } from '../i18n/paths'
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
export async function buildSearchIndex(source: DocsSource, i18n?: I18nConfig): Promise<SearchIndex> {
  const pages = await source.getPages()

  // Section labels differ per locale, so each locale's tree is read separately.
  const navigations = i18n
    ? await Promise.all(i18n.locales.map(locale => source.getNavigation(locale.code)))
    : [await source.getNavigation()]

  const sections = new Map<string, string>()
  for (const navigation of navigations) sectionsByPath(navigation, undefined, sections)

  const documents = await Promise.all(
    pages.map(async (page): Promise<SearchDocument> => {
      const raw = await readFile(page.filePath, 'utf8')
      const section = sections.get(page.path)
      const locale = localeFromPath(page.path, i18n)

      return {
        path: page.path,
        title: page.title,
        ...(page.frontmatter.description ? { description: page.frontmatter.description } : {}),
        ...(section ? { section } : {}),
        ...(locale ? { locale } : {}),
        headings: extractHeadings(raw),
        content: toSearchableText(raw).slice(0, MAX_CONTENT_LENGTH),
      }
    }),
  )

  return { documents }
}
