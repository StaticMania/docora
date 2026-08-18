export interface NavigationClick {
  defaultPrevented: boolean
  /** 0 for a primary click. */
  button: number
  /** True when meta/ctrl/shift/alt was held — the browser handles those itself. */
  modified: boolean
  /** The anchor's `href` attribute, or null when it has none. */
  href: string | null
  /** The anchor's resolved absolute URL. */
  resolvedHref: string
  target: string
  download: boolean
  /** The page's current URL. */
  currentUrl: string
}

/**
 * Whether a click will actually cause a client-side navigation.
 *
 * The progress bar starts on click and completes when the pathname changes, so
 * anything that leaves the page where it is must not start it — otherwise the
 * bar hangs until its safety timeout.
 */
export function startsNavigation(click: NavigationClick): boolean {
  if (click.defaultPrevented || click.button !== 0 || click.modified) return false
  if (!click.href || click.download || click.target === '_blank') return false

  let url: URL
  let current: URL

  try {
    url = new URL(click.resolvedHref, click.currentUrl)
    current = new URL(click.currentUrl)
  } catch {
    return false
  }

  if (url.origin !== current.origin) return false
  // Same-document jumps (hash links, query-only changes) never change the path.
  if (url.pathname === current.pathname) return false

  return true
}
