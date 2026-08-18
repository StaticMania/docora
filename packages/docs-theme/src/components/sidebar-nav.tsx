'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { NavItem } from '../config/types'
import { useMessages } from '../i18n/context'
import { cn } from '../utils/cn'
import { Icon } from './icon'

export interface SidebarNavProps {
  items: NavItem[]
  /** Called after a link is followed — used to close the mobile drawer. */
  onNavigate?: () => void
  className?: string
}

/** Shared row geometry: `size-5` icons and `py-1.5` give Docus's 2rem rows. */
const ROW = 'group relative flex w-full items-center gap-1.5 px-2.5 py-1.5 text-sm'

function NavTree({ items, level, onNavigate }: { items: NavItem[]; level: number; onNavigate?: () => void }) {
  const pathname = usePathname()
  const nested = level > 0

  return (
    <ul className={cn('isolate', nested ? 'ms-5 border-s border-border' : '-mx-2.5 -mt-1.5')}>
      {items.map(item => {
        const isActive = item.href !== undefined && item.href === pathname
        const hasChildren = Boolean(item.children && item.children.length > 0)

        return (
          <li
            key={item.label + (item.href ?? '')}
            className={cn(nested && '-ms-px ps-1.5', hasChildren && 'mb-1.5 flex flex-col')}
          >
            {item.href ? (
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  ROW,
                  // Nested rows carry a 1px marker sitting on the tree rule.
                  nested &&
                    'after:absolute after:-start-1.5 after:inset-y-0.5 after:block after:w-px after:rounded-full after:transition-colors',
                  isActive
                    ? cn('font-medium text-primary', nested && 'after:bg-primary')
                    : 'text-muted-foreground transition-colors hover:text-highlighted',
                )}
              >
                {item.icon && (
                  <Icon
                    name={item.icon}
                    className={cn(
                      'size-5 shrink-0',
                      isActive ? 'text-primary' : 'text-dimmed transition-colors group-hover:text-foreground',
                    )}
                  />
                )}
                <span className="truncate">{item.label}</span>
              </Link>
            ) : (
              <span className={cn(ROW, 'font-semibold text-highlighted')}>
                {item.icon && <Icon name={item.icon} className="size-5 shrink-0 text-highlighted" />}
                <span className="truncate">{item.label}</span>
              </span>
            )}

            {hasChildren && <NavTree items={item.children!} level={level + 1} onNavigate={onNavigate} />}
          </li>
        )
      })}
    </ul>
  )
}

/** The documentation tree, shared by the desktop aside and the mobile drawer. */
export function SidebarNav({ items, onNavigate, className }: SidebarNavProps) {
  const messages = useMessages()

  if (items.length === 0) return null

  return (
    <nav aria-label={messages.documentation} className={className}>
      <NavTree items={items} level={0} onNavigate={onNavigate} />
    </nav>
  )
}
