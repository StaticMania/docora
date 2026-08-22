import type { Metadata } from 'next'

import type { DocsConfig } from '../config/types'
import type { ContentPage } from '../content/types'

/** Absolute URL for a path, when the site URL is configured. */
export function absoluteUrl(config: DocsConfig, path: string): string | undefined {
  if (!config.site.url) return undefined
  return new URL(path, config.site.url).toString()
}

export interface PageMetadataOptions {
  config: DocsConfig
  /** The page being rendered. Omit for the site-wide defaults. */
  page?: Pick<ContentPage, 'path' | 'title'> & { frontmatter?: { description?: string } }
  /** `locale -> path` for the same document, from `source.getAlternates()`. */
  alternates?: Record<string, string>
}

/**
 * Title, description, canonical URL and social cards for one page.
 *
 * Falls back to the site description, and skips absolute URLs entirely when
 * `site.url` is unset — a relative canonical would be worse than none.
 */
export function createPageMetadata({ config, page, alternates }: PageMetadataOptions): Metadata {
  const siteName = config.seo?.title ?? config.site.name
  const title = page?.title
  const description =
    page?.frontmatter?.description ?? config.seo?.description ?? config.site.description
  const path = page?.path ?? '/'
  const canonical = absoluteUrl(config, path)

  const documentTitle = title
    ? path === '/' || title === siteName
      ? { absolute: title }
      : title
    : undefined

  const ogPath = config.seo?.ogImage ?? '/og'
  const ogParams = new URLSearchParams({ title: title ?? siteName })
  if (description) ogParams.set('description', description)
  const ogImage = absoluteUrl(config, `${ogPath}?${ogParams.toString()}`)

  const languages: Record<string, string> = {}
  for (const [code, localePath] of Object.entries(alternates ?? {})) {
    languages[code] = absoluteUrl(config, localePath) ?? localePath
    if (code === config.i18n?.defaultLocale) {
      languages['x-default'] = absoluteUrl(config, localePath) ?? localePath
    }
  }

  const hasLanguages = Object.keys(languages).length > 0

  return {
    ...(documentTitle ? { title: documentTitle } : {}),
    ...(description ? { description } : {}),
    ...(canonical || hasLanguages
      ? {
          alternates: {
            ...(canonical ? { canonical } : {}),
            ...(hasLanguages ? { languages } : {}),
          },
        }
      : {}),
    openGraph: {
      type: 'website',
      siteName,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(canonical ? { url: canonical } : {}),
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export function createRootMetadata(config: DocsConfig): Metadata {
  const siteName = config.seo?.title ?? config.site.name
  const template = config.seo?.titleTemplate ?? `%s · ${siteName}`
  const description = config.seo?.description ?? config.site.description

  const shared = createPageMetadata({ config })

  return {
    ...shared,
    ...(config.site.url ? { metadataBase: new URL(config.site.url) } : {}),
    title: { default: siteName, template },
    ...(description ? { description } : {}),
  }
}
