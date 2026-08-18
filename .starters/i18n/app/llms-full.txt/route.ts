import { createLlmsFullTxtRoute } from 'docs-theme'

import docsConfig from '../../docs.config'
import { source } from '../../lib/source'

export const { GET, dynamic } = createLlmsFullTxtRoute(source, docsConfig)
