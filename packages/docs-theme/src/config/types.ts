import type { AssistantConfig } from '../assistant/config'
import type { I18nConfig } from '../i18n/types'

/** A link rendered in the header, footer or TOC bottom section. */
export interface NavLink {
  label: string
  href: string
  /** A lucide icon name in kebab-case, e.g. `book-open`. */
  icon?: string
  /** Set for links that should open in a new tab. Inferred for `http(s)` hrefs. */
  external?: boolean
}

/** A node in the sidebar navigation tree. */
export interface NavItem {
  label: string
  href?: string
  /** A lucide icon name in kebab-case, e.g. `folder-tree`. */
  icon?: string
  /** Nested pages. A node with children and no href renders as a section title. */
  children?: NavItem[]
}

/**
 * Known social networks get a built-in brand icon; anything else falls back to
 * a generic link icon.
 */
export type SocialKey = 'github' | 'x' | 'discord' | 'linkedin' | 'youtube' | 'bluesky' | (string & {})

export interface DocsConfig {
  /** Multi-language routing. Content moves under `content/{locale}/`. */
  i18n?: I18nConfig

  site: {
    name: string
    description?: string
    /** Absolute site URL — used for canonical links and OG images from Phase 4 on. */
    url?: string
    locale?: string
  }

  header?: {
    /** Overrides `site.name` in the header. */
    title?: string
    logo?: {
      light?: string
      dark?: string
      alt?: string
      className?: string
    }
    /** Top-level links shown next to the logo. */
    links?: NavLink[]
    /** Show the search trigger. Search itself lands in Phase 4. */
    search?: boolean
  }

  /** Sidebar tree. Generated from the content directory in Phase 2. */
  navigation?: NavItem[]

  /** Map of network → profile URL, e.g. `{ github: 'https://github.com/acme' }`. */
  socials?: Partial<Record<SocialKey, string>>

  toc?: {
    enabled?: boolean
    title?: string
    bottom?: {
      title?: string
      links?: NavLink[]
    }
  }

  github?: {
    url?: string
    branch?: string
    /** Path to the docs root inside the repository, for "edit this page" links. */
    rootDir?: string
  }

  footer?: {
    credits?: string
    links?: NavLink[]
  }

  /** In-page AI chat. Only appears when a gateway credential is configured. */
  assistant?: AssistantConfig

  search?: {
    /** Set to `false` to remove the palette and its trigger. */
    enabled?: boolean
    /** Where the index is served from. Defaults to `/api/search`. */
    endpoint?: string
  }

  seo?: {
    /** Overrides `site.name` in the title template. */
    title?: string
    /** `%s` is replaced with the page title. Defaults to `%s · <site name>`. */
    titleTemplate?: string
    description?: string
    /** Path of the OG image route. Defaults to `/og`. */
    ogImage?: string
  }

  /** Progress bar shown across the top of the page during navigation. */
  loadingIndicator?: {
    /** Set to `false` to remove it. */
    enabled?: boolean
    /** Any CSS colour. Defaults to the theme's primary. */
    color?: string
    /** Bar thickness in pixels. Defaults to 3. */
    height?: number
  }

  colorMode?: {
    /** Initial mode when the visitor has no stored preference. */
    default?: 'system' | 'light' | 'dark'
    /** Pin the site to one mode and hide the toggle. */
    forced?: 'light' | 'dark'
  }
}
