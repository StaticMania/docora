import { Caution, Icon, Note, Tip, Warning } from 'docora'

import { Window, bareCode, highlight } from './code-surface'
import { Container, Section, SectionHeader } from './primitives'

const SOURCE = `::note
Drop an \`.mdx\` file into \`content/\`
and the route appears on its own.
::

::tip
Prose components are available by name.
Nothing to import.
::

::warning
Be careful with this action as it might
have unexpected results.
::

::caution
This action cannot be undone.
::
`

function CalloutPreview() {
  return (
    <div className="flex h-full flex-col bg-background p-6">
      <p className="inline-flex w-fit items-center gap-2 rounded-full bg-elevated px-3 py-1 text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
        <Icon name="eye" className="size-3.5 text-primary" />
        Preview
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <Note className="my-0">
          Drop an <code className="font-mono text-[0.85em]">.mdx</code> file into{' '}
          <code className="font-mono text-[0.85em]">content/</code> and the route appears on its
          own.
        </Note>

        <Tip className="my-0">Prose components are available by name. Nothing to import.</Tip>

        <Warning className="my-0">
          Be careful with this action as it might have unexpected results.
        </Warning>

        <Caution className="my-0">This action cannot be undone.</Caution>
      </div>
    </div>
  )
}

export async function Authoring() {
  const source = await highlight(SOURCE, 'mdc')

  return (
    <Section id="authoring">
      <Container>
        <SectionHeader
          eyebrow="Authoring"
          eyebrowIcon="pencil"
          title="Write Markdown, get a component"
          description="MDC keeps the source readable. The page stays rich — callouts, cards, tabs, steps, and code that does more than highlight."
        />

        <div className="relative mt-14">
          <Window
            tabs={['introduction.mdx', 'preview']}
            actions={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[0.7rem] font-medium text-primary">
                <Icon name="zap" className="size-3" />
                live
              </span>
            }
            className="mx-auto max-w-full"
            bodyClassName="grid divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0"
          >
            <div className={`${bareCode} bg-muted/40 [&_.docs-code_pre]:min-h-[19rem]`}>
              {source}
            </div>
            <CalloutPreview />
          </Window>
        </div>
      </Container>
    </Section>
  )
}
