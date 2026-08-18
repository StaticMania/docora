import type { Frontmatter } from '../mdx/frontmatter'
import type { NavItem } from '../config/types'

export interface PageFrontmatter extends Frontmatter {
  title?: string
  description?: string
  /** A lucide icon name shown beside the page in the sidebar. */
  icon?: string
  /** `landing` drops the sidebar and table of contents. */
  layout?: 'docs' | 'landing'
  /**
   * `false` hides the page from the sidebar; an object overrides how it
   * appears there.
   */
  navigation?: boolean | { title?: string; icon?: string }
}

/** One document discovered under the content directory. */
export interface ContentPage {
  /** Route segments, with order prefixes stripped. */
  slug: string[]
  /** The route this page is served at. */
  path: string
  /** Absolute path on disk. */
  filePath: string
  frontmatter: PageFrontmatter
  /** Sort key from a numeric filename prefix. */
  order: number
  title: string
}

/** A `.navigation.yml` sitting inside a content folder. */
export interface DirectoryMeta {
  title?: string
  icon?: string
  navigation?: boolean
}

export interface PageSurround {
  prev?: NavItem
  next?: NavItem
}
