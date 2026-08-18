'use client'

import type { ReactNode } from 'react'

import { SiteFooter } from '../components/site-footer'
import { SiteHeader } from '../components/site-header'
import { SidebarNav } from '../components/sidebar-nav'
import { TableOfContents } from '../components/toc'
import { useDocsConfig } from '../config/context'
import type { TocEntry } from '../mdx/toc'
import { cn } from '../utils/cn'

export interface DocsLayoutProps {
  children: ReactNode
  /** Headings of the current document, from `compileMdx`. */
  toc?: TocEntry[]
  /** Replaces the default header entirely. */
  header?: ReactNode
  className?: string
}

/** Documentation chrome: header, sidebar, content column, table of contents, footer. */
export function DocsLayout({ children, toc = [], header, className }: DocsLayoutProps) {
  const config = useDocsConfig()

  const navigation = config.navigation ?? []
  const hasSidebar = navigation.length > 0
  const hasToc = config.toc?.enabled !== false && toc.length > 0

  return (
    <div className="flex min-h-svh flex-col">
      {header ?? <SiteHeader />}

      <div className="mx-auto flex w-full max-w-8xl flex-1 gap-8 px-4 sm:px-6">
        {hasSidebar && (
          <aside className="sticky top-16 hidden h-[calc(100svh-4rem)] w-64 shrink-0 overflow-y-auto py-8 pr-4 lg:block">
            <SidebarNav items={navigation} />
          </aside>
        )}

        <main className={cn('min-w-0 flex-1 py-10 lg:py-14', className)}>{children}</main>

        {hasToc && (
          <aside className="sticky top-16 hidden h-[calc(100svh-4rem)] w-60 shrink-0 overflow-y-auto py-10 xl:block">
            <TableOfContents items={toc} />
          </aside>
        )}
      </div>

      <SiteFooter />
    </div>
  )
}
