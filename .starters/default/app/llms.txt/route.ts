import { createLlmsTxtRoute } from 'docora'

import docsConfig from '../../docs.config'
import { source } from '../../lib/source'

export const { GET, dynamic } = createLlmsTxtRoute(source, docsConfig)
