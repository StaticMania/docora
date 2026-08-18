import type { ShikiTransformer } from 'shiki'

/**
 * Reads the extras Docus puts in a fence's meta string and hangs them on the
 * `<pre>` so the React component can render a header:
 *
 * ```ts [nuxt.config.ts]
 * ```ts [nuxt.config.ts]{1,3-5}
 * ```
 */
export function transformerCodeMeta(): ShikiTransformer {
  return {
    name: 'docs-theme:code-meta',
    pre(node) {
      const raw = String((this.options.meta as { __raw?: string } | undefined)?.__raw ?? '')

      const filename = raw.match(/\[([^\]]+)\]/)?.[1]
      if (filename) node.properties['data-filename'] = filename

      if (this.options.lang && this.options.lang !== 'text') {
        node.properties['data-language'] = this.options.lang
      }

      if (/\bline-numbers\b/.test(raw)) node.properties['data-line-numbers'] = 'true'
    },
  }
}

/** Extension → icon name, used for the little mark beside a filename. */
const FILENAME_ICONS: Record<string, string> = {
  ts: 'file-code',
  tsx: 'file-code',
  js: 'file-code',
  jsx: 'file-code',
  mjs: 'file-code',
  json: 'braces',
  css: 'palette',
  md: 'file-text',
  mdx: 'file-text',
  mdc: 'file-text',
  yml: 'settings',
  yaml: 'settings',
  html: 'code',
  vue: 'file-code',
  sh: 'terminal',
  bash: 'terminal',
  zsh: 'terminal',
}

const NAMED_ICONS: Record<string, string> = {
  terminal: 'terminal',
  'package.json': 'package',
  dockerfile: 'container',
}

export function iconForFilename(filename: string): string {
  const lower = filename.toLowerCase()
  if (NAMED_ICONS[lower]) return NAMED_ICONS[lower]!

  const extension = lower.split('.').pop() ?? ''
  return FILENAME_ICONS[extension] ?? 'file-code'
}
