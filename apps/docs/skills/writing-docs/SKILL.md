---
name: writing-docs
description: Write and structure documentation pages for a Docora site — file naming, frontmatter, sidebar ordering and MDC components.
---

# Writing docs for Docora

## Where pages live

Every route comes from a file under `content/`. There are no page files to
write.

| File                                                | Route                                |
| --------------------------------------------------- | ------------------------------------ |
| `content/index.mdx`                                  | `/`                                  |
| `content/docs/1.getting-started/1.introduction.mdx`  | `/docs/getting-started/introduction` |

A numeric prefix sets sidebar order and is stripped from the route. A folder is
a sidebar section; give it a title and icon with `.navigation.yml`.

## Frontmatter

```yaml
---
title: Installation
description: One sentence, used for search results and social cards.
icon: download
navigation: true
---
```

Set `navigation: false` to keep a page routable but out of the sidebar, or
`layout: landing` to drop the sidebar and table of contents.

## Components

Documents are markdown with MDC syntax, so components need no imports:

```mdc
::note
Callouts come in note, tip, warning and caution.
::

::card-group
  :::card{title="Installation" icon="i-lucide-download" to="/docs/installation"}
  Card bodies are markdown too.
  :::
::
```

Fenced code takes a filename and a line range:

````mdc
```ts [docs.config.ts]{2}
export default defineDocsConfig({
  site: { name: 'Acme' },
})
```
````

## House style

- One idea per page; split rather than nest deeply.
- Lead with what the reader does, then explain why.
- Every page needs a `description` — it is what search and social cards show.
