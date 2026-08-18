import type { Metadata } from 'next'
import { DocsPage, LandingLayout } from 'docs-theme'

import { loadDoc } from '../lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await loadDoc('index.mdx')
  return { description: frontmatter.description }
}

export default async function HomePage() {
  const { content, frontmatter } = await loadDoc('index.mdx')

  return (
    <LandingLayout>
      <DocsPage title={frontmatter.title} description={frontmatter.description}>
        {content}
      </DocsPage>
    </LandingLayout>
  )
}
