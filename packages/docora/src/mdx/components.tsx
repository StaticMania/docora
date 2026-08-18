import Link from 'next/link'
import type { MDXComponents } from 'mdx/types'
import type { AnchorHTMLAttributes, HTMLAttributes } from 'react'

import { cn } from '../utils/cn'
import {
  Accordion,
  AccordionItem,
  Badge,
  Callout,
  Card,
  CardGroup,
  Caution,
  CodeBlock,
  CodeCollapse,
  CodeGroup,
  CodePreview,
  CodeTree,
  Collapsible,
  Field,
  FieldGroup,
  Kbd,
  MdcSlot,
  Note,
  Steps,
  Tabs,
  TabsItem,
  Tip,
  Video,
  Warning,
} from '../mdc/index'
import { Icon } from '../components/icon'

function Anchor({ href = '', className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classes = cn(
    'font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary',
    className,
  )

  if (href.startsWith('/')) {
    return <Link href={href} className={classes} {...props} />
  }

  return (
    <a
      href={href}
      className={classes}
      {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...props}
    />
  )
}

/**
 * Headings carry an `id` from `rehype-slug`, which the table of contents links
 * to. When one is present, reveal a permalink on hover.
 */
function Heading({
  as: Tag,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }) {
  return (
    <Tag className={cn('group scroll-m-20', className)} {...props}>
      {children}
      {props.id && (
        <a
          href={`#${props.id}`}
          aria-label="Link to this section"
          className="ml-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          {/* Hidden from the accessibility tree so it stays out of the heading's name. */}
          <span aria-hidden>#</span>
        </a>
      )}
    </Tag>
  )
}

/**
 * Default element mapping used when rendering docs content.
 *
 * Consumers can extend it: `getMdxComponents({ Callout })`.
 */
export const defaultMdxComponents: MDXComponents = {
  h1: props => <h1 className="mt-2 scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl" {...props} />,
  h2: props => (
    <Heading
      as="h2"
      className="mt-12 border-b border-border pb-2 text-2xl font-semibold tracking-tight first:mt-0"
      {...props}
    />
  ),
  h3: props => <Heading as="h3" className="mt-8 text-xl font-semibold tracking-tight" {...props} />,
  h4: props => <Heading as="h4" className="mt-6 text-lg font-semibold tracking-tight" {...props} />,
  p: props => <p className="mt-4 leading-7 first:mt-0" {...props} />,
  a: Anchor,
  ul: props => <ul className="mt-4 ml-6 list-disc [&>li]:mt-2" {...props} />,
  ol: props => <ol className="mt-4 ml-6 list-decimal [&>li]:mt-2" {...props} />,
  blockquote: props => (
    <blockquote className="mt-6 border-l-2 border-primary/40 pl-6 text-muted-foreground italic" {...props} />
  ),
  hr: props => <hr className="my-10 border-border" {...props} />,
  code: ({ className, ...props }) => (
    <code
      className={cn(
        'rounded-md border border-border bg-muted px-[0.4em] py-[0.2em] font-mono text-[0.875em] text-highlighted [pre_&]:border-0 [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:text-inherit',
        className,
      )}
      {...props}
    />
  ),
  pre: CodeBlock,
  table: props => (
    <div className="mt-6 w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: props => <th className="border border-border bg-muted px-4 py-2 text-left font-semibold text-highlighted" {...props} />,
  td: props => <td className="border border-border px-4 py-2" {...props} />,
  img: props => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="mt-6 rounded-lg border border-border" alt="" {...props} />
  ),
}

/**
 * Components documents can use by name, without importing anything.
 */
export const mdxShortcodes: MDXComponents = {
  // MDC lowercases component names, so both spellings are registered: content
  // can use `::card-group` or JSX `<CardGroup>`.
  Callout,
  callout: Callout,
  Note,
  note: Note,
  Tip,
  tip: Tip,
  Warning,
  warning: Warning,
  Caution,
  caution: Caution,
  Badge,
  badge: Badge,
  Kbd,
  kbd: Kbd,
  Icon,
  icon: Icon,
  Card,
  card: Card,
  CardGroup,
  'card-group': CardGroup,
  Accordion,
  accordion: Accordion,
  AccordionItem,
  'accordion-item': AccordionItem,
  Collapsible,
  collapsible: Collapsible,
  Field,
  field: Field,
  FieldGroup,
  'field-group': FieldGroup,
  Steps,
  steps: Steps,
  Tabs,
  tabs: Tabs,
  TabsItem,
  'tabs-item': TabsItem,
  CodeGroup,
  'code-group': CodeGroup,
  CodeCollapse,
  'code-collapse': CodeCollapse,
  CodePreview,
  'code-preview': CodePreview,
  CodeTree,
  'code-tree': CodeTree,
  Video,
  video: Video,
  'mdc-slot': MdcSlot,
}

/** Merge extra components on top of the theme defaults. */
export function getMdxComponents(components?: MDXComponents): MDXComponents {
  return { ...defaultMdxComponents, ...mdxShortcodes, ...components }
}
