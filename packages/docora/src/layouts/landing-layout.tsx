'use client'

import type { ReactNode } from 'react'

import { SiteFooter } from '../components/site-footer'
import { SiteHeader } from '../components/site-header'
import { cn } from '../utils/cn'

export interface LandingLayoutProps {
  children: ReactNode
  header?: ReactNode
  /** Replaces the default footer entirely. */
  footer?: ReactNode
  className?: string
}

/** Full-width chrome for the home page: header and footer, no asides. */
export function LandingLayout({ children, header, footer, className }: LandingLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col">
      {header ?? <SiteHeader />}
      <main className={cn('mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6', className)}>{children}</main>
      {footer ?? <SiteFooter />}
    </div>
  )
}
