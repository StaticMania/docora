import type { Metadata } from 'next'
import { DocsLayout, DocsPage } from 'docs-theme'

import { loadDoc } from '../../../lib/content'

const DOC = ['docs', 'configuration.mdx']

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await loadDoc(...DOC)
  return { title: frontmatter.title, description: frontmatter.description }
}

export default async function Page() {
  const { content, frontmatter, toc } = await loadDoc(...DOC)

  return (
    <DocsLayout toc={toc}>
      <DocsPage section="Core Concepts" title={frontmatter.title} description={frontmatter.description}>
        {content}
      </DocsPage>
    </DocsLayout>
  )
}
