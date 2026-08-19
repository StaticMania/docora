import { cancel, isCancel } from '@clack/prompts'

/** Exits cleanly when the user hits Ctrl+C on a Clack prompt. */
export function handleCancel<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel('Operation cancelled.')
    process.exit(1)
  }

  return value
}
