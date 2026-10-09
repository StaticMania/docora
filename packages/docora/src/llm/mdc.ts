/**
 * Normalizes Nuxt/Docora MDC syntax into clean, token-efficient
 * GitHub Flavored Markdown (GFM) for LLMs and AI agents.
 */

function parseAttributes(attrStr?: string): Record<string, string> {
  if (!attrStr) return {}
  const attrs: Record<string, string> = {}
  const re = /([a-zA-Z0-9_-]+)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g
  let match: RegExpExecArray | null
  while ((match = re.exec(attrStr)) !== null) {
    const key = match[1]
    const val = match[2] ?? match[3] ?? match[4] ?? 'true'
    if (key) attrs[key] = val
  }
  return attrs
}

const ALERT_TYPES: Record<string, string> = {
  note: 'NOTE',
  tip: 'TIP',
  warning: 'WARNING',
  danger: 'CAUTION',
  caution: 'CAUTION',
  important: 'IMPORTANT',
}

function shieldCodeBlocks(content: string): { shielded: string; blocks: string[] } {
  const blocks: string[] = []
  // Shield fenced code blocks (3+ backticks or tildes) and inline code spans
  const pattern =
    /(?:^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n[ \t]*\1[ \t]*$)|(?:(?<!`)(`+)(?!`)[^\n]+?\2(?!`))/gm
  const shielded = content.replace(pattern, match => {
    const placeholder = `__DOCORA_CODE_BLOCK_${blocks.length}__`
    blocks.push(match)
    return placeholder
  })
  return { shielded, blocks }
}

function restoreCodeBlocks(content: string, blocks: string[]): string {
  let restored = content
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (block !== undefined) {
      restored = restored.replace(`__DOCORA_CODE_BLOCK_${i}__`, () => block)
    }
  }
  return restored
}

export function normalizeMdcToMarkdown(raw: string): string {
  if (!raw || !raw.trim()) return ''

  // Step 1: Shield code blocks so MDC-like examples inside code blocks remain completely untouched.
  // Normalize CRLF to LF so regex line ending lookaheads ($ and \n) work consistently across platforms.
  const { shielded, blocks } = shieldCodeBlocks(raw.replace(/\r\n/g, '\n'))
  let text = shielded

  // Step 2: Normalize callout/alert directives (e.g. ::note, :::tip{title="..."}, ::callout{color="..."})
  text = text.replace(
    /(?:^|\n)(:{2,4})(callout|note|tip|warning|danger|caution|important)(?![a-zA-Z0-9_-])(?:\{([^}]*)\})?\s*\n([\s\S]*?)\n\s*\1(?=\n|$)/g,
    (_, _colons, type, attrStr, body) => {
      const attrs = parseAttributes(attrStr)
      let alertType = ALERT_TYPES[type.toLowerCase()] || 'NOTE'
      if (type.toLowerCase() === 'callout') {
        const color = attrs.color?.toLowerCase()
        if (color === 'warning') alertType = 'WARNING'
        else if (color === 'error' || color === 'danger') alertType = 'CAUTION'
        else if (color === 'success') alertType = 'TIP'
        else if (color === 'important') alertType = 'IMPORTANT'
        else alertType = 'NOTE'
      }
      const title = attrs.title ? `**${attrs.title}**\n\n` : ''
      const inner = `${title}${body.trim()}`
      const quoted = inner
        .split('\n')
        .map(line => (line.trim() ? `> ${line}` : '>'))
        .join('\n')
      return `\n\n> [!${alertType}]\n${quoted}\n\n`
    },
  )

  // Step 3: Normalize card directives (e.g. :::card{title="..." to="..."} description :::)
  text = text.replace(
    /(?:^|\n)(:{2,4})card(?![a-zA-Z0-9_-])(?:\{([^}]*)\})?\s*\n?([\s\S]*?)\n?\s*\1(?=\n|$)/g,
    (_, _colons, attrStr, body) => {
      const attrs = parseAttributes(attrStr)
      const title = attrs.title || ''
      const href = attrs.to || attrs.href || ''
      const desc = attrs.description || body.trim()
      if (title && href) {
        return `\n\n- [**${title}**](${href})${desc ? `: ${desc}` : ''}\n\n`
      }
      if (title) {
        return `\n\n- **${title}**${desc ? `: ${desc}` : ''}\n\n`
      }
      return desc ? `\n\n${desc}\n\n` : ''
    },
  )

  // Step 4: Normalize CTA directives (e.g. ::::cta{label="..." to="..."})
  text = text.replace(
    /(?:^|\n)(:{2,4})cta(?![a-zA-Z0-9_-])(?:\{([^}]*)\})?(?:\[([^\]]*)\])?(?:\s*\n?\s*\1)?(?=\n|$)/g,
    (_, _colons, attrStr, labelBracket) => {
      const attrs = parseAttributes(attrStr)
      const label = labelBracket || attrs.label || attrs.title || 'Learn more'
      const href = attrs.to || attrs.href || '#'
      return `\n[${label}](${href})\n`
    },
  )

  // Step 5: Normalize Field & Field-group
  text = text.replace(
    /(?:^|\n)(:{2,4})field(?![a-zA-Z0-9_-])(?:\{([^}]*)\})?\s*\n?([\s\S]*?)\n?\s*\1(?=\n|$)/g,
    (_, _colons, attrStr, body) => {
      const attrs = parseAttributes(attrStr)
      const name = attrs.name || ''
      const type = attrs.type ? ` (\`${attrs.type}\`)` : ''
      const required = attrs.required ? ' *(required)*' : ''
      const desc = body.trim()
      return `\n- **\`${name}\`**${type}${required}${desc ? `: ${desc}` : ''}\n`
    },
  )

  // Step 6: Normalize Tabs items (e.g. ::::tabs-item{label="X"})
  text = text.replace(
    /(?:^|\n)(:{2,4})tabs-item(?![a-zA-Z0-9_-])(?:\{([^}]*)\})?\s*(?=\n|$)/g,
    (_, _colons, attrStr) => {
      const attrs = parseAttributes(attrStr)
      const label = attrs.label || attrs.title || 'Tab'
      return `\n\n#### ${label}\n\n`
    },
  )

  // Step 7: Normalize Accordion items (e.g. :::accordion-item{label="X"})
  text = text.replace(
    /(?:^|\n)(:{2,4})accordion-item(?![a-zA-Z0-9_-])(?:\{([^}]*)\})?\s*(?=\n|$)/g,
    (_, _colons, attrStr) => {
      const attrs = parseAttributes(attrStr)
      const label = attrs.label || attrs.title || 'Item'
      return `\n\n### ${label}\n\n`
    },
  )

  // Step 8: Normalize Hero (e.g. ::hero{title="X" description="Y"})
  text = text.replace(
    /(?:^|\n)(:{2,4})hero(?![a-zA-Z0-9_-])(?:\{([^}]*)\})?\s*(?=\n|$)/g,
    (_, _colons, attrStr) => {
      const attrs = parseAttributes(attrStr)
      const title = attrs.title ? `# ${attrs.title}\n\n` : ''
      const desc = attrs.description ? `> ${attrs.description}\n\n` : ''
      return `\n\n${title}${desc}`
    },
  )

  // Step 9: Normalize Step directives (e.g. ::step{title="Step 1"})
  text = text.replace(
    /(?:^|\n)(:{2,4})step(?![a-zA-Z0-9_-])(?:\{([^}]*)\})?\s*\n?([\s\S]*?)\n?\s*\1(?=\n|$)/g,
    (_, _colons, attrStr, body) => {
      const attrs = parseAttributes(attrStr)
      const title = attrs.title ? `#### ${attrs.title}\n\n` : ''
      return `\n\n${title}${body.trim()}\n\n`
    },
  )

  // Step 10: Normalize Collapsible directives (e.g. :::collapsible{name="..."})
  text = text.replace(
    /(?:^|\n)(:{2,4})collapsible(?![a-zA-Z0-9_-])(?:\{([^}]*)\})?\s*\n?([\s\S]*?)\n?\s*\1(?=\n|$)/g,
    (_, _colons, attrStr, body) => {
      const attrs = parseAttributes(attrStr)
      const label = attrs.name || attrs.label || attrs.title || 'Details'
      return `\n\n<details>\n<summary>${label}</summary>\n\n${body.trim()}\n\n</details>\n\n`
    },
  )

  // Step 11: Inline directives (:badge[text], :kbd[keys], etc.)
  text = text.replace(/:[a-zA-Z0-9_-]+\[([^\]]+)\](?:\{[^}]*\})?/g, '$1')
  text = text.replace(/:kbd\{keys="([^"]*)"\}/g, '$1')
  text = text.replace(/:badge\{text="([^"]*)"[^}]*\}/g, '$1')
  text = text.replace(/:icon\{[^}]*\}/g, '')

  // Step 12: Unknown / custom container directives:
  // Degrade gracefully to inner content without losing any text
  text = text.replace(/(?:^|\n):{2,}[a-zA-Z0-9_-]+(?:\{[^}]*\})?\s*(?=\n|$)/g, '\n')
  // Strip any remaining closing colons (::, :::, ::::) on their own lines
  text = text.replace(/(?:\n|^)\s*:{2,}\s*(?=\n|$)/g, '\n')

  // Step 13: Clean up excessive blank lines (3+ newlines -> 2)
  text = text.replace(/\n{3,}/g, '\n\n')

  // Step 14: Restore code blocks completely intact
  return restoreCodeBlocks(text, blocks).trim()
}
