# Contributing to Docora

Thank you for your interest in Docora. This guide is the contribution process for the project: how to report issues, propose changes, and get a pull request merged.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). By submitting a contribution, you agree that it will be licensed under the [MIT License](LICENSE).

## Ways to contribute

- Fix bugs or improve the theme, CLI, starters, or documentation
- Report bugs and request features through GitHub Issues
- Improve docs, examples, and TypeScript types
- Review pull requests and help triage issues

Please search [existing issues](https://github.com/StaticMania/docora/issues) and [pull requests](https://github.com/StaticMania/docora/pulls) before opening a new one.

Security reports follow [SECURITY.md](SECURITY.md) — do not file them as public issues.

## Repository layout

This is a pnpm monorepo:

| Path | Package | Purpose |
| --- | --- | --- |
| `packages/docora` | `docora` | Next.js documentation theme |
| `packages/create-docora` | `create-docora` | Project scaffolding CLI |
| `apps/docs` | `docs` | Official documentation site |
| `apps/playground` | `playground` | Internal playground |
| `.starters/*` | — | Templates copied by the CLI (not workspace packages) |

Starter templates live in `.starters/`. The CLI copies them into `packages/create-docora/templates` at build time. Edit `.starters`, not the generated `templates` folder.

## Development setup

Requirements:

- Node.js 20.9 or later
- [pnpm](https://pnpm.io) 9.15.1 (see `packageManager` in the root `package.json`)

```bash
git clone https://github.com/StaticMania/docora.git
cd docora
pnpm install
pnpm run dev
```

`pnpm run dev` starts the documentation site at [http://localhost:3000](http://localhost:3000). Useful scripts:

| Command | What it does |
| --- | --- |
| `pnpm run dev` | Run the docs site |
| `pnpm run playground:dev` | Run the playground |
| `pnpm run typecheck` | Type-check every package |
| `pnpm run lint` | Lint the repo |
| `pnpm run format` | Format with Prettier |
| `pnpm run verify` | Typecheck, lint, format check, and build |
| `pnpm run build` | Build the CLI templates and the docs site |

## Pull request process

1. Open an issue first for larger changes so maintainers can discuss scope.
2. Fork the repository and create a branch from `main`.
3. Keep the change focused. Prefer small pull requests over mixed refactors.
4. Match existing code style. Do not reformat unrelated files.
5. Update documentation when behaviour or public APIs change.
6. Run `pnpm run verify` locally before you open the pull request.
7. Fill in the pull request template. Link related issues with `Fixes #123` when applicable.

Maintainers review for correctness, API stability, docs impact, and fit with the project. See [GOVERNANCE.md](GOVERNANCE.md) for how decisions and releases work.

## Commit messages

Write a short, complete sentence that explains **why** the change exists, not only what files changed.

Good: `Fix sidebar order when numeric prefixes share the same parent.`

Avoid: `update`, `fix stuff`, or dumping every file name in the subject.

## What we look for in reviews

- Theme and CLI public APIs stay stable unless the PR is an intentional breaking change
- Starter templates stay in sync with the docs site patterns
- No secrets, credentials, or generated build artefacts
- New UI follows existing Docora layout, tokens, and accessibility patterns

If you are unsure where a change belongs, open an issue and ask. We are happy to help you land it.
