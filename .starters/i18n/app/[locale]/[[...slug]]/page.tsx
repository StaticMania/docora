import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { DocsLayout, DocsPage, DocsPager, LandingLayout, compileMdxFile, createPageMetadata } from 'docora'

import docsConfig from '../../../docs.config'
import { source } from '../../../lib/source'

interface PageProps {
  params: Promise<{ locale: string; slug?: string[] }>
}

export async function generateStaticParams() {
  // The source returns locale-prefixed slugs; the route splits them in two.
  const params = await source.getStaticParams()

  return params
    .filter(({ slug }) => slug.length > 0)
    .map(({ slug }) => ({ locale: slug[0]!, slug: slug.slice(1) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug = [] } = await params
  const page = await source.getPage([locale, ...slug])
  if (!page) return {}

  return createPageMetadata({
    config: docsConfig,
    page,
    alternates: await source.getAlternates(page.path),
  })
}

export default async function Page({ params }: PageProps) {
  const { locale, slug = [] } = await params
  const page = await source.getPage([locale, ...slug])
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
