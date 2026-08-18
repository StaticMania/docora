import type { NextConfig } from 'next'
import { withDocsTheme } from 'docs-theme/next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The documentation root has no page of its own; send it to the first one.
      { source: '/docs', destination: '/docs/getting-started/introduction', permanent: false },
    ]
  },
}

export default withDocsTheme(nextConfig)
