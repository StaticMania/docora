import { createDocsSource, defaultContentDir } from 'docs-theme'

/** Everything under `content/` — routes, sidebar and pager all read from here. */
export const source = createDocsSource({ contentDir: defaultContentDir() })
