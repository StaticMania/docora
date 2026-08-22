import { Icon, cn } from 'docora'
import Link from 'next/link'

import { Container, Section, SectionHeader } from './primitives'

const GUIDES = [
  {
    icon: 'download',
    title: 'Installation',
    body: 'Scaffold a site, or wire the theme into an existing Next.js app.',
    to: '/docs/getting-started/installation',
    wide: false,
  },
  {
    icon: 'settings',
    title: 'Configuration',
    body: 'Site name, header links, navigation, search and footer — one typed object.',
    to: '/docs/core-concepts/configuration',
    wide: false,
  },
  {
    icon: 'palette',
    title: 'Theme',
    body: 'CSS variables, colour mode and typography — reskin without forking the package.',
    to: '/docs/core-concepts/theme',
    wide: false,
  },
  {
    icon: 'pencil',
    title: 'Customization',
    body: 'Header slots, extra MDX components, or a layout you assemble yourself.',
    to: '/docs/core-concepts/customization',
    wide: true,
  },
  {
    icon: 'bot',
    title: 'AI and agents',
    body: 'llms.txt, an MCP server and skills so tools can read the corpus.',
    to: '/docs/ai/llms-txt',
    wide: true,
  },
]

export function Guides() {
  return (
    <Section id="guides">
      <Container>
        <SectionHeader
          eyebrow="Guides"
          eyebrowIcon="book-open"
          title="Where to go next"
          description="Pick a path. Each guide is a file in the repo, the same way your docs will be."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {GUIDES.map(guide => (
            <Link
              key={guide.title}
              href={guide.to}
              className={cn(
                'group flex flex-col rounded-3xl border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5',
                guide.wide ? 'lg:col-span-3' : 'lg:col-span-2',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-muted text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                  <Icon name={guide.icon} className="size-5" />
                </span>
                <Icon
                  name="arrow-up-right"
                  className="mt-2 size-4 text-dimmed opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </div>

              <h3 className="mt-5 font-semibold tracking-tight text-highlighted">{guide.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{guide.body}</p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}
