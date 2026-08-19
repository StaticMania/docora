import type { ReactNode, VideoHTMLAttributes } from 'react'

import { cn } from '../utils/cn'

function flag(value: boolean | string | undefined): boolean {
  return value === true || value === '' || value === 'true'
}

export type VideoProps = Readonly<
  Omit<VideoHTMLAttributes<HTMLVideoElement>, 'autoPlay' | 'controls' | 'loop' | 'muted'> & {
    src?: string
    autoplay?: boolean | string
    controls?: boolean | string
    loop?: boolean | string
    muted?: boolean | string
  }
>

export function Video({ src, autoplay, controls, loop, muted, className, ...props }: VideoProps) {
  const shouldAutoplay = flag(autoplay)

  return (
    <video
      src={src}
      autoPlay={shouldAutoplay}
      controls={flag(controls)}
      loop={flag(loop)}
      muted={flag(muted) || shouldAutoplay}
      playsInline
      className={cn('my-5 w-full rounded-md border border-border', className)}
      {...props}
    />
  )
}

export function MdcSlot({
  children,
  slot,
  ...props
}: Readonly<{
  children?: ReactNode
  slot?: string
  'data-slot'?: string
}>) {
  const name = slot ?? props['data-slot'] ?? ''

  return (
    <div data-slot={name} className="contents">
      {children}
    </div>
  )
}
