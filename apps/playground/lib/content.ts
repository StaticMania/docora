import path from 'node:path'
import { compileMdxFile } from 'docs-theme'

const CONTENT_DIR = path.join(process.cwd(), 'content')

/**
 * Load one document by its path under `content/`.
 *
 * Phase 2 replaces this and the per-document route files with a single
 * catch-all route that walks the content directory.
 */
export function loadDoc(...segments: string[]) {
  return compileMdxFile(path.join(CONTENT_DIR, ...segments))
}
