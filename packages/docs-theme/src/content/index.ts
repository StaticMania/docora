import path from 'node:path'

import type { NavItem } from '../config/types'
import { buildNavigation, findSurround } from './navigation'
import { parseOrderPrefix } from './slug'
import { findDirectory, flattenPages, readContentTree, type ContentDirectory } from './tree'
import type { ContentPage, PageSurround } from './types'

export interface DocsSourceOptions {
  /** Absolute path to the content directory. */
  contentDir: string
  /**
   * Directory whose children make up the sidebar, relative to the content
   * root. Defaults to `docs` when that folder exists, matching Docus: a
   * landing page at `/` and documentation under `/docs`.
   */
  navigationRoot?: string
}

export interface DocsSource {
  getPage(slug?: string[]): Promise<ContentPage | undefined>
  getPages(): Promise<ContentPage[]>
  getNavigation(): Promise<NavItem[]>
  getSurround(path: string): Promise<PageSurround>
  /** Every route, shaped for `generateStaticParams`. */
  getStaticParams(): Promise<{ slug: string[] }[]>
}

/**
 * Reads a content directory and answers the questions the routes ask of it.
 *
 * The tree is re-read on every call in development so that adding a file shows
 * up on refresh, and cached in production where the content cannot change.
 */
export function createDocsSource({ contentDir, navigationRoot }: DocsSourceOptions): DocsSource {
  let cached: Promise<ContentDirectory> | undefined

  function tree(): Promise<ContentDirectory> {
    if (process.env.NODE_ENV === 'development') return readContentTree(contentDir)

    cached ??= readContentTree(contentDir)
    return cached
  }

  async function navigationDirectory(root: ContentDirectory): Promise<ContentDirectory> {
    if (navigationRoot) {
      return findDirectory(root, navigationRoot.split('/').filter(Boolean)) ?? root
    }

    // Default: use `docs/` as the sidebar root when it exists.
    return root.directories.find(child => child.name === 'docs') ?? root
  }

  async function getNavigation(): Promise<NavItem[]> {
    return buildNavigation(await navigationDirectory(await tree()))
  }

  async function getPages(): Promise<ContentPage[]> {
    return flattenPages(await tree())
  }

  return {
    getPages,
    getNavigation,

    async getPage(slug = []) {
      const wanted = slug.map(segment => parseOrderPrefix(segment).name).join('/')
      return (await getPages()).find(page => page.slug.join('/') === wanted)
    },

    async getSurround(currentPath) {
      return findSurround(await getNavigation(), currentPath)
    },

    async getStaticParams() {
      return (await getPages()).map(page => ({ slug: page.slug }))
    },
  }
}

/** Convenience for the common case: a `content` directory beside `package.json`. */
export function defaultContentDir(): string {
  return path.join(process.cwd(), 'content')
}

export { buildNavigation, findSurround, flattenNavigation } from './navigation'
export { readContentTree, flattenPages, findDirectory, type ContentDirectory } from './tree'
export { humanize, parseOrderPrefix, slugToPath, stripExtension } from './slug'
export type { ContentPage, DirectoryMeta, PageFrontmatter, PageSurround } from './types'
