/** `1.getting-started` → `{ name: 'getting-started', order: 1 }` */
export function parseOrderPrefix(name: string): { name: string; order: number } {
  const match = name.match(/^(\d+)\.(.+)$/)

  if (!match) return { name, order: Number.MAX_SAFE_INTEGER }

  return { name: match[2]!, order: Number(match[1]) }
}

/** Drop the `.md` / `.mdx` extension. */
export function stripExtension(fileName: string): string {
  return fileName.replace(/\.mdx?$/, '')
}

/** `getting-started` → `Getting Started` — the fallback when nothing sets a title. */
export function humanize(name: string): string {
  return name
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/** Slug segments → a route path. An empty slug is the site root. */
export function slugToPath(slug: string[]): string {
  return slug.length === 0 ? '/' : `/${slug.join('/')}`
}
