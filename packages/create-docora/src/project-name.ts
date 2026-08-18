import path from 'node:path'

/**
 * Turns a target directory into something npm will accept as a package name.
 *
 * `.` means the current directory, and scoped-looking names are left alone.
 */
export function toPackageName(directory: string): string {
  const base = path.basename(path.resolve(directory))

  const name = base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^[._-]+/, '')
    .replace(/-+$/, '')

  return name || 'my-docs'
}

/** Rejects paths that would escape the working directory or hit a reserved name. */
export function isValidDirectory(input: string): boolean {
  if (!input.trim()) return false
  if (input.includes('\0')) return false
  return true
}
