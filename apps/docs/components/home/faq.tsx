import { Icon } from 'docora'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Container, Section, SectionHeader } from './primitives'

type Question = Readonly<{ question: string; answer: ReactNode }>

const QUESTIONS: readonly Question[] = [
  {
    question: 'Do I need a CMS?',
    answer: (
      <>
        No. Pages are Markdown files and Git is the workflow. You can still add ordinary App Router
        routes next to the catch-all when a page needs custom React.
      </>
    ),
  },
  {
    question: 'Can I add this to an existing Next.js app?',
    answer: (
      <>
        Yes. Docora is a theme package. Install <code className="font-mono">docora</code>, wrap your
        Next config with <code className="font-mono">withDocora</code>, and point it at a{' '}
        <code className="font-mono">content/</code> folder.{' '}
        <Link
          href="/docs/getting-started/installation"
          className="font-medium text-primary hover:underline"
        >
          See Installation
        </Link>
        .
      </>
    ),
  },
  {
    question: 'How does search work?',
    answer: (
      <>
        The index is built when the site compiles. There is no hosted search service and nothing
        extra to deploy — open it from the header or with{' '}
        <kbd className="rounded-full border border-border bg-elevated px-2 py-0.5 font-sans text-xs">
          Ctrl
        </kbd>{' '}
        <kbd className="rounded-full border border-border bg-elevated px-2 py-0.5 font-sans text-xs">
          K
        </kbd>
        .
      </>
    ),
  },
  {
    question: 'Can language models read the docs?',
    answer: (
      <>
        Yes. Every site exposes <code className="font-mono">/llms.txt</code>, full-corpus{' '}
        <code className="font-mono">/llms-full.txt</code>, raw Markdown at{' '}
        <code className="font-mono">/raw/{'{path}'}.md</code>, and an MCP server at{' '}
        <code className="font-mono">/mcp</code>.
      </>
    ),
  },
  {
    question: 'Does the AI chat feature cost anything to run?',
    answer: (
      <>
        Answers go through the Vercel AI Gateway — bring your own API key or use the free tier. The
        widget is opt-in, so a site that never enables it makes no model calls at all.
      </>
    ),
  },
  {
    question: 'Is Docora related to Docus?',
    answer: (
      <>
        Docora is inspired by Docus (Nuxt) but is an independent project built for Next.js and
        React, with its own architecture and AI-native features like a built-in MCP server.
      </>
    ),
  },
]

export function Faq() {
  return (
    <Section id="faq">
      <Container>
        <SectionHeader
          eyebrow="FAQ"
          eyebrowIcon="circle-help"
          title="Questions, answered"
          description="Short answers for the things people usually ask before they scaffold."
        />

        <div className="mx-auto mt-14 max-w-3xl space-y-3">
          {QUESTIONS.map(item => (
            <details
              key={item.question}
              className="group rounded-2xl border border-border bg-background px-5 transition-colors open:border-border-accented hover:border-border-accented"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 py-4 text-sm font-semibold text-highlighted marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1">{item.question}</span>
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-dimmed transition-colors group-open:border-primary/30 group-open:bg-primary/10 group-open:text-primary">
                  <Icon
                    name="chevron-down"
                    className="size-4 transition-transform group-open:rotate-180"
                  />
                </span>
              </summary>

              <p className="pb-5 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  )
}
