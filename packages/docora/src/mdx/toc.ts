import type { Element, Nodes, Root } from 'hast'
import { visit } from 'unist-util-visit'

export interface TocEntry {
  id: string
  text: string
  /** Heading level: 2 for `##`, 3 for `###`, … */
  depth: number
}

/** A `TocEntry` with its deeper headings nested underneath. */
export interface TocNode extends TocEntry {
  children: TocNode[]
}

/**
 * Nest a flat heading list by depth.
 *
 * `compileMdx` returns the flat list because scroll tracking needs headings in
 * document order; the rendered list wants them as a tree.
 */
export function buildTocTree(entries: TocEntry[]): TocNode[] {
  const root: TocNode[] = []
  const stack: TocNode[] = []

  for (const entry of entries) {
    const node: TocNode = { ...entry, children: [] }

    while (stack.length > 0 && stack[stack.length - 1]!.depth >= node.depth) {
      stack.pop()
    }

    const parent = stack[stack.length - 1]
    if (parent) parent.children.push(node)
    else root.push(node)

    stack.push(node)
  }

  return root
}

const HEADING_DEPTHS: Record<string, number> = { h2: 2, h3: 3, h4: 4 }

function textContent(node: Nodes): string {
  if (node.type === 'text') return node.value
  if ('children' in node) return node.children.map(textContent).join('')
  return ''
}

/**
 * Collects headings into `entries` while the document is being compiled.
 *
 * Runs after `rehype-slug`, so every heading already carries the `id` the
 * table of contents links to.
 */
export function rehypeCollectToc(entries: TocEntry[]) {
  return function collect() {
    return (tree: Root) => {
      visit(tree, 'element', (node: Element) => {
        const depth = HEADING_DEPTHS[node.tagName]
        const id = node.properties?.id

        if (!depth || typeof id !== 'string' || !id) return

        entries.push({ id, text: textContent(node), depth })
      })
    }
  }
}
