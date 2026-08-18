export { DocsRoot, type DocsRootProps } from './layouts/docs-root'
export { DocsLayout, type DocsLayoutProps } from './layouts/docs-layout'
export { LandingLayout, type LandingLayoutProps } from './layouts/landing-layout'
export { DocsPage, type DocsPageProps } from './layouts/docs-page'

export { SiteHeader, type SiteHeaderProps } from './components/site-header'
export { SiteFooter } from './components/site-footer'
export { SidebarNav, type SidebarNavProps } from './components/sidebar-nav'
export { TableOfContents, type TableOfContentsProps } from './components/toc'
export { ThemeToggle } from './components/theme-toggle'
export { SearchButton } from './components/search-button'
export { MobileNav } from './components/mobile-nav'
export { Icon, type IconProps } from './components/icon'
export { RouteProgress, type RouteProgressProps } from './components/route-progress'
export { DocsPager } from './components/docs-pager'
export { docsFont } from './font'

export { defineDocsConfig, fallbackDocsConfig } from './config/define'
export { useDocsConfig } from './config/context'
export type { DocsConfig, NavItem, NavLink, SocialKey } from './config/types'

export { defaultMdxComponents, getMdxComponents, mdxShortcodes } from './mdx/components'
export * from './mdc/index'
export { mdcHandlers } from './mdx/mdc'
export { transformerCodeMeta, iconForFilename } from './mdx/code-meta'
export { compileMdx, compileMdxFile, type CompileMdxOptions, type CompiledMdx } from './mdx/compile'
export { splitFrontmatter, type Frontmatter } from './mdx/frontmatter'
export { buildTocTree, type TocEntry, type TocNode } from './mdx/toc'

export {
  createDocsSource,
  defaultContentDir,
  buildNavigation,
  findSurround,
  flattenNavigation,
  readContentTree,
  flattenPages,
  findDirectory,
  humanize,
  parseOrderPrefix,
  slugToPath,
  stripExtension,
  type DocsSource,
  type DocsSourceOptions,
  type ContentDirectory,
  type ContentPage,
  type DirectoryMeta,
  type PageFrontmatter,
  type PageSurround,
} from './content/index'

export { cn } from './utils/cn'
