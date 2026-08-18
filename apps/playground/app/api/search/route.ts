import { createSearchRoute } from 'docs-theme'

import { source } from '../../../lib/source'

export const { GET, dynamic } = createSearchRoute(source)
