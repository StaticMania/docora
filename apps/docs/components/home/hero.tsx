import Link from 'next/link'
import { Icon } from 'docora'

import { Button, Container, GridBackdrop } from './primitives'
import { Window, bareCode, highlight } from './code-surface'

const SOURCE = `---
title: Getting started
description: Scaffold a site and start writing.
---

::note
Every file under \`content/\` is a route.
::

Write Markdown, drop in callouts, and the
sidebar picks the page up on its own.
`

const STACK = [
  { label: 'Next.js', src: '/nextjs.svg', invert: true },
  { label: 'React', src: '/reactjs.svg', invert: false },
  { label: 'TypeScript', src: '/typescript.svg', invert: false },
  { label: 'Tailwind CSS', src: '/tailwind.svg', invert: false },
  { label: 'MDX', src: '/mdx.svg', invert: true },
]

/** The rendered half of the split preview — the same source, as a page. */
function RenderedPreview() {
  return (
    <div className="flex h-full flex-col gap-4 bg-background p-6">
      <p className="text-xs font-semibold text-primary">Getting started</p>

      <div>
        <p className="text-lg font-bold tracking-tight text-highlighted">Getting started</p>
        <p className="mt-1 text-sm text-muted-foreground">Scaffold a site and start writing.</p>
      </div>

      <div className="flex gap-2.5 rounded-xl border border-primary/25 bg-primary/5 p-3.5">
        <Icon name="info" className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-sm leading-6 text-foreground">
          Every file under <code className="font-mono text-[0.8em] text-primary">content/</code> is
          a route.
        </p>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        Write Markdown, drop in callouts, and the sidebar picks the page up on its own.
      </p>

      <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-elevated px-2.5 py-1 text-[0.7rem] text-muted-foreground">
          <Icon name="file-text" className="size-3" />
          content/docs/getting-started.mdx
        </span>
      </div>
    </div>
  )
}

export async function Hero() {
  const source = await highlight(SOURCE, 'mdx')

  return (
    <section className="relative isolate overflow-hidden pt-16 pb-16 sm:pt-24 sm:pb-24">
      <GridBackdrop />

      <Container>
        <div className="flex flex-col items-center text-center">
          <Link
            href="/docs/getting-started/introduction"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/80 py-1 ps-1 pe-3.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-highlighted"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              New
            </span>
            Docora 0.1 is out
            <Icon
              name="arrow-right"
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          <h1 className="mt-7 max-w-4xl text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Documentation, built for{' '}
            <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              people and agents
            </span>
            .
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-pretty text-muted-foreground sm:text-lg sm:leading-8">
            An open-source Next.js framework for TypeScript, Tailwind CSS and Markdown. Routing,
            search, SEO and i18n are built in. Every page also ships as an MCP server and an{' '}
            <code className="rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-highlighted">
              llms.txt
            </code>{' '}
            — so Cursor, Claude, and other AI tools can read your docs directly instead of guessing.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="/docs/getting-started/introduction" icon="rocket" size="lg">
              Get started
            </Button>
            <Button href="/docs/essentials/components" icon="blocks" variant="secondary" size="lg">
              Browse components
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {STACK.map(item => (
              <li
                key={item.label}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt=""
                  className={`size-5 shrink-0 object-contain${item.invert ? ' dark:invert' : ''}`}
                />
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-14 sm:mt-16">
          <div
            aria-hidden
            className="absolute -inset-x-6 -top-6 -bottom-10 -z-10 rounded-[2rem] bg-gradient-to-b from-primary/10 to-transparent blur-2xl"
          />

          <Window
            tabs={['getting-started.mdx', 'preview']}
            actions={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[0.7rem] font-medium text-primary">
                <Icon name="zap" className="size-3" />
                live
              </span>
            }
            className="mx-auto max-w-5xl"
            bodyClassName="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0"
          >
            <div className={`${bareCode} bg-muted/40 [&_.docs-code_pre]:min-h-[19rem]`}>
              {source}
            </div>
            <RenderedPreview />
          </Window>
        </div>
      </Container>
    </section>
  )
}
