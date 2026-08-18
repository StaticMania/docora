import type { Metadata } from 'next'
import { DocsRoot } from 'docs-theme'

import docsConfig from '../docs.config'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: docsConfig.site.name,
    template: `%s · ${docsConfig.site.name}`,
  },
  description: docsConfig.site.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <DocsRoot config={docsConfig}>{children}</DocsRoot>
}
