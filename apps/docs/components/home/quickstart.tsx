import Link from 'next/link'
import { Icon } from 'docora'

import { Button, Container, Section, SectionHeader } from './primitives'
import { CodeWindow } from './code-surface'

const COMMANDS = `npx create-docora my-docs
cd my-docs && npm run dev`

const STEPS = [
  {
    title: 'Create a project',
    body: 'The CLI detects your package manager and can scaffold a single-language or i18n starter.',
  },
  {
    title: 'Start the dev server',
    body: 'Preview the site at localhost:3000 with hot reload on every file you touch.',
  },
  {
    title: 'Add a page',
    body: 'Drop an .mdx file into content/ and the route and sidebar entry appear on their own.',
  },
]

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

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <CodeWindow
              code={COMMANDS}
              lang="bash"
              filename="Terminal"
              bodyClassName="bg-muted/40 [&_.docs-code_pre]:py-5"
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button href="/docs/getting-started/installation" icon="download" size="sm">
                Installation guide
              </Button>
              <Button
                href="/docs/getting-started/project-structure"
                variant="secondary"
                size="sm"
                trailingIcon="arrow-right"
              >
                Project structure
              </Button>
            </div>
          </div>

          <ol className="relative space-y-8 before:absolute before:inset-y-3 before:start-5 before:w-px before:bg-border">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative flex gap-4">
                <span className="z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </span>

                <div className="pt-1.5">
                  <p className="font-semibold tracking-tight text-highlighted">{step.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

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
