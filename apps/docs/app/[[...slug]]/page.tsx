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

import docsConfig from '../../docs.config'
import { source } from '../../lib/source'

type PageProps = Readonly<{
  params: Promise<{ slug?: string[] }>
}>

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

  const body = (
    <DocsPage title={frontmatter.title} description={frontmatter.description} section={section}>
      {content}
    </DocsPage>
  )

  return (
    <DocsLayout toc={toc} page={{ relativePath: page.relativePath, title: page.title }}>
      {body}
      <DocsPager prev={prev} next={next} />
    </DocsLayout>
  )
}
