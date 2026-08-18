import { cp, readdir, readFile, rename, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { toPackageName } from './project-name'

/**
 * npm strips a `.gitignore` out of a published tarball, so the starter keeps
 * its copy under a placeholder name and it is restored on scaffold.
 */
const RENAMES: Record<string, string> = {
  _gitignore: '.gitignore',
  _npmrc: '.npmrc',
}

export function templatesDir(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../templates')
}

export async function listTemplates(): Promise<string[]> {
  try {
    const entries = await readdir(templatesDir(), { withFileTypes: true })
    return entries.filter(entry => entry.isDirectory()).map(entry => entry.name)
  } catch {
    return []
  }
}

/** True when the directory is missing, empty, or holds only noise. */
export async function isUsableTarget(directory: string): Promise<boolean> {
  if (!existsSync(directory)) return true

  const entries = await readdir(directory)
  return entries.filter(entry => entry !== '.git' && entry !== '.DS_Store').length === 0
}

export interface ScaffoldOptions {
  directory: string
  template: string
}

export async function scaffold({ directory, template }: ScaffoldOptions): Promise<void> {
  const source = path.join(templatesDir(), template)

  if (!existsSync(source)) {
    const available = await listTemplates()
    throw new Error(
      `Unknown template "${template}".` +
        (available.length ? ` Available: ${available.join(', ')}.` : ''),
    )
  }

  await cp(source, directory, { recursive: true })

  for (const [from, to] of Object.entries(RENAMES)) {
    const fromPath = path.join(directory, from)
    if (existsSync(fromPath)) await rename(fromPath, path.join(directory, to))
  }

  await setPackageName(directory)
}

async function setPackageName(directory: string): Promise<void> {
  const manifestPath = path.join(directory, 'package.json')
  if (!existsSync(manifestPath)) return

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as Record<string, unknown>
  manifest.name = toPackageName(directory)

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
}
