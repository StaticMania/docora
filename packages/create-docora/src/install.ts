import { spawn } from 'node:child_process'

import { installDependencies as nypmInstall } from 'nypm'

import type { PackageManager } from './package-manager'

/** Silent install so Clack can show a loading task instead of a raw log dump. */
export async function installDependencies(manager: PackageManager, cwd: string): Promise<void> {
  await nypmInstall({
    cwd,
    silent: true,
    packageManager: { name: manager, command: manager },
  })
}

export function initializeGit(cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['init'], {
      cwd,
      stdio: 'ignore',
      shell: process.platform === 'win32',
    })

    child.on('error', reject)
    child.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(`git init exited with code ${code}`))
    })
  })
}
