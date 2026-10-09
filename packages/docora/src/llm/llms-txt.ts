import { readFile } from 'node:fs/promises'

import type { DocsConfig } from '../config/types'
import type { DocsSource } from '../content/index'
import { sectionsByPath } from '../content/navigation'
import type { ContentPage } from '../content/types'
import { localeFromPath } from '../i18n/paths'
import { splitFrontmatter } from '../mdx/frontmatter'
import { normalizeMdcToMarkdown } from './mdc'
import { rawPath } from './raw'

function absolute(config: DocsConfig, path: string): string {
  return config.site.url ? new URL(path, config.site.url).toString() : path
}

export function createLlmsTxtRoute(source: DocsSource, config: DocsConfig) {
  return {
    dynamic: 'force-static' as const,
    async GET() {
      const pages = await source.getPages()

      const navigations = config.i18n
        ? await Promise.all(config.i18n.locales.map(locale => source.getNavigation(locale.code)))
        : [await source.getNavigation()]

      const sections = new Map<string, string>()
      for (const navigation of navigations) sectionsByPath(navigation, undefined, sections)

      const lines: string[] = [`# ${config.site.name}`, '']
      if (config.site.description) lines.push(`> ${config.site.description}`, '')

      const groups = new Map<string, ContentPage[]>()
      for (const page of pages) {
        const locale = localeFromPath(page.path, config.i18n)
        const section = sections.get(page.path) || 'Overview'
        const key = locale ? `${section} (${locale})` : section

        groups.set(key, [...(groups.get(key) ?? []), page])
      }

      for (const [heading, groupPages] of groups) {
        lines.push(`## ${heading}`, '')

        for (const page of groupPages) {
          const description = page.frontmatter.description
            ? `: ${page.frontmatter.description}`
            : ''
          lines.push(`- [${page.title}](${absolute(config, rawPath(page))})${description}`)
        }

        lines.push('')
      }

      return new Response(lines.join('\n'), {
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      })
    },
  }
}

export function createLlmsFullTxtRoute(source: DocsSource, config: DocsConfig) {
  return {
    dynamic: 'force-static' as const,
    async GET() {
      const pages = await source.getPages()

      const sections = await Promise.all(
        pages.map(async page => {
          const raw = await readFile(page.filePath, 'utf8')
          const { body } = splitFrontmatter(raw)
          const normalized = normalizeMdcToMarkdown(body)

          return [
            `# ${page.title}`,
            '',
            `URL: ${absolute(config, page.path)}`,
            ...(page.frontmatter.description
              ? [`Description: ${page.frontmatter.description}`]
              : []),
            '',
            normalized.trim(),
          ].join('\n')
        }),
      )

      const header = [`# ${config.site.name}`, '']
      if (config.site.description) header.push(`> ${config.site.description}`, '')

      const toc = ['## Table of Contents', '']
      for (const page of pages) {
        const desc = page.frontmatter.description ? `: ${page.frontmatter.description}` : ''
        toc.push(`- [${page.title}](${absolute(config, page.path)})${desc}`)
      }
      toc.push('')

      return new Response([...header, ...toc, sections.join('\n\n---\n\n')].join('\n'), {
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      })
    },
  }
}
