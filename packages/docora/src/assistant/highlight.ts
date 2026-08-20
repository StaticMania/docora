type Highlighter = {
  getLoadedLanguages: () => string[]
  loadLanguage: (lang: string) => Promise<unknown>
  codeToHtml: (
    code: string,
    options: {
      lang: string
      themes: { light: string; dark: string }
      defaultColor: false
      transformers: Array<{
        pre?: (node: { properties: Record<string, unknown> }) => void
        code?: (node: { properties: Record<string, unknown> }) => void
        line?: (node: { properties: Record<string, unknown> }) => void
      }>
    },
  ) => string
}

let highlighterPromise: Promise<Highlighter> | null = null

const PRELOAD = [
  'typescript',
  'javascript',
  'tsx',
  'jsx',
  'bash',
  'json',
  'css',
  'html',
  'markdown',
  'yaml',
] as const

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki/bundle/web').then(({ getSingletonHighlighter }) =>
      getSingletonHighlighter({
        themes: ['github-light', 'github-dark'],
        langs: [...PRELOAD],
      }),
    ) as Promise<Highlighter>
  }

  return highlighterPromise
}

function resolveLang(lang: string): string {
  const lower = lang.toLowerCase().trim()
  if (!lower || lower === 'plaintext' || lower === 'text' || lower === 'txt') return 'text'
  return lower
}

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function plainFence(code: string): string {
  const lines = code
    .split('\n')
    .map(line => `<span data-line>${escapeHtml(line)}</span>`)
    .join('\n')

  return `<pre><code data-theme="github-light github-dark">${lines}</code></pre>`
}

/**
 * Highlight a fence for the assistant chat, using the same dual GitHub themes
 * as compiled docs so token colours follow light/dark mode.
 */
export async function highlightCode(code: string, lang = 'text'): Promise<string> {
  const highlighter = await getHighlighter()
  const resolved = resolveLang(lang)

  if (resolved !== 'text' && !highlighter.getLoadedLanguages().includes(resolved)) {
    try {
      await highlighter.loadLanguage(resolved)
    } catch {
      return plainFence(code)
    }
  }

  const language = highlighter.getLoadedLanguages().includes(resolved) ? resolved : null
  if (!language) return plainFence(code)

  return highlighter.codeToHtml(code, {
    lang: language,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          const style = node.properties.style
          if (typeof style === 'string') {
            node.properties.style = style.replace(/background-color:[^;]+;?/gi, '')
          }
        },
        code(node) {
          node.properties['data-theme'] = 'github-light github-dark'
        },
        line(node) {
          node.properties['data-line'] = ''
        },
      },
    ],
  })
}
