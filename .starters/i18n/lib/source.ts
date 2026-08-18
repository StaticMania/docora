import { createDocsSource, defaultContentDir } from 'docs-theme'

import docsConfig from '../docs.config'

/**
 * Content lives under `content/{locale}/`, so the source is told about the
 * locales and builds a separate navigation tree for each.
 */
export const source = createDocsSource({
  contentDir: defaultContentDir(),
  i18n: docsConfig.i18n,
})
