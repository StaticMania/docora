import { Public_Sans } from 'next/font/google'

/**
 * The theme's default typeface.
 *
 * `DocsRoot` applies this automatically. Override it by setting
 * `--docs-font-sans` on `:root` in your own stylesheet.
 */
export const docsFont = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--docs-font-sans',
})
