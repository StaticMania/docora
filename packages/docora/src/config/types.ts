import type { AssistantConfig } from '../assistant/config'
import type { I18nConfig } from '../i18n/types'

export interface NavLink {
  label: string
  href: string
  icon?: string
  external?: boolean
}

export interface NavItem {
  label: string
  href?: string
  icon?: string
  children?: NavItem[]
  hasChildren?: boolean
  childCount?: number
}

export type SocialKey =
  'github' | 'x' | 'discord' | 'linkedin' | 'youtube' | 'bluesky' | (string & {})

export interface DocsConfig {
  i18n?: I18nConfig

  site: {
    name: string
    description?: string
    url?: string
    locale?: string
  }

  header?: {
    title?: string
    logo?: {
      light?: string
      dark?: string
      alt?: string
      className?: string
    }
    links?: NavLink[]
    search?: boolean
  }

  navigation?: NavItem[]

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
    rootDir?: string
  }

  footer?: {
    credits?: string
    links?: NavLink[]
    columns?: { title: string; links: NavLink[] }[]
  }

  assistant?: AssistantConfig

  search?: {
    enabled?: boolean
    endpoint?: string
  }

  seo?: {
    title?: string
    titleTemplate?: string
    description?: string
    ogImage?: string
  }

  loadingIndicator?: {
    enabled?: boolean
    color?: string
    height?: number
  }

  colorMode?: {
    default?: 'system' | 'light' | 'dark'
    forced?: 'light' | 'dark'
  }
}
