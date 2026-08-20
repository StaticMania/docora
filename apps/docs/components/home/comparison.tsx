import { Icon } from 'docora'

import { Container, Section, SectionHeader } from './primitives'

const ROWS = [
  { icon: 'terminal', label: 'Setup', value: 'One command, files on disk' },
  { icon: 'file-text', label: 'Content', value: 'Markdown / MDX, no CMS required' },
  { icon: 'bot', label: 'AI access', value: 'MCP server + llms.txt built in' },
  { icon: 'container', label: 'Hosting', value: 'Any Next.js host, including self-hosted' },
  { icon: 'palette', label: 'Styling', value: 'Tailwind and CSS variables — no fork to reskin' },
]

export function Comparison() {
  return (
    <Section id="tradeoffs">
      <Container>
        <SectionHeader
          eyebrow="Trade-offs"
          eyebrowIcon="layers"
          title="What Docora optimizes for"
          description="Not every docs tool should make the same choices. These are ours, stated plainly, so you can tell in a minute whether they match your project."
        />

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-3xl border border-border bg-background shadow-xl shadow-black/5 dark:shadow-black/30">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/60 px-6 py-4">
            <p className="text-sm font-semibold tracking-tight text-highlighted">Docora</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Icon name="check" className="size-3.5" />
              Open source, MIT
            </span>
          </div>

          <dl className="divide-y divide-border">
            {ROWS.map(row => (
              <div
                key={row.label}
                className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-6"
              >
                <dt className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground sm:w-40 sm:shrink-0">
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-primary">
                    <Icon name={row.icon} className="size-4" />
                  </span>
                  {row.label}
                </dt>
                <dd className="text-sm leading-6 text-highlighted">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  )
}
