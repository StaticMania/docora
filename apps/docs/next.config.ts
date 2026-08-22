import { withDocora } from 'docora/next'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The documentation root has no page of its own; send it to the first one.
      { source: '/docs', destination: '/docs/getting-started/introduction', permanent: false },
    ]
  },
}

export default withDocora(nextConfig)
