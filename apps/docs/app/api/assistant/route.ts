import { createAssistantRoute } from 'docora'

import docsConfig from '../../../docs.config'
import { source } from '../../../lib/source'

export const { POST } = createAssistantRoute(source, docsConfig)
