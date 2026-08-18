import { createAssistantRoute } from 'docs-theme'

import docsConfig from '../../../docs.config'
import { source } from '../../../lib/source'

export const { POST } = createAssistantRoute(source, docsConfig)
