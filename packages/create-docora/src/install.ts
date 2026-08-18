import { spawn } from 'node:child_process'

import type { PackageManager } from './package-manager'

/** Runs the package manager's install in the new project, inheriting its output. */
export function installDependencies(manager: PackageManager, cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(manager, ['install'], {
      cwd,
      stdio: 'inherit',
      // npm and friends are batch files on Windows, which need a shell.
      shell: process.platform === 'win32',
    })

    child.on('error', reject)
    child.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(`${manager} install exited with code ${code}`))
    })
  })
}
