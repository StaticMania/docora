import type { NavItem } from '../config/types'
import { humanize } from './slug'
import type { ContentDirectory } from './tree'
import type { ContentPage, PageSurround } from './types'

function isHidden(page: ContentPage): boolean {
  return page.frontmatter.navigation === false
}

function navLabel(page: ContentPage): string {
  const override = page.frontmatter.navigation
  if (typeof override === 'object' && override.title) return override.title

  return page.title
}

function navIcon(page: ContentPage): string | undefined {
  const override = page.frontmatter.navigation
  if (typeof override === 'object' && override.icon) return override.icon

  return page.frontmatter.icon
}

function pageToNavItem(page: ContentPage): NavItem {
  return {
    label: navLabel(page),
    href: page.path,
    ...(navIcon(page) ? { icon: navIcon(page) } : {}),
  }
}

/**
 * Turn a content directory into the sidebar tree.
 *
 * A directory becomes a section: its `.navigation.yml` supplies the title and
 * icon, and its `index` page — if it has one — becomes the section's own link.
 */
export function buildNavigation(directory: ContentDirectory): NavItem[] {
  const items: NavItem[] = []

  if (directory.index && !isHidden(directory.index)) {
    items.push(pageToNavItem(directory.index))
  }

  for (const page of directory.pages) {
    if (isHidden(page)) continue
    items.push(pageToNavItem(page))
  }

  for (const child of directory.directories) {
    if (child.meta.navigation === false) continue

    const children = buildNavigation(child)
    if (children.length === 0) continue

    items.push({
      label: child.meta.title ?? child.index?.title ?? humanize(child.name),
      ...(child.meta.icon ? { icon: child.meta.icon } : {}),
      children,
    })
  }

  return items
}

/** Flatten a nav tree to the links it contains, in order. */
export function flattenNavigation(items: NavItem[]): NavItem[] {
  return items.flatMap(item => (item.children ? flattenNavigation(item.children) : item.href ? [item] : []))
}

/** The previous and next links around a path, for the pager. */
export function findSurround(items: NavItem[], currentPath: string): PageSurround {
  const links = flattenNavigation(items)
  const index = links.findIndex(link => link.href === currentPath)

  if (index === -1) return {}

  return {
    ...(index > 0 ? { prev: links[index - 1] } : {}),
    ...(index < links.length - 1 ? { next: links[index + 1] } : {}),
  }
}
