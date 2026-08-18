import { createSearchRoute } from 'docs-theme'

import docsConfig from '../../../docs.config'
import { source } from '../../../lib/source'

export const { GET, dynamic } = createSearchRoute(source, docsConfig.i18n)
