import type { ReactNode, VideoHTMLAttributes } from 'react'

import { cn } from '../utils/cn'

/** MDC writes valueless attributes as empty strings. */
function flag(value: boolean | string | undefined): boolean {
  return value === true || value === '' || value === 'true'
}

export interface VideoProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'autoPlay' | 'controls' | 'loop' | 'muted'> {
  src?: string
  autoplay?: boolean | string
  controls?: boolean | string
  loop?: boolean | string
  muted?: boolean | string
}

export function Video({ src, autoplay, controls, loop, muted, className, ...props }: VideoProps) {
  const shouldAutoplay = flag(autoplay)

  return (
    <video
      src={src}
      autoPlay={shouldAutoplay}
      controls={flag(controls)}
      loop={flag(loop)}
      // Browsers only honour autoplay when muted.
      muted={flag(muted) || shouldAutoplay}
      playsInline
      className={cn('my-5 w-full rounded-md border border-border', className)}
      {...props}
    />
  )
}

/** Carrier for MDC `#name` slots, so components can pick children apart. */
export function MdcSlot({ children }: { children?: ReactNode; slot?: string }) {
  return <>{children}</>
}
