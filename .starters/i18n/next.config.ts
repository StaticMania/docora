import type { NextConfig } from 'next'
import { withDocsTheme } from 'docs-theme/next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Every route is locale-prefixed, so the bare root goes to the default.
      { source: '/', destination: '/en', permanent: false },
    ]
  },
}

export default withDocsTheme(nextConfig)
