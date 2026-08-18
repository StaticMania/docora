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

```tsx
// app/page.tsx
import path from 'node:path'
import { DocsLayout, DocsPage, compileMdxFile } from 'docs-theme'

export default async function Page() {
  const { content, frontmatter, toc } = await compileMdxFile(
    path.join(process.cwd(), 'content', 'index.mdx'),
  )

  return (
    <DocsLayout toc={toc}>
      <DocsPage title={frontmatter.title} description={frontmatter.description}>
        {content}
      </DocsPage>
    </DocsLayout>
  )
}
```

`DocsLayout` reads the sidebar, socials, footer and colour-mode settings from
the config; `LandingLayout` is the same chrome without the asides.

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
