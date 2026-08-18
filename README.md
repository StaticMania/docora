# next-docs

A documentation framework for Next.js, packaged the way [Docus](https://github.com/nuxt-content/docus)
is packaged for Nuxt: a **theme package**, a **scaffolding CLI**, and **starters**.

| Path                     | Role                                                       | Docus equivalent |
| ------------------------ | ---------------------------------------------------------- | ---------------- |
| `packages/docs-theme`    | Publishable theme: layouts, MDX pipeline, config, styles    | `layer/`         |
| `packages/create-docs`   | `npx create-docs my-docs` scaffolder                        | `cli/`           |
| `apps/docs`              | The documentation site, built with the theme                 | `docs/`          |
| `apps/playground`        | Scratch app for developing the theme                         | `playground/`    |
| `.starters/default`      | Single-language template the CLI copies                     | `.starters/`     |
| `.starters/i18n`         | Multi-language template                                     | `.starters/`     |

## Develop

```bash
pnpm install
```

```bash
pnpm dev
```

Runs the documentation site at http://localhost:3000. Every route comes from a
file under `apps/docs/content/` — adding an `.mdx` file creates the route and
the sidebar entry; there are no page files to write.

`pnpm playground:dev` runs a smaller app whose kitchen-sink page carries every
component at once, which is quicker to eyeball when changing the theme.

## Scaffold a new site

```bash
npx create-docs my-docs
```

```bash
npx create-docs my-docs --template i18n
```

Two templates: `default` for a single language, `i18n` for a multi-language
site. The starters ship inside the CLI tarball, so scaffolding works offline.
Pass `--pm` to choose a package manager and `--no-install` to skip installing.

## Releasing

Both packages publish independently. `docs-theme` ships TypeScript source, so it
has no build step; `create-docs` builds and bundles the starters on `prepack`.

```bash
pnpm verify
```

```bash
pnpm release:theme
```

```bash
pnpm release:cli
```

Bump versions first — the two are versioned separately, and the starters pin
`docs-theme` by range, so a breaking theme change needs the starters updated in
the same release.

## Status

Built phase by phase; each phase ships something usable.

- [x] **Phase 0** — monorepo skeleton, theme package, playground renders an MDX page
- [x] **Phase 1** — docs shell: header, sidebar, TOC, mobile drawer, dark mode, `docs.config.ts`
- [x] **Phase 2** — content pipeline, navigation tree, catch-all route, MDC syntax and prose components
- [x] **Phase 3** — `create-docs` CLI + default starter
- [ ] Phase 4 — search + sitemap/robots/OG
- [x] **Phase 5** — i18n routing, translated interface, language switcher, `i18n` starter
- [x] **Phase 6** — llms.txt, raw markdown, MCP server, agent skills
- [x] **Phase 7** — env-gated AI assistant with docs-grounded tools
- [x] **Phase 8** — dogfooded docs site, customization docs, edit links, release pipeline
