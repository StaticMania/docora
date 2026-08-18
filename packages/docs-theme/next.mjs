/**
 * Wraps a Next.js config with everything the docs theme needs.
 *
 * The theme is published as TypeScript source, so consuming apps have to
 * transpile it. Everything else the theme needs (MDX compilation, content
 * reading) happens at runtime on the server, not through bundler loaders —
 * that keeps this helper small and Turbopack-friendly.
 *
 * Pages are compiled from files on disk at render time, so the content
 * directory has to be traced into the build output.
 *
 * @param {import('next').NextConfig & { contentDir?: string }} [nextConfig]
 * @returns {import('next').NextConfig}
 */
export function withDocsTheme(nextConfig = {}) {
  const { contentDir = 'content', ...rest } = nextConfig

  const transpilePackages = new Set(rest.transpilePackages ?? [])
  transpilePackages.add('docs-theme')

  return {
    ...rest,
    transpilePackages: [...transpilePackages],
    outputFileTracingIncludes: {
      ...rest.outputFileTracingIncludes,
      '/**/*': [`./${contentDir}/**/*`],
    },
  }
}

export default withDocsTheme
