# My Docs

Documentation built with [Docora](https://github.com/StaticMania/docora).

## Develop

```bash
npm run dev
```

Open http://localhost:3000.

## Write

Every file under `content/` becomes a route:

| File                                              | Route                                |
| ------------------------------------------------- | ------------------------------------ |
| `content/index.mdx`                                | `/`                                  |
| `content/docs/1.getting-started/1.introduction.mdx` | `/docs/getting-started/introduction` |

A numeric prefix sets sidebar order and is stripped from the route. A folder
becomes a section — give it a title and icon with `.navigation.yml`.

Documents are markdown with MDC syntax, so components need no imports:

```mdc
::note
Callouts come in `note`, `tip`, `warning` and `caution`.
::
```

## Configure

`docs.config.ts` controls the site name, header links, socials, table of
contents and footer.

## Build

```bash
npm run build
npm run start
```
