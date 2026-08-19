import type { Metadata } from 'next'
import { DocsRoot, createRootMetadata } from 'docora'

import docsConfig from '../docs.config'
import { source } from '../lib/source'
import './globals.css'

export const metadata: Metadata = createRootMetadata(docsConfig)

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <DocsRoot config={docsConfig} navigation={await source.getNavigation()}>
      {children}
    </DocsRoot>
  )
}
