import { cp, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Copies the starters into the package so they ship inside the published
 * tarball. Scaffolding then works offline, with no network fetch.
 */
const here = path.dirname(fileURLToPath(import.meta.url))
const source = path.resolve(here, '../../../.starters')
const target = path.resolve(here, '../templates')

await rm(target, { recursive: true, force: true })
await cp(source, target, { recursive: true })

console.log(`Copied starters from ${source} to ${target}`)
