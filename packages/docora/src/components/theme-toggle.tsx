'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

import { useMessages } from '../i18n/context'
import { cn } from '../utils/cn'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const messages = useMessages()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      // The resolved theme is unknown during SSR, so keep the icon hidden until
      // the client knows which one to show.
      aria-label={mounted ? (isDark ? messages.toggleToLight : messages.toggleToDark) : messages.toggleToDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-elevated hover:text-highlighted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
    >
      {mounted ? isDark ? <Moon className="size-4" /> : <Sun className="size-4" /> : <span className="size-4" />}
    </button>
  )
}
