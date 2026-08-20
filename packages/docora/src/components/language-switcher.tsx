'use client'

import { usePathname, useRouter } from 'next/navigation'
import { DropdownMenu } from 'radix-ui'
import { Check, Globe } from 'lucide-react'

import { useLocale, useMessages } from '../i18n/context'
import { pathForLocale } from '../i18n/paths'
import { cn } from '../utils/cn'

/** Switches locale while staying on the equivalent page. */
export function LanguageSwitcher({ className }: Readonly<{ className?: string }>) {
  const { locale, locales, i18n } = useLocale()
  const messages = useMessages()
  const pathname = usePathname()
  const router = useRouter()

  if (locales.length < 2) return null

  const current = locales.find(entry => entry.code === locale) ?? locales[0]

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={messages.selectLanguage}
        className={cn(
          'inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-sm text-muted-foreground transition-colors hover:bg-elevated hover:text-highlighted',
          className,
        )}
      >
        <Globe className="size-4" aria-hidden />
        <span className="hidden sm:inline">{current?.code.toUpperCase()}</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-36 rounded-md border border-border bg-popover p-1 shadow-lg"
        >
          {locales.map(entry => (
            <DropdownMenu.Item
              key={entry.code}
              onSelect={() => router.push(pathForLocale(pathname, entry.code, i18n))}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                entry.code === locale
                  ? 'text-primary'
                  : 'text-muted-foreground data-highlighted:bg-elevated data-highlighted:text-highlighted',
              )}
            >
              <Check
                className={cn('size-3.5 shrink-0', entry.code !== locale && 'invisible')}
                aria-hidden
              />
              {entry.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
