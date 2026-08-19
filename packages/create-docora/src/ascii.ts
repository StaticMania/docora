/**
 * Emerald from the Docora mark (`#34D399`). Built at runtime so no escape
 * byte sits in the source.
 */
export const THEME_COLOR = String.fromCharCode(27) + '[38;2;52;211;153m'
export const RESET = String.fromCharCode(27) + '[0m'

const useColor = process.stdout.isTTY && !process.env.NO_COLOR

function paint(line: string): string {
  return useColor ? THEME_COLOR + line + RESET : line
}

/** ANSI Shadow wordmark, coloured like the Nuxt CLI logo. */
export const DOCORA_WORDMARK = [
  '██████╗  ██████╗  ██████╗ ██████╗ ██████╗  █████╗',
  '██╔══██╗██╔═══██╗██╔════╝██╔═══██╗██╔══██╗██╔══██╗',
  '██║  ██║██║   ██║██║     ██║   ██║██████╔╝███████║',
  '██║  ██║██║   ██║██║     ██║   ██║██╔══██╗██╔══██║',
  '██████╔╝╚██████╔╝╚██████╗╚██████╔╝██║  ██║██║  ██║',
  '╚═════╝  ╚═════╝  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝',
]
  .map(paint)
  .join('\n')

export function paintTheme(text: string): string {
  if (!useColor) return text
  return THEME_COLOR + text + RESET
}
