import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icon, cn } from 'docora'

/** Shared page gutter. Sections stay full-bleed; only their content is bounded. */
export function Container({
  children,
  className,
}: Readonly<{ children?: ReactNode; className?: string }>) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6', className)}>{children}</div>
}

/** Small pill above a section title. */
export function Eyebrow({
  children,
  icon,
  className,
}: Readonly<{ children?: ReactNode; icon?: string; className?: string }>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase',
        className,
      )}
    >
      {icon ? (
        <Icon name={icon} className="size-3.5 text-primary" />
      ) : (
        <span className="size-1.5 rounded-full bg-primary" aria-hidden />
      )}
      {children}
    </span>
  )
}

export type ButtonProps = Readonly<{
  children?: ReactNode
  href: string
  icon?: string
  trailingIcon?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}>

/**
 * The only button on the marketing page. Every variant is a pill — the site
 * rounds its controls fully.
 */
export function Button({
  children,
  href,
  icon,
  trailingIcon,
  variant = 'primary',
  size = 'md',
  className,
}: ButtonProps) {
  const external = href.startsWith('http')

  return (
    <Link
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={cn(
        'group inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
        size === 'sm' && 'h-9 px-4 text-sm',
        size === 'md' && 'h-11 px-5 text-sm',
        size === 'lg' && 'h-12 px-6 text-base',
        variant === 'primary' &&
          'bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:shadow-md hover:shadow-primary/30 hover:brightness-105',
        variant === 'secondary' &&
          'border border-border bg-background/70 text-highlighted shadow-sm backdrop-blur-sm hover:border-border-accented hover:bg-elevated',
        variant === 'ghost' && 'text-muted-foreground hover:bg-elevated hover:text-highlighted',
        className,
      )}
    >
      {icon && <Icon name={icon} className="size-4 shrink-0" />}
      {children}
      {trailingIcon && (
        <Icon
          name={trailingIcon}
          className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
        />
      )}
    </Link>
  )
}

export type SectionHeaderProps = Readonly<{
  eyebrow?: string
  eyebrowIcon?: string
  title: ReactNode
  description?: ReactNode
  align?: 'center' | 'start'
  className?: string
}>

export function SectionHeader({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col',
        align === 'center'
          ? 'mx-auto max-w-2xl items-center text-center'
          : 'items-start text-start',
        className,
      )}
    >
      {eyebrow && <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>}
      <h2 className="mt-5 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </header>
  )
}

export type SectionProps = Readonly<{
  children?: ReactNode
  id?: string
  /** Tints the full-bleed band behind the section. */
  tone?: 'default' | 'muted'
  className?: string
}>

export function Section({ children, id, tone = 'default', className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-16 sm:py-24',
        tone === 'muted' && 'border-y border-border bg-muted/40',
        className,
      )}
    >
      {children}
    </section>
  )
}

/** A soft grid + primary glow used behind the hero and closing call to action. */
export function GridBackdrop({
  className,
  fade = 'radial',
}: Readonly<{ className?: string; fade?: 'radial' | 'bottom' }>) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10', className)}>
      <div
        className="absolute inset-0 opacity-60 dark:opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
          backgroundSize: '3.5rem 3.5rem',
          maskImage:
            fade === 'radial'
              ? 'radial-gradient(ellipse 70% 60% at 50% 30%, black 10%, transparent 75%)'
              : 'linear-gradient(to bottom, black, transparent 85%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(46% 50% at 50% 22%, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 72%)',
        }}
      />
    </div>
  )
}
