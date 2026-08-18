import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { DocsLayout, DocsPage, DocsPager, LandingLayout, compileMdxFile, createPageMetadata } from 'docora'

import docsConfig from '../../docs.config'
import { source } from '../../lib/source'

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

export async function generateStaticParams() {
  return source.getStaticParams()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await source.getPage((await params).slug)
  if (!page) return {}

  return createPageMetadata({ config: docsConfig, page })
}

export default async function Page({ params }: PageProps) {
  const page = await source.getPage((await params).slug)
  if (!page) notFound()

  const { content, frontmatter, toc } = await compileMdxFile(page.filePath)

  const body = (
    <DocsPage title={frontmatter.title} description={frontmatter.description}>
      {content}
    </DocsPage>
  )

  if (frontmatter.layout === 'landing') {
    return <LandingLayout>{body}</LandingLayout>
  }

  const { prev, next } = await source.getSurround(page.path)

  return (
    <DocsLayout toc={toc}>
      {body}
      <DocsPager prev={prev} next={next} />
    </DocsLayout>
  )
}
