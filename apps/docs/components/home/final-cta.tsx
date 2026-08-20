import { Icon } from 'docora'

import { Button, Container, GridBackdrop } from './primitives'

const REASSURANCE = ['MIT licensed', 'No database', 'No dashboard', 'No lock-in']

export function FinalCta() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-muted/50 px-6 py-16 text-center sm:px-12 sm:py-20">
          <GridBackdrop fade="bottom" />

          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">
            Start writing
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
            Everything is a file on disk. No database, no dashboard, no lock-in.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="/docs/getting-started/introduction" icon="book-open" size="lg">
              Read the docs
            </Button>
            <Button
              href="https://github.com/StaticMania/docora"
              icon="star"
              variant="secondary"
              size="lg"
            >
              View on GitHub
            </Button>
          </div>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {REASSURANCE.map(item => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <Icon name="check" className="size-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
