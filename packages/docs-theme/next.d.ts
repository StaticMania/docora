import type { NextConfig } from 'next'

export interface DocsThemeConfig extends NextConfig {
  /** Content directory, relative to the project root. Defaults to `content`. */
  contentDir?: string
}

export declare function withDocsTheme(nextConfig?: DocsThemeConfig): NextConfig
export default withDocsTheme
