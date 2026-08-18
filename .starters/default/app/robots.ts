import type { MetadataRoute } from 'next'
import { createRobots } from 'docora'

import docsConfig from '../docs.config'

export default function robots(): MetadataRoute.Robots {
  return createRobots(docsConfig)
}
