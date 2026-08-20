import Link from 'next/link'
import { Icon, Note, Tip } from 'docora'

import { Container, Section, SectionHeader } from './primitives'
import { CodeWindow } from './code-surface'

const SOURCE = `::note
Drop an \`.mdx\` file into \`content/\` and the route
appears on its own.
::

::tip{to="/docs/essentials/components"}
Prose components are available by name. Nothing to
import, nothing to register.
::
`

const CARDS = [
  {
    icon: 'blocks',
    title: 'Callouts, cards, tabs and steps',
    body: 'Every prose component is available by name. Accordion, fields, video and collapsible blocks ship alongside them.',
    to: '/docs/essentials/components',
  },
  {
    icon: 'code',
    title: 'Code blocks that do more',
    body: 'Filenames, line highlighting, grouped tabs, collapsible blocks, file trees and a copy button on every fence.',
    to: '/docs/essentials/code-blocks',
  },
]

export function Authoring() {
  return (
    <Section id="authoring">
      <Container>
        <SectionHeader
          eyebrow="Authoring"
          eyebrowIcon="pencil"
          title="Write Markdown, get a component"
          description="MDC keeps the source readable. The page stays rich — callouts, cards, tabs, steps, and code that does more than highlight."
        />

        <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-2">
          <CodeWindow
            code={SOURCE}
            lang="mdc"
            filename="content/docs/introduction.mdx"
            bodyClassName="h-full bg-muted/40 [&_.docs-code_pre]:min-h-[17rem]"
          />

          <div className="flex flex-col rounded-2xl border border-border bg-background p-6 shadow-xl shadow-black/5 dark:shadow-black/30">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-elevated px-3 py-1 text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
              <Icon name="eye" className="size-3.5 text-primary" />
              Rendered
            </p>

            <div className="mt-2 [&>:first-child]:mt-4">
              <Note>
                Drop an <code className="font-mono text-[0.85em]">.mdx</code> file into{' '}
                <code className="font-mono text-[0.85em]">content/</code> and the route appears on
                its own.
              </Note>

              <Tip to="/docs/essentials/components">
                Prose components are available by name. Nothing to import, nothing to register.
              </Tip>
            </div>

            <p className="mt-auto flex items-center gap-2 border-t border-border pt-5 text-xs text-dimmed">
              <Icon name="zap" className="size-3.5" />
              No imports, no MDX provider wiring — the theme registers them for you.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {CARDS.map(card => (
            <Link
              key={card.title}
              href={card.to}
              className="group rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-muted text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                  <Icon name={card.icon} className="size-5" />
                </span>
                <Icon
                  name="arrow-up-right"
                  className="mt-2 size-4 text-dimmed opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </div>

              <h3 className="mt-5 font-semibold tracking-tight text-highlighted">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.body}</p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}
