'use client'

import { useEffect, useState } from 'react'

/**
 * Tracks every heading currently on screen, in document order.
 *
 * Mirrors Nuxt UI's `useScrollspy`, which Docus builds its table of contents
 * on: a plain viewport observer with no margin, and when nothing is in view —
 * mid-way through a long section — the previous set is kept so the highlight
 * never blinks out.
 */
export function useActiveHeadings(ids: string[]): string[] {
  const [activeIds, setActiveIds] = useState<string[]>([])
  const key = ids.join(',')

  useEffect(() => {
    const headings = ids
      .map(id => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (headings.length === 0) return

    const visible = new Set<string>()

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id)
        else visible.delete(entry.target.id)
      }

      const next = ids.filter(id => visible.has(id))
      if (next.length > 0) setActiveIds(next)
    })

    for (const heading of headings) observer.observe(heading)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return activeIds
}
