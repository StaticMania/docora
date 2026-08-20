import { Icon } from 'docora'

import { Button, Container, Eyebrow, Section } from './primitives'
import { Window } from './code-surface'

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
    body: 'A chat widget that answers from your docs and cites sources, powered by the Vercel AI SDK.',
  },
]

/** A mocked agent session: question, MCP tool call, grounded answer. */
function AgentTranscript() {
  return (
    <Window
      filename="cursor — mcp: docora"
      actions={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[0.7rem] font-medium text-primary">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
          connected
        </span>
      }
      bodyClassName="flex flex-col gap-4 bg-muted/30 p-5 sm:p-6"
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

      <div className="flex items-center gap-2 border-t border-border pt-4 text-xs text-dimmed">
        <Icon name="bot" className="size-3.5" />
        Answered from your content, not from training data.
      </div>
    </Window>
  )
}

export function AiSpotlight() {
  return (
    <Section id="ai" tone="muted" className="overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(50% 60% at 15% 0%, color-mix(in oklch, var(--primary) 12%, transparent), transparent 70%)',
        }}
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow icon="bot">Built for agents</Eyebrow>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Your docs, queryable by anything that reads MCP.
            </h2>

            <p className="mt-5 text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
              Every Docora site exposes an MCP server at{' '}
              <code className="rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-highlighted">
                /mcp
              </code>{' '}
              — no extra setup. Point Cursor, VS Code, or Claude at it and the agent pulls real
              content from your docs instead of relying on stale training data. Prefer plain text?{' '}
              <code className="rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-highlighted">
                llms.txt
              </code>{' '}
              and{' '}
              <code className="rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-highlighted">
                llms-full.txt
              </code>{' '}
              are generated automatically, and an optional AI chat widget can answer questions and
              cite sources, right on the page.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {POINTS.map(point => (
                <li
                  key={point.title}
                  className="rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon name={point.icon} className="size-4" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-highlighted">{point.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{point.body}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
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
