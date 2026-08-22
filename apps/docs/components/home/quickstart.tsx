import { Icon, cn } from 'docora'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { CodeWindow } from './code-surface'
import { Container, Section, SectionHeader } from './primitives'

type Step = Readonly<{
  title: string
  body: ReactNode
  code?: string
  lang?: string
  filename?: string
  tabs?: readonly string[]
}>

const STEPS: readonly Step[] = [
  {
    title: 'Create a project',
    body: (
      <>
        The CLI detects your package manager and can scaffold a single-language or i18n starter. See
        the{' '}
        <Link
          href="/docs/getting-started/installation"
          className="font-medium text-primary hover:underline"
        >
          installation guide
        </Link>{' '}
        and{' '}
        <Link
          href="/docs/getting-started/project-structure"
          className="font-medium text-primary hover:underline"
        >
          project structure
        </Link>
        .
      </>
    ),
    code: 'npx create-docora my-docs',
    lang: 'bash',
    filename: 'Terminal',
  },
  {
    title: 'Start the dev server',
    body: 'Preview the site at localhost:3000 with hot reload on every file you touch.',
    code: `cd my-docs
npm run dev

▲ Next.js
- Local: http://localhost:3000`,
    lang: 'bash',
    filename: 'Terminal',
  },
  {
    title: 'Add a page',
    body: 'Drop an .mdx file into content/ and the route and sidebar entry appear on their own.',
    code: `---
title: Getting started
---

Every file under \`content/\` is a route.`,
    lang: 'mdx',
    tabs: ['getting-started.mdx', 'preview'],
  },
]

function StepNumber({ index }: Readonly<{ index: number }>) {
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-[0.65rem] font-medium tracking-wider text-muted-foreground uppercase">
        Step
      </span>
      <span className="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>
  )
}

function StepCard({
  step,
  index,
  side,
  children,
}: Readonly<{
  step: (typeof STEPS)[number]
  index: number
  side: 'left' | 'right'
  children?: ReactNode
}>) {
  const number = (
    <div
      className={cn(
        'flex w-16 shrink-0 items-center justify-center self-stretch border-border sm:w-20',
        'order-first border-e',
        side === 'left' && 'md:order-last md:border-e-0 md:border-s',
      )}
    >
      <StepNumber index={index} />
    </div>
  )

  return (
    <article className="relative flex rounded-2xl border border-border bg-background">
      <span
        aria-hidden
        className={cn(
          'absolute top-1/2 z-10 size-2.5 -translate-y-1/2 rotate-45 border-border bg-background',
          side === 'left'
            ? 'start-0 -translate-x-1/2 border-b border-l md:start-auto md:end-0 md:translate-x-1/2 md:border-t md:border-r md:border-b-0 md:border-l-0'
            : 'start-0 -translate-x-1/2 border-b border-l',
        )}
      />

      {number}

      <div className="min-w-0 flex-1 px-5 py-4 sm:px-6 sm:py-5">
        <p className="font-semibold tracking-tight text-highlighted">{step.title}</p>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{step.body}</p>
        {children}
      </div>
    </article>
  )
}

export function Quickstart() {
  return (
    <Section id="quickstart">
      <Container>
        <SectionHeader
          eyebrow="Get going"
          eyebrowIcon="rocket"
          title="Up and running in one command"
          description="Scaffold a site, start the dev server, and start writing. Node.js 20.9 or later is required."
        />

        <ol className="relative mt-14">
          <span
            aria-hidden
            className="absolute inset-y-6 start-4 w-px -translate-x-1/2 bg-border md:start-1/2"
          />

          {STEPS.map((step, index) => {
            const side = index % 2 === 0 ? 'right' : 'left'

            return (
              <li
                key={step.title}
                className="relative grid grid-cols-[2rem_1fr] items-center gap-x-4 py-4 md:grid-cols-[1fr_2.5rem_1fr] md:gap-x-10 md:py-5"
              >
                <div className="relative z-10 col-start-1 row-start-1 flex items-center justify-center md:col-start-2">
                  <span className="size-3 rounded-full bg-primary ring-4 ring-background" />
                </div>

                <div
                  className={cn(
                    'col-start-2 row-start-1',
                    side === 'left' ? 'md:col-start-1' : 'md:col-start-3',
                  )}
                >
                  <StepCard step={step} index={index} side={side}>
                    {step.code ? (
                      <div className="mt-4">
                        <CodeWindow
                          code={step.code}
                          lang={step.lang}
                          filename={step.filename}
                          tabs={step.tabs}
                          className="rounded-xl"
                          bodyClassName="bg-muted/40 [&_.docs-code_pre]:py-4"
                        />
                      </div>
                    ) : null}
                  </StepCard>
                </div>
              </li>
            )
          })}
        </ol>

        <p className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
          <Icon name="terminal" className="size-4 text-primary" />
          Already have a Next.js app?
          <Link
            href="/docs/getting-started/installation"
            className="font-medium text-primary hover:underline"
          >
            Wire the theme into it instead
          </Link>
        </p>
      </Container>
    </Section>
  )
}
