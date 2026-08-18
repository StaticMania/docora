import { createDocsSource, defaultContentDir } from 'docora'

/**
 * Everything under `content/` — routes, sidebar and pager all read from here.
 */
export const source = createDocsSource({ contentDir: defaultContentDir() })
