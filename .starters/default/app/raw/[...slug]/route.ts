import { createRawRoute } from 'docs-theme'

import { source } from '../../../lib/source'

export const { GET, dynamic, generateStaticParams } = createRawRoute(source)
