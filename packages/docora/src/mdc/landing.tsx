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
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
      <span className="size-1.5 rounded-full bg-primary" aria-hidden />
      {announcement}
      {announcementTo && <ArrowRight className="size-3" aria-hidden />}
    </span>
  )

  return (
    <section className={cn('relative isolate pt-10 pb-8 text-center sm:pt-16 sm:pb-12', className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[32rem] overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              'radial-gradient(48% 55% at 50% 28%, color-mix(in oklch, var(--primary) 24%, transparent) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
            backgroundSize: '3.5rem 3.5rem',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 72%)',
          }}
        />
      </div>

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

      {children && <div className="mt-10 flex flex-col items-stretch gap-12 [&>:first-child]:mt-0">{children}</div>}
    </section>
  )
}

/** Row of call-to-action buttons, centred under a hero. */
export function HeroActions({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-3', className)}>{children}</div>
  )
}

export interface HeroPreviewProps {
  children?: ReactNode
  /** Label in the window chrome, typically a filename. */
  filename?: string
  className?: string
}

/** Framed code (or any preview) sitting under the hero actions. */
export function HeroPreview({ children, filename, className }: HeroPreviewProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-muted text-start shadow-xl shadow-black/5',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-border-accented" aria-hidden />
        <span className="size-2.5 rounded-full bg-border-accented" aria-hidden />
        <span className="size-2.5 rounded-full bg-border-accented" aria-hidden />
        {filename && (
          <span className="ml-2 truncate font-mono text-xs text-muted-foreground">{filename}</span>
        )}
      </div>
      <div className="[&_.docs-code]:my-0 [&_.docs-code-header]:hidden [&_.docs-code_pre]:rounded-none [&_.docs-code_pre]:border-0">
        {children}
      </div>
    </div>
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
        'inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-medium transition-all',
        variant === 'primary'
          ? 'bg-primary text-primary-foreground shadow-sm hover:opacity-90'
          : 'border border-border bg-background/60 text-highlighted shadow-sm backdrop-blur-sm hover:border-border-accented hover:bg-elevated',
        className,
      )}
    >
      {icon && <Icon name={icon} className="size-4 shrink-0" />}
      {label ?? children}
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/* Logo cloud and stats                                                       */
/* -------------------------------------------------------------------------- */

export function LogoCloud({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-6 text-sm text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface LogoProps {
  children?: ReactNode
  label?: string
  icon?: string
  className?: string
}

export function Logo({ children, label, icon, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-medium', className)}>
      {icon && <Icon name={icon} className="size-4 shrink-0" />}
      {label ?? children}
    </span>
  )
}

export function StatGrid({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4', className)}>{children}</div>
  )
}

export interface StatProps {
  children?: ReactNode
  value?: string
  label?: string
  className?: string
}

export function Stat({ children, value, label, className }: StatProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-muted/40 px-4 py-5 text-center', className)}>
      {value && <p className="text-lg font-semibold tracking-tight text-highlighted sm:text-xl">{value}</p>}
      <p className="mt-1 text-sm text-pretty text-muted-foreground">{label ?? children}</p>
    </div>
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
      <div className="mb-4 flex items-start justify-between gap-3">
        {icon && (
          <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-muted text-primary">
            <Icon name={icon} className="size-4.5" />
          </span>
        )}
        {to && (
          <ArrowRight
            className="mt-1 size-4 shrink-0 text-dimmed opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
            aria-hidden
          />
        )}
      </div>

      {title && <p className="font-semibold text-highlighted">{title}</p>}

      <div className="mt-1.5 text-sm leading-6 text-muted-foreground [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </>
  )

  const classes = cn(
    'rounded-xl border border-border bg-background/40 p-5 transition-colors',
    to && 'group hover:border-primary/40 hover:bg-elevated/40',
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
        'relative isolate my-16 overflow-hidden rounded-2xl border border-border px-6 py-14 text-center sm:px-12 sm:py-16',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-muted"
        style={{
          backgroundImage:
            'radial-gradient(60% 80% at 50% 0%, color-mix(in oklch, var(--primary) 16%, transparent), transparent 70%)',
        }}
      />

      {title && <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">{title}</h2>}
      {description && (
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">{description}</p>
      )}
      {children && <div className="mt-8 [&>:first-child]:mt-0">{children}</div>}
    </section>
  )
}
