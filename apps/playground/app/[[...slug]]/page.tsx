import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { DocsLayout, DocsPage, DocsPager, LandingLayout, compileMdxFile } from 'docora'

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

  return { title: page.frontmatter.title, description: page.frontmatter.description }
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
