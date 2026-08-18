import type { Metadata } from 'next'
import { DocsRoot } from 'docs-theme'

import docsConfig from '../docs.config'
import { source } from '../lib/source'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: docsConfig.site.name,
    template: `%s · ${docsConfig.site.name}`,
  },
  description: docsConfig.site.description,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsRoot config={docsConfig} navigation={await source.getNavigation()}>
      {children}
    </DocsRoot>
  )
}
