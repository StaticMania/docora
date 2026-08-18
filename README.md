# next-docs

A documentation framework for Next.js, packaged the way [Docus](https://github.com/nuxt-content/docus)
is packaged for Nuxt: a **theme package**, a **scaffolding CLI**, and **starters**.

| Path                     | Role                                                       | Docus equivalent |
| ------------------------ | ---------------------------------------------------------- | ---------------- |
| `packages/docs-theme`    | Publishable theme: layouts, MDX pipeline, config, styles    | `layer/`         |
| `packages/create-docs`   | `npx create-docs my-docs` scaffolder                        | `cli/`           |
| `apps/playground`        | Local app used to develop the theme                         | `playground/`    |
| `.starters/default`      | Template the CLI copies                                     | `.starters/`     |

## Develop

```bash
pnpm install
pnpm playground:dev
```

Then open http://localhost:3000. Every route comes from a file under
`apps/playground/content/` — a landing page at `/` and documentation under
`/docs`. Adding an `.mdx` file there creates the route and the sidebar entry;
there are no page files to write.

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
- [ ] Phase 8 — dogfooded docs site + release
