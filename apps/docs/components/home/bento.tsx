import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icon, cn } from 'docora'

import { Container, Section, SectionHeader } from './primitives'

type CardProps = Readonly<{
  title: string
  icon: string
  to: string
  children: ReactNode
  /** The visual that fills the lower half of the tile. */
  visual?: ReactNode
  featured?: boolean
  className?: string
}>

function BentoCard({ title, icon, to, children, visual, featured, className }: CardProps) {
  return (
    <Link
      href={to}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5',
        featured && 'border-primary/25 bg-primary/[0.04]',
        className,
      )}
    >
      {featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(90% 70% at 85% 0%, color-mix(in oklch, var(--primary) 14%, transparent), transparent 70%)',
          }}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'inline-flex size-11 items-center justify-center rounded-full border border-border bg-muted text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10',
            featured && 'border-primary/30 bg-primary/10',
          )}
        >
          <Icon name={icon} className="size-5" />
        </span>

        <span className="inline-flex size-8 items-center justify-center rounded-full text-dimmed opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100">
          <Icon name="arrow-up-right" className="size-4" />
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-highlighted">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{children}</p>

      {visual && <div className="mt-6 grow">{visual}</div>}
    </Link>
  )
}

function TreeVisual() {
  const rows = [
    { depth: 0, icon: 'folder', label: 'content/', muted: false },
    { depth: 1, icon: 'file-text', label: 'index.mdx', muted: false },
    { depth: 1, icon: 'folder', label: 'docs/', muted: false },
    { depth: 2, icon: 'folder', label: '1.getting-started/', muted: false },
    { depth: 3, icon: 'file-text', label: '1.introduction.mdx', muted: false },
    { depth: 3, icon: 'file-text', label: '2.installation.mdx', muted: true },
  ]

  return (
    <div className="rounded-2xl border border-border bg-muted/50 p-4">
      <ul className="space-y-1.5 font-mono text-xs">
        {rows.map(row => (
          <li
            key={`${row.depth}-${row.label}`}
            className={cn(
              'flex items-center gap-1.5',
              row.muted ? 'text-dimmed' : 'text-muted-foreground',
            )}
            style={{ paddingInlineStart: `${row.depth * 0.85}rem` }}
          >
            <Icon
              name={row.icon}
              className={cn('size-3.5 shrink-0', row.icon === 'folder' && 'text-primary')}
            />
            <span className="truncate">{row.label}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 border-t border-border pt-3 text-xs text-dimmed">
        <span className="font-mono text-primary">1.</span> orders the sidebar and never reaches the
        URL.
      </p>
    </div>
  )
}

function AgentsVisual() {
  const routes = ['/llms.txt', '/llms-full.txt', '/mcp', '/raw/*.md', '/.well-known/skills']

  return (
    <div className="flex flex-wrap gap-2">
      {routes.map(route => (
        <span
          key={route}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-background/70 px-3 py-1.5 font-mono text-xs text-primary"
        >
          <span className="size-1.5 rounded-full bg-primary" aria-hidden />
          {route}
        </span>
      ))}
    </div>
  )
}

function SearchVisual() {
  return (
    <div className="rounded-2xl border border-border bg-muted/50 p-3">
      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2">
        <Icon name="search" className="size-3.5 text-dimmed" />
        <span className="text-xs text-muted-foreground">Search the docs…</span>
        <span className="ms-auto flex gap-1">
          <kbd className="rounded-full border border-border bg-elevated px-1.5 py-0.5 font-sans text-[0.65rem] text-muted-foreground">
            Ctrl
          </kbd>
          <kbd className="rounded-full border border-border bg-elevated px-1.5 py-0.5 font-sans text-[0.65rem] text-muted-foreground">
            K
          </kbd>
        </span>
      </div>

      <div className="mt-2 space-y-1.5">
        {['Installation', 'Code blocks'].map((row, index) => (
          <div
            key={row}
            className={cn(
              'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs',
              index === 0 ? 'bg-primary/10 text-primary' : 'text-dimmed',
            )}
          >
            <Icon name="file-text" className="size-3.5" />
            {row}
          </div>
        ))}
      </div>
    </div>
  )
}

function SeoVisual() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-wrap gap-2">
        {['sitemap.xml', 'robots.txt', 'canonical', 'hreflang', 'og:image'].map(item => (
          <span
            key={item}
            className="rounded-full border border-border bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="w-full shrink-0 overflow-hidden rounded-2xl border border-border bg-muted/60 sm:w-56">
        <div className="flex aspect-[1.91/1] flex-col justify-center gap-1.5 bg-gradient-to-br from-primary/15 to-transparent p-4">
          <span className="text-[0.65rem] font-medium tracking-wide text-primary uppercase">
            Docora
          </span>
          <span className="text-sm leading-tight font-semibold text-highlighted">
            Generated Open Graph image
          </span>
          <span className="text-[0.65rem] text-muted-foreground">docora.dev</span>
        </div>
      </div>
    </div>
  )
}

function LocaleVisual() {
  const locales = [
    { code: 'en', label: 'English', active: true },
    { code: 'fr', label: 'Francais', active: false },
    { code: 'de', label: 'Deutsch', active: false },
  ]

  return (
    <div className="space-y-1.5">
      {locales.map(locale => (
        <div
          key={locale.code}
          className={cn(
            'flex items-center gap-2 rounded-full border px-3 py-2 text-xs',
            locale.active
              ? 'border-primary/30 bg-primary/10 text-primary'
              : 'border-border bg-muted/50 text-muted-foreground',
          )}
        >
          <span className="font-mono font-medium uppercase">{locale.code}</span>
          <span className="truncate">{locale.label}</span>
          <span className="ms-auto font-mono text-[0.65rem] text-dimmed">
            content/{locale.code}/
          </span>
        </div>
      ))}
    </div>
  )
}

export function Bento() {
  return (
    <Section id="features">
      <Container>
        <SectionHeader
          eyebrow="Why Docora"
          eyebrowIcon="sparkles"
          title="Everything a documentation site needs"
          description="A Next.js theme, not a CMS. You keep the App Router, the content folder, and a single config file."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <BentoCard
            title="File-based routing"
            icon="folder-tree"
            to="/docs/getting-started/project-structure"
            visual={<TreeVisual />}
            className="lg:row-span-2"
          >
            Every file under <code className="font-mono text-[0.85em]">content/</code> becomes a
            route. Numeric prefixes set sidebar order and never appear in the URL.
          </BentoCard>

          <BentoCard
            title="Built for agents"
            icon="bot"
            to="/docs/ai/llms-txt"
            visual={<AgentsVisual />}
            featured
            className="sm:col-span-2"
          >
            An <code className="font-mono text-[0.85em]">llms.txt</code>, raw Markdown routes, an
            MCP server and agent skills, so tools read your docs instead of scraping them.
          </BentoCard>

          <BentoCard
            title="Markdown with components"
            icon="puzzle"
            to="/docs/essentials/components"
          >
            MDC syntax puts callouts, cards, tabs and steps in your Markdown with no imports. JSX
            still works when you need it.
          </BentoCard>

          <BentoCard
            title="Instant search"
            icon="search"
            to="/docs/core-concepts/configuration"
            visual={<SearchVisual />}
          >
            A command palette over every page, built at compile time. No service to run, no index to
            host.
          </BentoCard>

          <BentoCard
            title="SEO by default"
            icon="globe"
            to="/docs/core-concepts/deployment"
            visual={<SeoVisual />}
            className="sm:col-span-2"
          >
            Canonical links, sitemap, robots and generated Open Graph images, all from one config
            file.
          </BentoCard>

          <BentoCard
            title="Internationalisation"
            icon="languages"
            to="/docs/getting-started/project-structure"
            visual={<LocaleVisual />}
          >
            A folder per locale. Routes, sidebar, pager, search and interface strings all follow,
            with hreflang emitted for you.
          </BentoCard>
        </div>
      </Container>
    </Section>
  )
}
