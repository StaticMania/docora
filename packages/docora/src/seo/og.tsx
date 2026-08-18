import { ImageResponse } from 'next/og'

import type { DocsConfig } from '../config/types'

export const OG_SIZE = { width: 1200, height: 630 }

/**
 * Open Graph image route.
 *
 * ```ts
 * // app/og/route.tsx
 * import { createOgRoute } from 'docora'
 * import docsConfig from '../../docs.config'
 *
 * export const { GET } = createOgRoute(docsConfig)
 * ```
 *
 * Title and description come from the query string, so one route serves every
 * page and Next can prerender the results.
 */
export function createOgRoute(config: DocsConfig) {
  return {
    async GET(request: Request) {
      const { searchParams } = new URL(request.url)
      const title = searchParams.get('title') ?? config.site.name
      const description = searchParams.get('description') ?? config.site.description ?? ''

      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#18181b',
              padding: '80px',
              // A soft wash so the card is not a flat rectangle.
              backgroundImage: 'radial-gradient(circle at 85% 15%, #10b98133, transparent 55%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: '#34d399' }} />
              <div style={{ fontSize: 28, color: '#a1a1aa', letterSpacing: -0.5 }}>{config.site.name}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div
                style={{
                  fontSize: title.length > 40 ? 64 : 78,
                  color: '#ffffff',
                  fontWeight: 700,
                  letterSpacing: -2,
                  lineHeight: 1.1,
                }}
              >
                {title}
              </div>

              {description && (
                <div style={{ fontSize: 32, color: '#a1a1aa', lineHeight: 1.35 }}>
                  {description.length > 120 ? `${description.slice(0, 120)}…` : description}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', height: 8, borderRadius: 999, backgroundColor: '#34d399', width: 160 }} />
          </div>
        ),
        OG_SIZE,
      )
    },
  }
}
