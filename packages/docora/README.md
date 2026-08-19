# docora

The Next.js documentation theme: layouts, MDX rendering, design tokens and the
`withDocora()` config helper.

```ts
// next.config.ts
import { withDocora } from 'docora/next'

export default withDocora({})
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "docora/styles.css";
```

```ts
// docs.config.ts
import { defineDocsConfig } from 'docora'

export default defineDocsConfig({
  site: { name: 'Acme' },
  navigation: [{ label: 'Introduction', href: '/docs' }],
  socials: { github: 'https://github.com/acme' },
})
```

```tsx
// app/layout.tsx
import { DocsRoot } from 'docora'

import docsConfig from '../docs.config'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <DocsRoot config={docsConfig}>{children}</DocsRoot>
}
```

```ts
// lib/source.ts
import { createDocsSource, defaultContentDir } from 'docora'

export const source = createDocsSource({ contentDir: defaultContentDir() })
```

```tsx
// app/[[...slug]]/page.tsx
import { notFound } from 'next/navigation'
import { DocsLayout, DocsPage, DocsPager, compileMdxFile } from 'docora'

import { source } from '../../lib/source'

export const generateStaticParams = () => source.getStaticParams()

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const page = await source.getPage((await params).slug)
  if (!page) notFound()

  const { content, frontmatter, toc } = await compileMdxFile(page.filePath)
  const { prev, next } = await source.getSurround(page.path)
  const section = await source.getSection(page.path)

  return (
    <DocsLayout toc={toc}>
      <DocsPage title={frontmatter.title} description={frontmatter.description} section={section}>
        {content}
      </DocsPage>
      <DocsPager prev={prev} next={next} />
    </DocsLayout>
  )
}
```

`DocsLayout` reads the sidebar, socials, footer and colour-mode settings from
the config; `LandingLayout` is the same chrome without the asides.

## AI assistant

An in-page chat that answers from your own pages, gated on a credential:

```ts
// app/api/assistant/route.ts
export const { POST } = createAssistantRoute(source, docsConfig)
```

```tsx
// app/layout.tsx — the credential is read on the server, never shipped
<DocsRoot assistantEnabled={isAssistantEnabled(docsConfig.assistant)} ... />
```

With no `AI_GATEWAY_API_KEY` (or Vercel OIDC token) the route answers 503 and
the UI is not rendered at all. The model gets `search-docs` and `get-page` —
the same pair the MCP server exposes — and is told to answer only from those
pages and cite them. Configure with `assistant.model`, `assistant.suggestions`,
`assistant.systemPrompt`, `assistant.enabled` and `assistant.explainWithAi`.

## LLM surface

Four route helpers make the documentation readable by tools:

```ts
// app/llms.txt/route.ts            createLlmsTxtRoute(source, docsConfig)
// app/llms-full.txt/route.ts       createLlmsFullTxtRoute(source, docsConfig)
// app/raw/[...slug]/route.ts       createRawRoute(source)
// app/mcp/route.ts                 createMcpRoute(source, docsConfig)
```

`/llms.txt` follows llmstxt.org, grouping pages by sidebar section and linking
to their markdown. `/llms-full.txt` is the whole corpus in one file.
`/raw/{path}.md` serves a page's source.

`/mcp` is a stateless Model Context Protocol server over Streamable HTTP with
`list-pages` and `get-page`, both annotated read-only. Each POST is answered
with one JSON-RPC response; `GET` and `DELETE` return 405, since there is no
stream to open and no session to end. Pass `tools` to replace the built-in pair.

A `skills/` folder at the project root is published at `/.well-known/skills/`:

```ts
// app/.well-known/skills/index.json/route.ts  createSkillsIndexRoute(defaultSkillsDir())
// app/.well-known/skills/[...slug]/route.ts   createSkillsFileRoute(defaultSkillsDir())
```

Each `skills/{name}/SKILL.md` needs a `name` and `description` in frontmatter.
Only files the catalog lists are served, so the route cannot walk the disk.

## Internationalisation

Content moves under `content/{locale}/` and every route becomes locale-prefixed:

```ts
// docs.config.ts
i18n: {
  defaultLocale: 'en',
  locales: [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
  ],
}
```

```ts
// lib/source.ts
export const source = createDocsSource({
  contentDir: defaultContentDir(),
  i18n: docsConfig.i18n,
})
```

Routes live under `app/[locale]/`, whose layout owns `<html lang>` and passes
`locale` to `DocsRoot`. Each locale gets its own navigation tree, pager and
search results, and `source.getAlternates(path)` feeds hreflang.

Interface strings ship for English, French and Spanish; any locale falls back to
English, and `i18n.messages` overrides individual strings per locale. The
language switcher keeps the reader on the same page.

## Search and SEO

The theme builds a search index from the content directory and serves it from a
route the palette fetches once:

```ts
// app/api/search/route.ts
import { createSearchRoute } from 'docora'
import { source } from '../../../lib/source'

export const { GET, dynamic } = createSearchRoute(source)
```

`dynamic: 'force-static'` means it is prerendered in production and rebuilt per
request in development. The palette opens with the header button or Cmd/Ctrl-K,
ranks title over heading over description over body, requires every term to
match, and deep-links to the matching heading.

Metadata, sitemap, robots and Open Graph images come from the same config:

```ts
// app/layout.tsx
export const metadata = createRootMetadata(docsConfig)

// app/[[...slug]]/page.tsx
export const generateMetadata = async ({ params }) =>
  createPageMetadata({ config: docsConfig, page: await source.getPage((await params).slug) })

// app/sitemap.ts       export default () => createSitemap(source, docsConfig)
// app/robots.ts        export default () => createRobots(docsConfig)
// app/og/route.tsx     export const { GET } = createOgRoute(docsConfig)
```

Set `site.url` to switch on canonical links, absolute sitemap entries and social
images; without it those are omitted rather than emitted as relative URLs.

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
