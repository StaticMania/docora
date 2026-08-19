# Governance

This document describes how Docora is maintained and how changes are accepted.

## Maintainers

Docora is maintained by [StaticMania](https://staticmania.com). Maintainers have write access to the repository and publish the `docora` and `create-docora` packages to npm.

## Decision process

- **Small, obvious fixes** (typos, docs, bug fixes with a clear cause) can go straight to a pull request.
- **Features and breaking changes** should start as a GitHub issue so maintainers can agree on scope before implementation.
- Maintainers have the final say on whether a change lands. Disagreements are resolved by discussion on the issue or pull request.
- The [Code of Conduct](CODE_OF_CONDUCT.md) applies to all project spaces.

## Review and merge

1. A maintainer reviews the pull request for correctness, API stability, documentation, and fit with the project.
2. CI and `pnpm run verify` are expected to pass when they are available.
3. A maintainer merges to `main` when the review is complete. Squash merges are preferred so `main` stays readable.

## Releases

Maintainers publish from `main`:

- `pnpm run release:theme` publishes `docora`
- `pnpm run release:cli` publishes `create-docora`

Versions follow [Semantic Versioning](https://semver.org/). Notable changes are recorded in [CHANGELOG.md](CHANGELOG.md).

## Becoming a maintainer

Maintainer access is granted by StaticMania to people with a record of high-quality contributions and reviews. If you are interested, start by contributing through issues and pull requests as described in [CONTRIBUTING.md](CONTRIBUTING.md).
