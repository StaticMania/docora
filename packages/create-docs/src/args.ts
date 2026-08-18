import { parseArgs } from 'node:util'

export interface CliOptions {
  directory?: string
  template: string
  install: boolean
  packageManager?: string
  help: boolean
  version: boolean
}

export const HELP = `
Usage: create-docs [directory] [options]

Options:
  -t, --template <name>  Starter to use (default: "default")
      --pm <name>        Package manager: npm, pnpm, yarn or bun
      --no-install       Skip installing dependencies
  -h, --help             Show this message
  -v, --version          Show the version

Examples:
  npx create-docs my-docs
  npx create-docs my-docs --template default --pm pnpm
  npx create-docs . --no-install
`

export function parseCliArgs(argv: string[]): CliOptions {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      template: { type: 'string', short: 't', default: 'default' },
      pm: { type: 'string' },
      // `parseArgs` has no negated-boolean support, so the flag is declared.
      'no-install': { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
      version: { type: 'boolean', short: 'v', default: false },
    },
  })

  return {
    directory: positionals[0],
    template: values.template ?? 'default',
    install: !values['no-install'],
    packageManager: values.pm,
    help: values.help ?? false,
    version: values.version ?? false,
  }
}
