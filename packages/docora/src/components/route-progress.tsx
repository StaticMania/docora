'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

import { startsNavigation } from './route-progress-target'

/** Duration, throttle and hide timings for the bar. */
const DURATION = 2000
const THROTTLE = 200
const HIDE_DELAY = 500
const RESET_DELAY = 400
/** Give up and complete the bar if a navigation never lands. */
const SAFETY_TIMEOUT = DURATION * 3

/** Fast at first, then asymptotic. */
function estimatedProgress(elapsed: number): number {
  const completion = (elapsed / DURATION) * 100
  return ((2 / Math.PI) * 100 * Math.atan(completion / 50))
}

export interface RouteProgressProps {
  /** Any CSS colour. Defaults to the theme's primary. */
  color?: string
  /** Bar thickness in pixels. */
  height?: number
}

/**
 * A progress bar across the top of the page during client-side navigation.
 *
 * The App Router has no router events, so this starts on a click that will
 * navigate and completes when the pathname actually changes.
 */
export function RouteProgress({ color, height = 3 }: RouteProgressProps) {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  const running = useRef(false)
  const finishRef = useRef<() => void>(undefined)
  const pathnameRef = useRef(pathname)
  const timers = useRef<{ raf?: number; throttle?: number; hide?: number; reset?: number; safety?: number }>({})

  const clearTimers = useCallback(() => {
    const { raf, throttle, hide, reset, safety } = timers.current
    if (raf) cancelAnimationFrame(raf)
    for (const id of [throttle, hide, reset, safety]) if (id) clearTimeout(id)
    timers.current = {}
  }, [])

  const start = useCallback(() => {
    if (running.current) return
    running.current = true

    clearTimers()
    setProgress(0)

    const startedAt = Date.now()

    const tick = () => {
      setProgress(estimatedProgress(Date.now() - startedAt))
      timers.current.raf = requestAnimationFrame(tick)
    }

    // Hold off briefly so instant navigations never flash the bar.
    timers.current.throttle = window.setTimeout(() => {
      setVisible(true)
      tick()
    }, THROTTLE)

    timers.current.safety = window.setTimeout(() => finish(), SAFETY_TIMEOUT)

    function finish() {
      running.current = false
      clearTimers()
      setProgress(100)
      timers.current.hide = window.setTimeout(() => {
        setVisible(false)
        timers.current.reset = window.setTimeout(() => setProgress(0), RESET_DELAY)
      }, HIDE_DELAY)
    }

    finishRef.current = finish
  }, [clearTimers])

  useEffect(() => {
    if (pathnameRef.current === pathname) return
    pathnameRef.current = pathname
    if (running.current) finishRef.current?.()
  }, [pathname])

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest?.('a')
      if (!anchor) return

      const navigates = startsNavigation({
        defaultPrevented: event.defaultPrevented,
        button: event.button,
        modified: event.metaKey || event.ctrlKey || event.shiftKey || event.altKey,
        href: anchor.getAttribute('href'),
        resolvedHref: anchor.href,
        target: anchor.target,
        download: anchor.hasAttribute('download'),
        currentUrl: window.location.href,
      })

      if (navigates) start()
    }

    function onPopState() {
      if (window.location.pathname !== pathnameRef.current) start()
    }

    document.addEventListener('click', onClick)
    window.addEventListener('popstate', onPopState)

    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', onPopState)
      clearTimers()
    }
  }, [start, clearTimers])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60]"
      style={{ height }}
      data-route-progress={visible ? 'loading' : 'idle'}
    >
      <div
        className="h-full w-0"
        style={{
          width: `${progress}%`,
          background: color ?? 'var(--primary)',
          opacity: visible ? 1 : 0,
          transition: 'width 0.1s, opacity 0.4s',
        }}
      />
    </div>
  )
}
