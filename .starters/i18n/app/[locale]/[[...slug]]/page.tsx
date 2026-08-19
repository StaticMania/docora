import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  DocsLayout,
  DocsPage,
  DocsPager,
  LandingLayout,
  compileMdxFile,
  createPageMetadata,
} from 'docora'

import docsConfig from '../../../docs.config'
import { source } from '../../../lib/source'

type PageProps = Readonly<{
  params: Promise<{ locale: string; slug?: string[] }>
}>

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

  // A landing page supplies its own hero, so the title block would duplicate it.
  if (frontmatter.layout === 'landing') {
    return (
      <LandingLayout>
        <DocsPage>{content}</DocsPage>
      </LandingLayout>
    )
  }

  const { prev, next } = await source.getSurround(page.path)
  const section = await source.getSection(page.path)

  return (
    <DocsLayout toc={toc}>
      <DocsPage title={frontmatter.title} description={frontmatter.description} section={section}>
        {content}
      </DocsPage>
      <DocsPager prev={prev} next={next} />
    </DocsLayout>
  )
}
