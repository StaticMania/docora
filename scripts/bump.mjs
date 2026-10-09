#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dryRun = process.argv.includes('--dry-run')
const requested = process.argv.slice(2).find(arg => !arg.startsWith('--'))

const color = process.env.NO_COLOR === undefined && process.stdout.isTTY
const paint = (code, text) => (color ? `\u001b[${code}m${text}\u001b[0m` : text)
const bold = text => paint(1, text)
const red = text => paint(31, text)
const green = text => paint(32, text)
const dim = text => paint(2, text)

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/
const STARTERS = ['default', 'i18n']
const RELEASES = ['major', 'minor', 'patch']

const at = (...segments) => path.join(root, ...segments)
const readText = file => readFileSync(file, 'utf8')
const readJson = file => JSON.parse(readText(file))

const rows = []
const errors = []

function fail(message) {
  console.log(`\n${red('Cannot bump')}\n  - ${message}\n`)
  process.exit(1)
}

function next(current, release) {
  const [, major, minor, patch] = current.match(SEMVER).map(Number)
  if (release === 'major') return `${major + 1}.0.0`
  if (release === 'minor') return `${major}.${minor + 1}.0`
  return `${major}.${minor}.${patch + 1}`
}

function compare(a, b) {
  const left = a.match(SEMVER).slice(1, 4).map(Number)
  const right = b.match(SEMVER).slice(1, 4).map(Number)
  for (let i = 0; i < 3; i++) {
    if (left[i] !== right[i]) return left[i] - right[i]
  }
  return 0
}

function edit(label, file, transform) {
  const before = readText(file)
  const after = transform(before)

  if (after === before) {
    rows.push({ label, value: 'already current', state: 'skip' })
    return
  }

  if (!dryRun) writeFileSync(file, after, 'utf8')
  rows.push({ label, value: 'updated', state: 'ok' })
}

function replaceOnce(label, pattern, replacement) {
  return source => {
    const matches = source.match(pattern)
    if (!matches) {
      errors.push(`${label}: nothing matched ${pattern} — the file may have been restructured`)
      return source
    }
    return source.replace(pattern, replacement)
  }
}

const theme = readJson(at('packages/docora/package.json'))
const current = theme.version

if (!SEMVER.test(current))
  fail(`packages/docora/package.json has a non-semver version: "${current}"`)
if (!requested) {
  fail(`pass a version or one of ${RELEASES.join(', ')} — e.g. "node scripts/bump.mjs patch"`)
}

const target = RELEASES.includes(requested) ? next(current, requested) : requested

if (!SEMVER.test(target)) fail(`"${target}" is not a semver version`)
if (compare(target, current) < 0) fail(`${target} is older than the current ${current}`)
if (compare(target, current) === 0) fail(`already at ${target} — nothing to do`)

const pin = `^${target}`

edit(
  'packages/docora',
  at('packages/docora/package.json'),
  replaceOnce('packages/docora', /("version":\s*)"[^"]+"/, `$1"${target}"`),
)
edit(
  'packages/create-docora',
  at('packages/create-docora/package.json'),
  replaceOnce('packages/create-docora', /("version":\s*)"[^"]+"/, `$1"${target}"`),
)
edit(
  'package.json',
  at('package.json'),
  replaceOnce('package.json', /("version":\s*)"[^"]+"/, `$1"${target}"`),
)

for (const starter of STARTERS) {
  const file = at('.starters', starter, 'package.json')
  edit(
    `.starters/${starter}`,
    file,
    replaceOnce(`.starters/${starter}`, /("docora":\s*)"[^"]+"/, `$1"${pin}"`),
  )
}

const hero = at('apps/docs/components/home/hero.tsx')
edit(
  'hero.tsx banner',
  hero,
  replaceOnce(
    'hero.tsx banner',
    /Docora \d+\.\d+\.\d+[0-9A-Za-z.-]* is out/,
    `Docora ${target} is out`,
  ),
)

const changelog = at('CHANGELOG.md')
const today = new Date().toISOString().slice(0, 10)

edit('CHANGELOG.md', changelog, source => {
  if (source.includes(`## [${target}]`)) return source

  if (!/^## \[Unreleased\]$/m.test(source)) {
    errors.push('CHANGELOG.md: no "## [Unreleased]" heading to promote')
    return source
  }

  return source.replace(/^## \[Unreleased\]$/m, `## [Unreleased]\n\n## [${target}] - ${today}`)
})

for (const starter of STARTERS) {
  const file = at('packages/create-docora/templates', starter, 'package.json')
  if (!existsSync(file)) {
    rows.push({ label: `templates/${starter}`, value: 'built at publish', state: 'skip' })
    continue
  }
  edit(
    `templates/${starter}`,
    file,
    replaceOnce(`templates/${starter}`, /("docora":\s*)"[^"]+"/, `$1"${pin}"`),
  )
}

const width = Math.max(...rows.map(entry => entry.label.length))
const marks = { ok: green('ok'), skip: dim('skip') }

console.log(
  `\n${bold('Bump')}  ${dim(`${current} → ${target}`)}${dryRun ? dim('  (dry run)') : ''}\n`,
)
for (const entry of rows) {
  console.log(`  ${entry.label.padEnd(width)}  ${entry.value.padEnd(18)} ${marks[entry.state]}`)
}

if (errors.length > 0) {
  console.log(`\n${red('Blocked')}`)
  for (const message of errors) console.log(`  - ${message}`)
  console.log()
  process.exit(1)
}

console.log(
  dryRun
    ? `\n${dim('Nothing written. Drop --dry-run to apply.')}\n`
    : `\nNow run ${bold('pnpm run check:versions')} to confirm, then fill in the ${bold(`[${target}]`)} section of CHANGELOG.md.\n`,
)
