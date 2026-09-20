# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The `docora` theme and the `create-docora` CLI share a version number from 0.0.4
and are published together.

## [Unreleased]

## [0.0.5] - 2026-09-20

`docora@0.0.5` · `create-docora@0.0.5`

- New `search-docs` MCP tool. Agents can search the documentation and get ranked
  matches with excerpts instead of listing every page first.
- Sitemap `lastModified` now uses a page's frontmatter date, falling back to the
  file's modification time on disk. Previously every page claimed it had changed
  on every build.
- Sitemaps for i18n sites now carry `hreflang` language alternates.
- No CLI changes. `create-docora` ships to keep the shared version number and the
  starter pins in step.

## [0.0.4] - 2026-08-23

`docora@0.0.4` · `create-docora@0.0.4`

- Templates pinned the wrong theme version, so new sites installed `0.0.1`.
- The theme and the CLI now share a version number.
- No theme changes in this release.

## [0.0.2] - 2026-08-23

`docora@0.0.2` · `create-docora@0.0.3`

- Loading bar now animates on a cold load, before the app hydrates.
- Search results and locale switches drive the loading bar too.
- New `startRouteProgress()` export for application `router.push` calls.
- Home page no longer scrolls sideways on phones.
- Code windows scroll inside their frame instead of being clipped.
- Mobile drawer shows the logo next to the site name.
- The i18n starter dropped its hard-coded "Docs" header link.

## [0.0.1] - 2026-08-19

`docora@0.0.1` · `create-docora@0.0.1`

First public release.

- File-based routing from `content/`, numeric prefixes order the sidebar.
- MDC authoring — callouts, cards, tabs, steps, accordions, code groups.
- Command palette search, built at compile time.
- SEO: canonical links, sitemap, robots, generated OG images.
- i18n: a folder per locale, translated interface, `hreflang`.
- Agent routes: `llms.txt`, raw markdown, an MCP server, agent skills.
- Opt-in in-page AI assistant.
- Tailwind CSS v4 theming through CSS variables.
- The `create-docora` CLI, with default and i18n starters.
