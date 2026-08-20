# create-docora

Scaffold a [Docora](https://github.com/StaticMania/docora) documentation site.

[![npm version](https://img.shields.io/npm/v/create-docora.svg?style=flat&colorA=020420&colorB=EEEEEE)](https://npmjs.com/package/create-docora)
[![License](https://img.shields.io/npm/l/create-docora.svg?style=flat&colorA=020420&colorB=EEEEEE)](https://npmjs.com/package/create-docora)

```bash
npx create-docora my-docs
```

The CLI copies a starter into the target directory, sets the package name, optionally installs dependencies, and can initialize git. Templates ship inside the package, so scaffolding works offline.

Requires **Node.js 20.9** or later.

## Usage

Run it with any package manager. The invoking manager is detected from `npm_config_user_agent` and used as the default when you are prompted.

```bash
npx create-docora my-docs
pnpm dlx create-docora my-docs
yarn dlx create-docora my-docs
bunx create-docora my-docs
```

In a terminal the CLI is interactive: it asks for a directory, template, package manager, and whether to initialize git. Pass flags to skip those questions.

```bash
npx create-docora my-docs --template i18n --pm pnpm
npx create-docora . --no-install --no-git-init
```

Without a TTY (CI, piped input) there are no prompts. Defaults are:

| Setting | Default |
| --- | --- |
| Directory | `my-docs` |
| Template | `default` |
| Package manager | the invoking manager, or `npm` |
| Install | yes |
| Git init | no |

If the target already exists and is not empty, pass `--force` or choose a different directory. `--force` empties the directory in place so you can scaffold into `.` without deleting the working directory itself.

After scaffolding:

```bash
cd my-docs
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If you used `--no-install`, run `<pm> install` first.

## Options

```
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
```

`--git-init` / `--no-git-init` both skip the prompt. Git failures are reported but do not roll back the project.

## Templates

Starters live in [`.starters`](https://github.com/StaticMania/docora/tree/main/.starters) and are copied into this package at build time.

| Name | Description |
| --- | --- |
| `default` | Single-language docs. Recommended starting point. |
| `i18n` | Multi-language docs with locale-prefixed routes. |

```bash
npx create-docora my-docs -t i18n
```

Both starters are Next.js App Router apps with MDX content, search, dark mode, sitemap, `llms.txt`, an MCP server, and optional AI assistant wiring. See the [Docora README](https://github.com/StaticMania/docora#readme) for content layout, configuration, and customization.

The generated `package.json` `name` is derived from the target directory.

## Local development

This package is part of the [Docora monorepo](https://github.com/StaticMania/docora). Edit starters in `.starters/`, not the generated `templates/` folder.

```bash
pnpm install
pnpm --filter create-docora build
node packages/create-docora/dist/index.mjs my-docs
```

`pnpm --filter create-docora dev` watches the CLI. See [CONTRIBUTING.md](https://github.com/StaticMania/docora/blob/main/CONTRIBUTING.md) for the full workflow.

## License

[MIT](LICENSE) © StaticMania
