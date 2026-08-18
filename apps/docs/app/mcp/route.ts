import { createMcpRoute } from 'docora'

import docsConfig from '../../docs.config'
import { source } from '../../lib/source'

export const { GET, POST, DELETE } = createMcpRoute(source, docsConfig)
