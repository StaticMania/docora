import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { Icon } from '../components/icon'
import { cn } from '../utils/cn'

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export interface HeroProps {
  children?: ReactNode
  title?: string
  description?: string
  /** Small pill above the headline — a version, or a short announcement. */
  announcement?: string
  announcementTo?: string
  className?: string
}

/**
 * Opening section of a landing page.
 *
 * The glow is painted with the primary token, so it follows a re-themed site
 * instead of hardcoding a brand colour.
 */
export function Hero({
  children,
  title,
  description,
  announcement,
  announcementTo,
  className,
}: HeroProps) {
  const pill = announcement && (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
      {announcement}
      {announcementTo && <ArrowRight className="size-3" aria-hidden />}
    </span>
  )

  return (
    <section className={cn('relative isolate pt-10 pb-16 text-center sm:pt-16 sm:pb-24', className)}>
      {/* Soft radial wash behind the headline. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[28rem] opacity-70"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 40%, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 100%)',
        }}
      />

      {announcement && (
        <div className="mb-6 flex justify-center">
          {announcementTo ? (
            <Link href={announcementTo} className="transition-opacity hover:opacity-80">
              {pill}
            </Link>
          ) : (
            pill
          )}
        </div>
      )}

      {title && (
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          {title}
        </h1>
      )}

      {description && (
        <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground sm:text-xl">
          {description}
        </p>
      )}

      {children && <div className="mt-10 [&>:first-child]:mt-0">{children}</div>}
    </section>
  )
}

/** Row of call-to-action buttons, centred under a hero. */
export function HeroActions({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-3', className)}>{children}</div>
  )
}

export interface CtaProps {
  children?: ReactNode
  label?: string
  to?: string
  icon?: string
  /** `primary` is filled, `secondary` is outlined. */
  variant?: 'primary' | 'secondary'
  className?: string
}

export function Cta({ children, label, to = '#', icon, variant = 'primary', className }: CtaProps) {
  const external = to.startsWith('http')

  return (
    <Link
      href={to}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-medium transition-colors',
        variant === 'primary'
          ? 'bg-primary text-primary-foreground hover:opacity-90'
          : 'border border-border text-highlighted hover:border-border-accented hover:bg-elevated',
        className,
      )}
    >
      {icon && <Icon name={icon} className="size-4 shrink-0" />}
      {label ?? children}
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/* Sections and features                                                      */
/* -------------------------------------------------------------------------- */

export interface SectionProps {
  children?: ReactNode
  title?: string
  description?: string
  /** Small coloured label above the title. */
  eyebrow?: string
  className?: string
}

export function Section({ children, title, description, eyebrow, className }: SectionProps) {
  return (
    <section className={cn('py-14 sm:py-20', className)}>
      {(eyebrow || title || description) && (
        <header className="mx-auto max-w-2xl text-center">
          {eyebrow && <p className="mb-3 text-sm font-medium text-primary">{eyebrow}</p>}
          {title && (
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
          )}
          {description && (
            <p className="mt-4 text-base text-pretty text-muted-foreground sm:text-lg">{description}</p>
          )}
        </header>
      )}

      {children && <div className="mt-10">{children}</div>}
    </section>
  )
}

export interface FeatureProps {
  children?: ReactNode
  title?: string
  icon?: string
  to?: string
  className?: string
}

export function Feature({ children, title, icon, to, className }: FeatureProps) {
  const body = (
    <>
      {icon && (
        <span className="mb-4 inline-flex size-9 items-center justify-center rounded-md border border-border bg-muted">
          <Icon name={icon} className="size-4.5 text-primary" />
        </span>
      )}

      {title && <p className="font-semibold text-highlighted">{title}</p>}

      <div className="mt-1.5 text-sm text-muted-foreground [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </>
  )

  const classes = cn(
    'rounded-lg border border-border p-5 transition-colors',
    to && 'hover:border-primary/40',
    className,
  )

  if (to) {
    return (
      <Link href={to} className={classes}>
        {body}
      </Link>
    )
  }

  return <div className={classes}>{body}</div>
}

export interface FeatureGridProps {
  children?: ReactNode
  /** Columns on wide viewports. Defaults to 3. */
  cols?: number | string
  className?: string
}

export function FeatureGrid({ children, cols = 3, className }: FeatureGridProps) {
  const columns = Number(cols) || 3

  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2',
        columns >= 4 ? 'lg:grid-cols-4' : columns === 3 ? 'lg:grid-cols-3' : '',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Centred closing block, for the final call to action. */
export function CtaSection({
  children,
  title,
  description,
  className,
}: {
  children?: ReactNode
  title?: string
  description?: string
  className?: string
}) {
  return (
    <section
      className={cn(
        'my-16 rounded-xl border border-border bg-muted px-6 py-12 text-center sm:px-12',
        className,
      )}
    >
      {title && <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">{title}</h2>}
      {description && (
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">{description}</p>
      )}
      {children && <div className="mt-8 [&>:first-child]:mt-0">{children}</div>}
    </section>
  )
}
