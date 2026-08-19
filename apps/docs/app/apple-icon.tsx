import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/** Raster icon for iOS home screens, which will not take an SVG. */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
        color: '#ffffff',
        fontSize: 124,
        fontWeight: 700,
        letterSpacing: -4,
      }}
    >
      D
    </div>,
    size,
  )
}
