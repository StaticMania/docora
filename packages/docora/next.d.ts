import type { NextConfig } from 'next'

export interface DocoraConfig extends NextConfig {
  /** Content directory, relative to the project root. Defaults to `content`. */
  contentDir?: string
}

export declare function withDocora(nextConfig?: DocoraConfig): NextConfig
export default withDocora
