export interface SearchDocument {
  /** Route the result links to. */
  path: string
  title: string
  description?: string
  /** Section the page sits under, shown as a result group. */
  section?: string
  headings: { text: string; depth: number }[]
  /** Plain-text body, trimmed to keep the index small. */
  content: string
}

export interface SearchIndex {
  documents: SearchDocument[]
}
