# next-docs

A documentation framework for Next.js, packaged the way [Docus](https://github.com/nuxt-content/docus)
is packaged for Nuxt: a **theme package**, a **scaffolding CLI**, and **starters**.

| Path                     | Role                                                       | Docus equivalent |
| ------------------------ | ---------------------------------------------------------- | ---------------- |
| `packages/docs-theme`    | Publishable theme: layouts, MDX pipeline, config, styles    | `layer/`         |
| `packages/create-docs`   | `npx create-docs my-docs` scaffolder (stub until Phase 3)   | `cli/`           |
| `apps/playground`        | Local app used to develop the theme                         | `playground/`    |
| `.starters/default`      | Template copied by the CLI (stub until Phase 3)             | `.starters/`     |

## Develop

```bash
pnpm install
pnpm playground:dev
```

Then open http://localhost:3000. The playground serves a landing page at `/` and
documentation under `/docs`, all read from `apps/playground/content/`.

## Status

Built phase by phase; each phase ships something usable.

- [x] **Phase 0** — monorepo skeleton, theme package, playground renders an MDX page
- [x] **Phase 1** — docs shell: header, sidebar, TOC, mobile drawer, dark mode, `docs.config.ts`
- [ ] Phase 2 — content pipeline, navigation tree, catch-all MDX routes
- [ ] Phase 3 — `create-docs` CLI + default starter
- [ ] Phase 4 — search + sitemap/robots/OG
- [ ] Phase 5 — i18n
- [ ] Phase 6 — llms.txt, MCP, skills
- [ ] Phase 7 — AI assistant
- [ ] Phase 8 — dogfooded docs site + release
