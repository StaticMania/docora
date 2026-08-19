import type { CSSProperties } from 'react'

/** One table-of-contents row, in rem. The rail geometry is derived from it. */
export const TOC_LINK_HEIGHT_REM = 1.75

const SVG_UNIT = 16
const ROW = TOC_LINK_HEIGHT_REM * SVG_UNIT
/** Horizontal track positions inside the 12-wide viewBox. */
const X_ROOT = 0.5
const X_NESTED = 10.5
/** How far before a level change the vertical run stops, leaving room for the jog. */
const JOG = 6

/**
 * Builds the "circuit" rail: a single stroked path that runs beside the
 * headings and steps sideways where the list changes depth.
 *
 * The path is applied as a mask, so the grey track and the coloured active
 * segment are both plain divs clipped to this shape.
 */
export function circuitRailStyle(levels: number[]): CSSProperties | undefined {
  if (levels.length === 0) return undefined

  let path = ''
  let currentX = X_ROOT
  let y = 0

  levels.forEach((level, index) => {
    const targetX = level > 0 ? X_NESTED : X_ROOT
    const nextY = y + ROW

    if (index === 0) {
      path += `M${targetX} ${y}`
      currentX = targetX
    }

    if (targetX !== currentX) {
      path += ` L${targetX} ${y + JOG}`
      currentX = targetX
    }

    const stopsShort = index < levels.length - 1 && levels[index + 1] !== level
    path += ` L${currentX} ${nextY - (stopsShort ? JOG : 0)}`
    y = nextY
  })

  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 ${levels.length * ROW}'>` +
      `<path d='${path}' stroke='black' stroke-width='1' fill='none'/></svg>`,
  )
  const mask = `url("data:image/svg+xml,${svg}")`

  return {
    width: '0.75rem',
    height: `${levels.length * TOC_LINK_HEIGHT_REM}rem`,
    maskImage: mask,
    WebkitMaskImage: mask,
  }
}
