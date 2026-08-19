import type { ReactNode } from 'react'

export interface DocsPageProps {
  children: ReactNode
  title?: string
  description?: string
  /** Small coloured label above the title, usually the navigation section. */
  section?: string
}

/** A single document: optional title block followed by rendered MDX. */
export function DocsPage({ children, title, description, section }: DocsPageProps) {
  const hasHeader = Boolean(title || description || section)

  return (
    <article className="w-full">
      {hasHeader && (
        <header className="mb-8 border-b border-border pb-8">
          {section && (
            <p className="-mt-1.5 mb-2 flex h-8 items-center text-sm font-semibold text-primary">{section}</p>
          )}
          {title && <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>}
          {description && <p className="mt-3 text-lg text-muted-foreground">{description}</p>}
        </header>
      )}
      {children}
    </article>
  )
}
