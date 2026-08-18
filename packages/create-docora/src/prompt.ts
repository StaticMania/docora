import { createInterface } from 'node:readline/promises'

/** Asks for a value, returning the default when the answer is blank. */
export async function ask(question: string, fallback: string): Promise<string> {
  if (!process.stdin.isTTY) return fallback

  const rl = createInterface({ input: process.stdin, output: process.stdout })

  try {
    const answer = await rl.question(`${question} (${fallback}) `)
    return answer.trim() || fallback
  } finally {
    rl.close()
  }
}
