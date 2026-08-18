/**
 * Wraps a Next.js config with everything the docs theme needs.
 *
 * The theme is published as TypeScript source, so consuming apps have to
 * transpile it. Everything else the theme needs (MDX compilation, content
 * reading) happens at runtime on the server, not through bundler loaders —
 * that keeps this helper small and Turbopack-friendly.
 *
 * @param {import('next').NextConfig} [nextConfig]
 * @returns {import('next').NextConfig}
 */
export function withDocsTheme(nextConfig = {}) {
  const transpilePackages = new Set(nextConfig.transpilePackages ?? [])
  transpilePackages.add('docs-theme')

  return {
    ...nextConfig,
    transpilePackages: [...transpilePackages],
  }
}

export default withDocsTheme
