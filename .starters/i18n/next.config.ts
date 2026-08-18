import type { NextConfig } from 'next'
import { withDocora } from 'docora/next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Every route is locale-prefixed, so the bare root goes to the default.
      { source: '/', destination: '/en', permanent: false },
    ]
  },
}

export default withDocora(nextConfig)
