import { createSearchRoute } from 'docora'

import { source } from '../../../lib/source'

export const { GET, dynamic } = createSearchRoute(source)
