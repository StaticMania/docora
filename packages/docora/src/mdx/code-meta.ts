import type { Element, Root } from 'hast'
import type { Options as PrettyCodeOptions } from 'rehype-pretty-code'
import type { ShikiTransformer } from 'shiki'
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
} from '@shikijs/transformers'
import { visit } from 'unist-util-visit'

/**
 * Turns fence extras into the meta rehype-pretty-code understands:
 *
 * ```ts [next.config.ts]
 * ```ts [next.config.ts]{1,3-5}
 * ```ts [app.css] line-numbers
 * ```
 */
export function filterCodeMeta(meta: string): string {
  let next = meta

  if (!/\btitle\s*=/.test(next)) {
    const filename = next.match(/\[([^\]]+)\]/)?.[1]
    if (filename) next = next.replace(`[${filename}]`, `title="${filename}"`)
  }

  return next.replace(/\bline-numbers\b/, 'showLineNumbers')
}

function elementText(node: Element): string {
  return node.children
    .map(child => {
      if (child.type === 'text') return child.value
      if (child.type === 'element') return elementText(child)
      return ''
    })
    .join('')
}

function isElement(node: Root['children'][number] | Element['children'][number]): node is Element {
  return node.type === 'element'
}

/**
 * Copies the title, language and line-number flags Pretty Code hangs on nested
 * nodes onto the wrapping `<figure>`, so React components can read them as
 * props (`::code-group` tabs, the filename header, …).
 */
export function rehypePrettyCodeFigure() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'figure') return
      if (node.properties['data-rehype-pretty-code-figure'] === undefined) return

      const title = node.children.find(
        (child): child is Element =>
          isElement(child) &&
          child.properties['data-rehype-pretty-code-title'] !== undefined,
      )
      const pre = node.children.find((child): child is Element => isElement(child) && child.tagName === 'pre')
      const code = pre?.children.find((child): child is Element => isElement(child) && child.tagName === 'code')

      if (title) {
        const filename = elementText(title).trim()
        if (filename) node.properties['data-filename'] = filename
      }

      const language = pre?.properties['data-language'] ?? code?.properties['data-language']
      if (typeof language === 'string' && language.length > 0) {
        node.properties['data-language'] = language
      }

      if (code?.properties['data-line-numbers'] !== undefined) {
        node.properties['data-line-numbers'] = 'true'
      }
    })
  }
}

/** Dual-theme Pretty Code config used when compiling MDX. */
export const prettyCodeOptions: PrettyCodeOptions = {
  keepBackground: false,
  bypassInlineCode: true,
  defaultLang: { block: 'plaintext' },
  theme: { light: 'github-light', dark: 'github-dark' },
  filterMetaString: filterCodeMeta,
  transformers: [
    transformerNotationDiff(),
    transformerNotationHighlight(),
    transformerNotationFocus(),
    transformerNotationErrorLevel(),
  ],
}

/**
 * Reads extras in a fence's meta string and hangs them on the `<pre>` so a
 * Shiki pipeline can render a header. Prefer Pretty Code for compiled docs;
 * this remains for anyone highlighting with Shiki directly.
 *
 * ```ts [next.config.ts]
 * ```ts [next.config.ts]{1,3-5}
 * ```
 */
export function transformerCodeMeta(): ShikiTransformer {
  return {
    name: 'docora:code-meta',
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
  if (filename.endsWith('/')) return 'folder'

  const lower = filename.toLowerCase()
  if (NAMED_ICONS[lower]) return NAMED_ICONS[lower]!

  const extension = lower.split('.').pop() ?? ''
  return FILENAME_ICONS[extension] ?? 'file-code'
}
