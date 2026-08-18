# docs-theme

The Next.js documentation theme: layouts, MDX rendering, design tokens and the
`withDocsTheme()` config helper.

```ts
// next.config.ts
import { withDocsTheme } from 'docs-theme/next'

export default withDocsTheme({})
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "docs-theme/styles.css";
```

```ts
// docs.config.ts
import { defineDocsConfig } from 'docs-theme'

export default defineDocsConfig({
  site: { name: 'Acme' },
  navigation: [{ label: 'Introduction', href: '/docs' }],
  socials: { github: 'https://github.com/acme' },
})
```

```tsx
// app/layout.tsx
import { DocsRoot } from 'docs-theme'

import docsConfig from '../docs.config'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <DocsRoot config={docsConfig}>{children}</DocsRoot>
}
```

```ts
// lib/source.ts
import { createDocsSource, defaultContentDir } from 'docs-theme'

export const source = createDocsSource({ contentDir: defaultContentDir() })
```

```tsx
// app/[[...slug]]/page.tsx
import { notFound } from 'next/navigation'
import { DocsLayout, DocsPage, DocsPager, compileMdxFile } from 'docs-theme'

import { source } from '../../lib/source'

export const generateStaticParams = () => source.getStaticParams()

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const page = await source.getPage((await params).slug)
  if (!page) notFound()

  const { content, frontmatter, toc } = await compileMdxFile(page.filePath)
  const { prev, next } = await source.getSurround(page.path)

  return (
    <DocsLayout toc={toc}>
      <DocsPage title={frontmatter.title} description={frontmatter.description}>
        {content}
      </DocsPage>
      <DocsPager prev={prev} next={next} />
    </DocsLayout>
  )
}
```

`DocsLayout` reads the sidebar, socials, footer and colour-mode settings from
the config; `LandingLayout` is the same chrome without the asides.

## MDC syntax

Documents are markdown with [MDC](https://content.nuxt.com/docs/files/markdown#mdc-syntax)
on top, the same authoring syntax Docus uses, so components need no imports:

```mdc
::note{icon="i-lucide-info"}
Block components use `::name`, nested ones add a colon per level.
::

::card-group
  :::card{title="Installation" to="/docs/installation" icon="i-lucide-download"}
  Card bodies are markdown too.
  :::
::

Inline components use one colon — :badge{label="v1"} — and
[styled spans]{.text-primary} use bracket syntax.
```

`remark-mdc` parses it and the theme maps every component name onto a React
component, so `::card-group` resolves to `CardGroup`. JSX still works alongside
it, since documents are compiled as MDX.

Shipped components: `callout` (plus `note`, `tip`, `warning`, `caution`),
`card` / `card-group`, `accordion` / `accordion-item`, `tabs` / `tabs-item`,
`field` / `field-group`, `steps`, `collapsible`, `badge`, `kbd`, `icon`,
`video`, and the code wrappers `code-group`, `code-tree`, `code-collapse`,
`code-preview`.

Fenced code takes a filename and line range in its meta — ``` ```ts [nuxt.config.ts]{3-5} ``` —
and every block gets a copy button.

The table of contents uses the same "circuit" rail Nuxt UI draws for Docus: a
masked SVG path that steps sideways where the heading list changes depth, with a
coloured segment spanning whichever headings are on screen. `DocsRoot` also
mounts a route-change progress bar modelled on Nuxt's loading indicator.

The palette mirrors Docus — a zinc neutral ramp with an emerald primary, in the
semantic roles Nuxt UI exposes (`background`, `elevated`, `accented`,
`foreground`, `muted-foreground`, `dimmed`, `highlighted`). `DocsRoot` loads
Public Sans through `next/font` and binds it to `--docs-font-sans`; redefine any
token after the stylesheet import to reskin the theme.

MDX is compiled on the server at render time rather than through a bundler
loader, so pages can be produced from any file on disk — the groundwork for the
file-based content pipeline. Headings are collected during that compile and
returned as `toc`.
