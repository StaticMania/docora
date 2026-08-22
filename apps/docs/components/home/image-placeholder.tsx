import { Icon, cn } from 'docora'

export type ImagePlaceholderProps = Readonly<{
  /** Shown inside the frame — say what belongs here. */
  label: string
  hint?: string
  /** Any Tailwind aspect utility; defaults to 16 / 9. */
  ratio?: string
  className?: string
}>

/**
 * A themed stand-in for artwork that has not been produced yet. Swap the whole
 * component for an `<Image />` once the real asset exists.
 */
export function ImagePlaceholder({
  label,
  hint,
  ratio = 'aspect-video',
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border border-dashed border-border-accented bg-muted/60 p-6 text-center',
        ratio,
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
          backgroundSize: '2rem 2rem',
          maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)',
        }}
      />

      <span className="relative inline-flex size-12 items-center justify-center rounded-full border border-border bg-background text-primary">
        <Icon name="image" className="size-5" />
      </span>

      <div className="relative">
        <p className="text-sm font-medium text-highlighted">{label}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  )
}
