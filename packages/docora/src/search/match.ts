import type { SearchDocument } from './types'

export interface SearchResult {
  document: SearchDocument
  /** The heading the match sits under, when the body matched. */
  heading?: { text: string; depth: number }
  /** Surrounding text with the match in it. */
  excerpt?: string
  score: number
}

const TITLE_SCORE = 100
const HEADING_SCORE = 50
const DESCRIPTION_SCORE = 30
const CONTENT_SCORE = 10

function normalize(value: string): string {
  return value.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
}

function excerptAround(content: string, index: number, query: string): string {
  let start = Math.max(0, index - 40)
  let end = Math.min(content.length, index + query.length + 80)

  // Snap outwards to word boundaries so the excerpt never starts mid-word.
  while (start > 0 && !/\s/.test(content[start - 1]!)) start -= 1
  while (end < content.length && !/\s/.test(content[end]!)) end += 1

  const slice = content.slice(start, end).trim()

  return `${start > 0 ? '…' : ''}${slice}${end < content.length ? '…' : ''}`
}

/**
 * Ranks documents against a query.
 *
 * Every term has to appear somewhere in the document, so "config theme" only
 * matches pages containing both. Where a term appears decides the weight:
 * a title hit outranks a body hit.
 */
export function searchDocuments(
  documents: SearchDocument[],
  query: string,
  limit = 12,
): SearchResult[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []

  const results: SearchResult[] = []

  for (const document of documents) {
    const title = normalize(document.title)
    const description = normalize(document.description ?? '')
    const content = normalize(document.content)
    const headings = document.headings.map(heading => ({ heading, text: normalize(heading.text) }))

    let score = 0
    let matchedHeading: SearchResult['heading']
    let excerpt: string | undefined

    for (const term of terms) {
      let termScore = 0

      if (title.includes(term)) {
        termScore = TITLE_SCORE + (title.startsWith(term) ? 25 : 0)
      }

      const headingHit = headings.find(entry => entry.text.includes(term))
      if (headingHit) {
        termScore = Math.max(termScore, HEADING_SCORE)
        matchedHeading ??= headingHit.heading
      }

      if (description.includes(term)) termScore = Math.max(termScore, DESCRIPTION_SCORE)

      const contentIndex = content.indexOf(term)
      if (contentIndex !== -1) {
        termScore = Math.max(termScore, CONTENT_SCORE)
        excerpt ??= excerptAround(document.content, contentIndex, term)
      }

      // Every term must land somewhere, otherwise the document is out.
      if (termScore === 0) {
        score = 0
        break
      }

      score += termScore
    }

    if (score > 0) {
      results.push({
        document,
        score,
        ...(matchedHeading ? { heading: matchedHeading } : {}),
        ...(excerpt ? { excerpt } : {}),
      })
    }
  }

  return results
    .sort((a, b) => b.score - a.score || a.document.title.localeCompare(b.document.title))
    .slice(0, limit)
}

/** Turns a heading into the anchor `rehype-slug` generated for it. */
export function headingSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}
