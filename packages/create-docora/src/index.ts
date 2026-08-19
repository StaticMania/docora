import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  box,
  cancel,
  confirm,
  intro,
  log,
  outro,
  select,
  spinner,
  tasks,
  text,
} from '@clack/prompts'
import type { Task } from '@clack/prompts'
import { colors } from 'consola/utils'

import { HELP, parseCliArgs } from './args'
import { DOCORA_WORDMARK, paintTheme } from './ascii'
import { initializeGit, installDependencies } from './install'
import {
  PACKAGE_MANAGERS,
  detectInvokingPackageManager,
  detectPackageManager,
  isPackageManager,
  runCommand,
} from './package-manager'
import type { PackageManager } from './package-manager'
import { isValidDirectory } from './project-name'
import { emptyDirectory, isUsableTarget, listTemplates, scaffold } from './scaffold'
import { handleCancel } from './ui'

const DEFAULT_DIRECTORY = 'my-docs'
const DEFAULT_TEMPLATE = 'default'

const TEMPLATE_HINTS: Record<string, string> = {
  default: 'recommended',
  i18n: 'multi-language docs',
}

async function version(): Promise<string> {
  const manifestPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../package.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as { version?: string }
  return manifest.version ?? '0.0.0'
}

function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY)
}

async function resolveDirectory(
  initial: string | undefined,
  interactive: boolean,
): Promise<string> {
  if (initial) return initial
  if (!interactive) return DEFAULT_DIRECTORY

  return handleCancel(
    await text({
      message: 'Where would you like to create your project?',
      placeholder: `./${DEFAULT_DIRECTORY}`,
      defaultValue: DEFAULT_DIRECTORY,
      validate: value => {
        if (!isValidDirectory(value || DEFAULT_DIRECTORY)) return 'Please enter a valid directory.'
      },
    }),
  )
}

async function resolveTemplate(
  requested: string | undefined,
  available: string[],
  interactive: boolean,
): Promise<string> {
  const templates = available.length > 0 ? available : [DEFAULT_TEMPLATE, 'i18n']

  if (requested) {
    if (!templates.includes(requested)) {
      throw new Error(`Unknown template "${requested}". Available: ${templates.join(', ')}.`)
    }
    return requested
  }

  if (!interactive) return templates.includes(DEFAULT_TEMPLATE) ? DEFAULT_TEMPLATE : templates[0]!

  return handleCancel(
    await select({
      message: 'Which template would you like to use?',
      initialValue: templates.includes(DEFAULT_TEMPLATE) ? DEFAULT_TEMPLATE : templates[0],
      options: templates.map(name => ({
        value: name,
        label: name,
        hint: TEMPLATE_HINTS[name],
      })),
    }),
  )
}

async function resolveTargetDirectory(
  cwd: string,
  directory: string,
  force: boolean,
  interactive: boolean,
): Promise<{ target: string; shouldEmpty: boolean }> {
  let current = directory
  let shouldEmpty = force

  while (true) {
    const target = path.resolve(cwd, current)

    if (shouldEmpty || (await isUsableTarget(target))) {
      return { target, shouldEmpty }
    }

    if (!interactive) {
      throw new Error(
        `The directory ${path.relative(cwd, target) || '.'} already exists. Pass --force to override it or choose a different directory.`,
      )
    }

    const action = handleCancel(
      await select({
        message: `The directory ${colors.cyan(path.relative(cwd, target) || '.')} already exists. What would you like to do?`,
        options: [
          { value: 'override', label: 'Override its contents' },
          { value: 'different', label: 'Select different directory' },
          { value: 'abort', label: 'Abort' },
        ],
      }),
    )

    if (action === 'override') {
      return { target, shouldEmpty: true }
    }

    if (action === 'abort') {
      cancel('Operation cancelled.')
      process.exit(1)
    }

    current = handleCancel(
      await text({
        message: 'Please specify a different directory:',
        validate: value => {
          if (!isValidDirectory(value ?? '')) return 'Please enter a valid directory.'
        },
      }),
    )
    shouldEmpty = false
  }
}

async function resolvePackageManager(
  requested: string | undefined,
  interactive: boolean,
): Promise<PackageManager> {
  if (requested) {
    if (!isPackageManager(requested)) {
      throw new Error(`Unknown package manager "${requested}". Use npm, pnpm, yarn or bun.`)
    }
    return requested
  }

  if (!interactive) return detectPackageManager()

  const current = detectInvokingPackageManager()

  return handleCancel(
    await select({
      message: 'Which package manager would you like to use?',
      initialValue: current ?? 'npm',
      options: PACKAGE_MANAGERS.map(pm => ({
        value: pm,
        label: pm,
        hint: current === pm ? 'current' : undefined,
      })),
    }),
  )
}

async function resolveGitInit(
  requested: boolean | undefined,
  interactive: boolean,
): Promise<boolean> {
  if (requested !== undefined) return requested
  if (!interactive) return false

  return handleCancel(await confirm({ message: 'Initialize git repository?' }))
}

async function main(argv: string[]): Promise<number> {
  const options = parseCliArgs(argv)

  if (options.help) {
    console.log(HELP)
    return 0
  }

  if (options.version) {
    console.log(await version())
    return 0
  }

  if (options.packageManager && !isPackageManager(options.packageManager)) {
    log.error(
      `Invalid package manager: ${colors.cyan(options.packageManager)}. Choose one of ${PACKAGE_MANAGERS.map(pm => colors.cyan(pm)).join(', ')}.`,
    )
    return 2
  }

  const interactive = isInteractive()

  if (interactive) {
    process.stdout.write(`\n${DOCORA_WORDMARK}\n\n`)
  }

  intro(paintTheme(colors.bold('Welcome to Docora!')))

  const cwd = process.cwd()
  const directory = await resolveDirectory(options.directory, interactive)
  const { target, shouldEmpty } = await resolveTargetDirectory(
    cwd,
    directory,
    options.force,
    interactive,
  )
  const relativeTarget = path.relative(cwd, target) || '.'
  const templates = await listTemplates()
  const template = await resolveTemplate(options.template, templates, interactive)

  log.step(`Creating project in ${colors.cyan(relativeTarget)}`)

  const scaffoldSpinner = spinner()
  scaffoldSpinner.start(`Scaffolding ${colors.cyan(template)} template`)

  try {
    if (shouldEmpty) await emptyDirectory(target)
    await scaffold({ directory: target, template })
    scaffoldSpinner.stop(`Scaffolded ${colors.cyan(template)} template`)
  } catch (error) {
    scaffoldSpinner.error('Template scaffolding failed')
    log.error((error as Error).message)
    return 1
  }

  const manager = await resolvePackageManager(options.packageManager, interactive)
  const gitInit = await resolveGitInit(options.gitInit, interactive)

  const setupTasks: Task[] = []

  if (options.install) {
    setupTasks.push({
      title: `Installing dependencies with ${colors.cyan(manager)}`,
      task: async () => {
        await installDependencies(manager, target)
        return 'Dependencies installed'
      },
    })
  }

  if (gitInit) {
    setupTasks.push({
      title: 'Initializing git repository',
      task: async () => {
        try {
          await initializeGit(target)
          return 'Git repository initialized'
        } catch (error) {
          return `Git initialization failed: ${(error as Error).message}`
        }
      },
    })
  }

  if (setupTasks.length > 0) {
    try {
      await tasks(setupTasks)
    } catch (error) {
      log.error((error as Error).message)
      log.info('The project is on disk — run the install yourself once it is ready.')
    }
  }

  outro(`✨ Docora project has been created with the ${colors.cyan(template)} template.`)

  const nextSteps = [
    relativeTarget !== '.' ? colors.cyan(`cd ${relativeTarget}`) : undefined,
    options.install ? undefined : colors.cyan(`${manager} install`),
    colors.cyan(runCommand(manager, 'dev')),
  ].filter((step): step is string => Boolean(step))

  box(`\n${nextSteps.map(step => ` › ${step}`).join('\n')}\n`, ' 👉 Next steps ', {
    contentAlign: 'left',
    titleAlign: 'left',
    width: 'auto',
    titlePadding: 2,
    contentPadding: 2,
    rounded: true,
    withGuide: false,
    formatBorder: paintTheme,
  })

  return 0
}

main(process.argv.slice(2))
  .then(code => {
    process.exitCode = code
  })
  .catch((error: unknown) => {
    log.error((error as Error).message)
    process.exitCode = 1
  })
