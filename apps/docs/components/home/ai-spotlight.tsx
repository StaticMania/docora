import { Icon } from 'docora'

import { Window } from './code-surface'
import { Button, Container, Eyebrow, Section } from './primitives'

const POINTS = [
  {
    icon: 'server',
    title: 'MCP server, zero config',
    body: 'list-pages and get-page tools, live at /mcp.',
  },
  {
    icon: 'file-text',
    title: 'llms.txt out of the box',
    body: 'A clean, agent-readable summary of your whole site.',
  },
  {
    icon: 'sparkles',
    title: 'Ask AI, opt-in',
    body: 'A chat widget that answers from your docs and cites sources.',
  },
]

const STATS = [
  { value: '/mcp', label: 'Zero-config MCP server' },
  { value: 'llms.txt', label: 'Agent-readable index' },
]

/** A mocked agent session: question, MCP tool call, grounded answer. */
function AgentTranscript() {
  return (
    <Window
      filename="cursor — mcp: docora"
      className="flex h-full flex-col"
      actions={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[0.7rem] font-medium text-primary">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
          connected
        </span>
      }
      bodyClassName="flex min-h-0 flex-1 flex-col gap-4 bg-muted/30 p-5 sm:p-6"
    >
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-3xl rounded-ee-lg bg-primary px-4 py-2.5 text-sm leading-6 text-primary-foreground">
          How do I highlight specific lines in a code block?
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted-foreground">
          <Icon name="wrench" className="size-3.5 text-primary" />
          get-page
          <span className="text-dimmed">·</span>
          <span className="text-highlighted">/docs/essentials/code-blocks</span>
          <Icon name="check" className="size-3.5 text-primary" />
        </div>

        <div className="max-w-[92%] rounded-3xl rounded-es-lg border border-border bg-background px-4 py-3">
          <p className="text-sm leading-6 text-foreground">
            Add a line range to the fence meta — Docora passes it straight to Shiki:
          </p>

          <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
            <code>{'```ts [config.ts] {2,5-7}'}</code>
          </pre>

          <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-dimmed">
            <Icon name="link" className="size-3.5" />
            Source:
            <span className="rounded-full bg-elevated px-2 py-0.5 font-mono text-highlighted">
              /raw/docs/essentials/code-blocks.md
            </span>
          </p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        {STATS.map(stat => (
          <div
            key={stat.value}
            className="rounded-2xl border border-border bg-background px-4 py-3.5"
          >
            <p className="font-mono text-xl font-bold tracking-tight text-highlighted sm:text-2xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </Window>
  )
}

export function AiSpotlight() {
  return (
    <Section id="ai" className="overflow-hidden">
      <Container>
        <div className="grid items-stretch gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            <Eyebrow icon="bot" className="flex max-w-max px-4 py-1.5">
              Built for agents
            </Eyebrow>

            <h2 className="mt-5 text-3xl font-bold text-balance sm:text-4xl lg:text-5xl">
              Your docs, queryable by <span className="text-primary">anything that reads MCP</span>.
            </h2>

            <ul className="mt-10 flex flex-col gap-8">
              {POINTS.map(point => (
                <li key={point.title} className="flex items-start gap-4">
                  <Icon name={point.icon} className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold tracking-tight text-highlighted">{point.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{point.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-10">
              <Button href="/docs/ai/llms-txt" trailingIcon="arrow-right">
                Read the AI &amp; agents guide
              </Button>
            </div>
          </div>

          <AgentTranscript />
        </div>
      </Container>
    </Section>
  )
}
