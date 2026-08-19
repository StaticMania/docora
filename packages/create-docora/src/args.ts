import { parseArgs } from 'node:util'

export interface CliOptions {
  directory?: string
  template?: string
  install: boolean
  packageManager?: string
  gitInit?: boolean
  force: boolean
  help: boolean
  version: boolean
}

export const HELP = `
Usage: create-docora [directory] [options]

Options:
  -t, --template <name>       Starter to use (default, i18n)
      --pm, --package-manager Package manager: npm, pnpm, yarn or bun
      --no-install            Skip installing dependencies
      --git-init              Initialize a git repository
      --no-git-init           Skip the git repository prompt
  -f, --force                 Overlay an existing directory
  -h, --help                  Show this message
  -v, --version               Show the version

Examples:
  npx create-docora my-docs
  npx create-docora my-docs --template i18n --pm pnpm
  npx create-docora . --no-install --no-git-init
`

export function parseCliArgs(argv: string[]): CliOptions {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      template: { type: 'string', short: 't' },
      pm: { type: 'string' },
      'package-manager': { type: 'string' },
      'no-install': { type: 'boolean', default: false },
      'git-init': { type: 'boolean' },
      'no-git-init': { type: 'boolean' },
      force: { type: 'boolean', short: 'f', default: false },
      help: { type: 'boolean', short: 'h', default: false },
      version: { type: 'boolean', short: 'v', default: false },
    },
  })

  let gitInit: boolean | undefined
  if (values['no-git-init']) gitInit = false
  else if (values['git-init']) gitInit = true

  return {
    directory: positionals[0],
    template: values.template,
    install: !values['no-install'],
    packageManager: values.pm ?? values['package-manager'],
    gitInit,
    force: values.force ?? false,
    help: values.help ?? false,
    version: values.version ?? false,
  }
}
