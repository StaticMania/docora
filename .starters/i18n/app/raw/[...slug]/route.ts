import { createRawRoute } from 'docora'

import { source } from '../../../lib/source'

export const { GET, dynamic, generateStaticParams } = createRawRoute(source)
