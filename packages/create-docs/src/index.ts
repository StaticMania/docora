import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { HELP, parseCliArgs } from './args'
import { installDependencies } from './install'
import { detectPackageManager, isPackageManager, runCommand } from './package-manager'
import { ask } from './prompt'
import { isUsableTarget, listTemplates, scaffold } from './scaffold'
import { color, fail, info, success } from './ui'

async function version(): Promise<string> {
  const manifestPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../package.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as { version?: string }
  return manifest.version ?? '0.0.0'
}

async function main(argv: string[]): Promise<number> {
  const options = parseCliArgs(argv)

  if (options.help) {
    info(HELP)
    return 0
  }

  if (options.version) {
    info(await version())
    return 0
  }

  const directory = options.directory ?? (await ask('Where should the docs live?', 'my-docs'))
  const target = path.resolve(process.cwd(), directory)

  if (!(await isUsableTarget(target))) {
    fail(`${directory} already exists and is not empty.`)
    return 1
  }

  const templates = await listTemplates()
  if (templates.length > 0 && !templates.includes(options.template)) {
    fail(`Unknown template "${options.template}". Available: ${templates.join(', ')}.`)
    return 1
  }

  if (options.packageManager && !isPackageManager(options.packageManager)) {
    fail(`Unknown package manager "${options.packageManager}". Use npm, pnpm, yarn or bun.`)
    return 1
  }

  const manager = options.packageManager && isPackageManager(options.packageManager)
    ? options.packageManager
    : detectPackageManager()

  await scaffold({ directory: target, template: options.template })
  success(`Created ${color.bold(path.relative(process.cwd(), target) || '.')}`)

  if (options.install) {
    info(color.dim(`\nInstalling dependencies with ${manager}...\n`))
    try {
      await installDependencies(manager, target)
      success('Dependencies installed')
    } catch (error) {
      // A failed install is recoverable — the project is already on disk.
      fail(`${(error as Error).message}. Run it yourself once the project is ready.`)
    }
  }

  const relative = path.relative(process.cwd(), target)

  info(`\n${color.bold('Next steps:')}`)
  if (relative) info(`  cd ${relative}`)
  if (!options.install) info(`  ${manager} install`)
  info(`  ${runCommand(manager, 'dev')}`)
  info(`\nThen open ${color.cyan('http://localhost:3000')}\n`)

  return 0
}

main(process.argv.slice(2))
  .then(code => {
    process.exitCode = code
  })
  .catch((error: unknown) => {
    fail((error as Error).message)
    process.exitCode = 1
  })
