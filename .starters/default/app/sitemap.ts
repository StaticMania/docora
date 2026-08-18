import type { MetadataRoute } from 'next'
import { createSitemap } from 'docora'

import docsConfig from '../docs.config'
import { source } from '../lib/source'

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return createSitemap(source, docsConfig)
}
