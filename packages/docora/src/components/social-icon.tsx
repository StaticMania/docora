import { Link2 } from 'lucide-react'
import type { SVGProps } from 'react'

import type { SocialKey } from '../config/types'

type IconProps = SVGProps<SVGSVGElement>

/**
 * Brand marks, inlined because lucide dropped brand icons.
 * Paths are the official simple-icons glyphs.
 */
const BRAND_ICONS: Record<string, (props: IconProps) => React.ReactElement> = {
  github: props => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.3v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3Z" />
    </svg>
  ),
  x: props => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.9 1.2h3.7l-8.1 9.2 9.5 12.5h-7.4l-5.9-7.6-6.7 7.6H.3l8.6-9.8L0 1.2h7.6l5.3 7 6-7Zm-1.3 19.5h2L6.5 3.2h-2.2l13.3 17.5Z" />
    </svg>
  ),
  discord: props => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.3.5c1.6.4 3 1 4.4 1.8a16.7 16.7 0 0 0-14.9 0A17 17 0 0 1 9 3.4L8.6 3a19.7 19.7 0 0 0-4.9 1.4C.6 9 0 13.5.3 18a19.9 19.9 0 0 0 6 3l1.2-1.9c-1-.4-2-.9-2.8-1.5l.7-.5a14.2 14.2 0 0 0 12.2 0l.7.5c-.9.6-1.8 1.1-2.8 1.5l1.3 1.9c2.2-.7 4.2-1.7 6-3 .4-5.2-.6-9.7-3.4-13.6ZM8.1 15.3c-1.2 0-2.1-1.1-2.1-2.4 0-1.3 1-2.4 2.1-2.4 1.2 0 2.2 1.1 2.2 2.4 0 1.3-1 2.4-2.2 2.4Zm7.8 0c-1.2 0-2.1-1.1-2.1-2.4 0-1.3.9-2.4 2.1-2.4 1.2 0 2.2 1.1 2.1 2.4 0 1.3-.9 2.4-2.1 2.4Z" />
    </svg>
  ),
  linkedin: props => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6h.1a3.8 3.8 0 0 1 3.4-1.9c3.6 0 4.3 2.4 4.3 5.5v6.3ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm1.8 13.1H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 1 .8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7c0-1-.8-1.7-1.8-1.7Z" />
    </svg>
  ),
  youtube: props => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  ),
  bluesky: props => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 10.8C10.7 8.3 7.1 3.6 3.8 1.3 0.6-.9 0 .6 0 3.6c0 1.7 1 7.3 1.6 8.2.9 1.4 3 1.8 5 1.5-3.7.6-4.6 3-2.5 5.2 4 4.1 5.8-1 6.2-2.4l.7-1.7.7 1.7c.4 1.4 2.2 6.5 6.2 2.4 2-2.2 1.2-4.6-2.5-5.2 2 .3 4.1-.1 5-1.5.6-.9 1.6-6.5 1.6-8.2 0-3-.6-4.5-3.8-2.3-3.3 2.3-6.9 7-8.2 9.5Z" />
    </svg>
  ),
}

export function SocialIcon({ network, ...props }: Readonly<IconProps & { network: SocialKey }>) {
  const Icon = BRAND_ICONS[network]
  return Icon ? <Icon {...props} /> : <Link2 {...props} />
}

export const socialLabels: Record<string, string> = {
  github: 'GitHub',
  x: 'X',
  discord: 'Discord',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  bluesky: 'Bluesky',
}
