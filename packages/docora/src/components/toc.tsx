'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { useDocsConfig } from '../config/context'
import { useMessages } from '../i18n/context'
import { useActiveHeadings } from '../hooks/use-active-heading'
import { buildTocTree, type TocEntry, type TocNode } from '../mdx/toc'
import { cn } from '../utils/cn'
import { ExplainWithAi } from './assistant-trigger'
import { PageLinks } from './edit-link'
import { Icon } from './icon'
import { circuitRailStyle, TOC_LINK_HEIGHT_REM } from './toc-rail'

export type TableOfContentsProps = Readonly<{
  items: TocEntry[]
  /** Page path relative to the content directory, for the edit link. */
  relativePath?: string
  /** Page title, used to pre-fill a reported issue. */
  title?: string
  className?: string
}>

interface FlatLink {
  id: string
  /** Nesting level in the rendered list, not the heading depth. */
  level: number
}

function flattenTree(nodes: TocNode[], level = 0): FlatLink[] {
  return nodes.flatMap(node => [{ id: node.id, level }, ...flattenTree(node.children, level + 1)])
}

function TocList({
  nodes,
  level,
  activeIds,
}: Readonly<{
  nodes: TocNode[]
  level: number
  activeIds: Set<string>
}>) {
  return (
    <ul className={cn('min-w-0', level > 0 ? 'ms-3' : 'ps-6.5')}>
      {nodes.map(node => (
        <li key={node.id} className={cn('-ms-px min-w-0', node.children.length > 0 && 'ps-px')}>
          <a
            href={`#${node.id}`}
            className={cn(
              // The 1.75rem row height is what the rail mask is measured against.
              'relative flex items-center rounded-sm py-1 text-sm leading-5',
              activeIds.has(node.id)
                ? 'text-primary'
                : 'text-muted-foreground transition-colors hover:text-highlighted',
            )}
          >
            <span className="truncate">{node.text}</span>
          </a>

          {node.children.length > 0 && (
            <TocList nodes={node.children} level={level + 1} activeIds={activeIds} />
          )}
        </li>
      ))}
    </ul>
  )
}

export function TableOfContents({ items, relativePath, title, className }: TableOfContentsProps) {
  const config = useDocsConfig()
  const messages = useMessages()
  const activeIds = useActiveHeadings(items.map(item => item.id))
  const tree = useMemo(() => buildTocTree(items), [items])
  const flat = useMemo(() => flattenTree(tree), [tree])
  const railStyle = useMemo(() => circuitRailStyle(flat.map(link => link.level)), [flat])

  const activeSet = useMemo(() => new Set(activeIds), [activeIds])
  const activeIndex = flat.findIndex(link => activeSet.has(link.id))
  const bottom = config.toc?.bottom

  if (items.length === 0 && !bottom?.links?.length) return null

  return (
    <div className={cn('flex flex-col gap-6 text-sm', className)}>
      {tree.length > 0 && (
        <nav aria-labelledby="toc-heading">
          <p
            id="toc-heading"
            className="-mt-1.5 mb-2 flex h-8 items-center text-sm font-semibold text-highlighted"
          >
            {config.toc?.title ?? messages.tocTitle}
          </p>

          <div className="relative">
            <div className="absolute top-0 start-0 ms-2.5" style={railStyle} aria-hidden>
              <div className="absolute inset-0 bg-border" />

              {activeIndex >= 0 && (
                <div
                  className="absolute w-full bg-primary transition-[translate,height] duration-200 ease-out"
                  style={{
                    height: `${activeIds.length * TOC_LINK_HEIGHT_REM}rem`,
                    translate: `0 ${activeIndex * TOC_LINK_HEIGHT_REM}rem`,
                  }}
                />
              )}
            </div>

            <TocList nodes={tree} level={0} activeIds={activeSet} />
          </div>
        </nav>
      )}

      <div
        className={cn(
          'flex flex-col gap-3',
          tree.length > 0 && 'border-t border-dashed border-border pt-6',
        )}
      >
        <PageLinks relativePath={relativePath} title={title} />
        {config.assistant?.explainWithAi !== false && <ExplainWithAi />}
      </div>

      {bottom?.links && bottom.links.length > 0 && (
        <div
          className={cn(
            'flex flex-col gap-6',
            tree.length > 0 && 'border-t border-dashed border-border pt-6',
          )}
        >
          <div>
            {bottom.title && (
              <p className="mb-2 text-sm font-semibold text-highlighted">{bottom.title}</p>
            )}

            <ul className="space-y-1">
              {bottom.links.map(link => {
                const external = link.external ?? link.href.startsWith('http')

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="group flex items-center gap-1.5 py-1 text-sm text-muted-foreground transition-colors hover:text-highlighted"
                    >
                      {link.icon && <Icon name={link.icon} className="size-4 shrink-0" />}
                      <span className="truncate">{link.label}</span>
                      {external && (
                        <ArrowUpRight className="size-3 shrink-0 self-start" aria-hidden />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
