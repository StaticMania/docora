import { Icon } from 'docora'

import { Container, Eyebrow, Section } from './primitives'
import { ImagePlaceholder } from './image-placeholder'

const BRIDGE = [
  { label: 'Docus', meta: 'Nuxt · Vue', muted: true },
  { label: 'Docora', meta: 'Next.js · React', muted: false },
]

export function Inspiration() {
  return (
    <Section id="inspiration">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <Eyebrow icon="heart">Where it comes from</Eyebrow>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Inspired by Docus, built for React
            </h2>

            <p className="mt-5 text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
              Docus made writing documentation genuinely enjoyable in the Nuxt ecosystem —
              file-based routing, MDC syntax, zero-config search, all the things a docs site should
              just have. We loved it, but we live in Next.js and React. Docora brings that same
              experience — plus AI-native features like MCP and{' '}
              <code className="rounded-md bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-highlighted">
                llms.txt
              </code>{' '}
              — to the ecosystem we build in every day.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {BRIDGE.map((item, index) => (
                <div key={item.label} className="flex items-center gap-3">
                  {index > 0 && <Icon name="arrow-right" className="size-4 shrink-0 text-dimmed" />}
                  <div
                    className={
                      item.muted
                        ? 'rounded-2xl border border-border bg-muted/60 px-4 py-3'
                        : 'rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3'
                    }
                  >
                    <p
                      className={
                        item.muted
                          ? 'text-sm font-semibold text-muted-foreground'
                          : 'text-sm font-semibold text-primary'
                      }
                    >
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-xs text-dimmed">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Docora is an independent project — no shared code, its own architecture.{' '}
              <a
                href="https://docus.dev"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                Visit Docus
                <Icon name="arrow-up-right" className="size-3.5" />
              </a>
            </p>
          </div>

          <ImagePlaceholder
            label="Side-by-side screenshot"
            hint="Drop a 16:9 image showing the same page authored once and rendered in Docora."
          />
        </div>
      </Container>
    </Section>
  )
}
