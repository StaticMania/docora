export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

const SUPPORTED: PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun']

export function isPackageManager(value: string): value is PackageManager {
  return (SUPPORTED as string[]).includes(value)
}

/**
 * Whatever ran this command. npm, pnpm, yarn and bun all identify themselves
 * in `npm_config_user_agent`, so `pnpm create docs` scaffolds a pnpm project.
 */
export function detectPackageManager(userAgent = process.env.npm_config_user_agent): PackageManager {
  const name = userAgent?.split('/')[0]
  return name && isPackageManager(name) ? name : 'npm'
}

/** How to tell each manager to run a package script. */
export function runCommand(manager: PackageManager, script: string): string {
  return manager === 'npm' ? `npm run ${script}` : `${manager} ${script}`
}
