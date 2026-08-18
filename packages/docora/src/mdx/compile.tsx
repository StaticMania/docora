import { readFile } from 'node:fs/promises'
import type { ReactElement } from 'react'
import * as runtime from 'react/jsx-runtime'
import { evaluate, type EvaluateOptions } from '@mdx-js/mdx'
import type { MDXComponents } from 'mdx/types'
import rehypeShiki from '@shikijs/rehype'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMdc from 'remark-mdc'
import { transformerMetaHighlight } from '@shikijs/transformers'

import { transformerCodeMeta } from './code-meta'
import { mdcHandlers } from './mdc'

import { getMdxComponents } from './components'
import { splitFrontmatter, type Frontmatter } from './frontmatter'
import { rehypeCollectToc, type TocEntry } from './toc'

/**
 * Dual-theme highlighting: Shiki emits `--shiki-light` / `--shiki-dark` custom
 * properties instead of colours, and the stylesheet picks one per colour mode.
 */
const SHIKI_OPTIONS = {
  themes: { light: 'github-light', dark: 'github-dark' },
  defaultColor: false,
  // `[filename]` and `line-numbers` from the fence meta, then `{1,3-5}`.
  transformers: [transformerCodeMeta(), transformerMetaHighlight()],
}

export interface CompileMdxOptions {
  /** Extra components made available to the document, merged over the theme defaults. */
  components?: MDXComponents
  remarkPlugins?: EvaluateOptions['remarkPlugins']
  rehypePlugins?: EvaluateOptions['rehypePlugins']
}

export interface CompiledMdx<F extends Frontmatter = Frontmatter> {
  content: ReactElement
  frontmatter: F
  /** Headings found in the document, in source order. */
  toc: TocEntry[]
}

/**
 * Compile an MDX source string on the server.
 *
 * Content is evaluated at render time instead of going through a bundler
 * loader, so pages can be built from arbitrary files on disk — which is what
 * the file-based content pipeline needs.
 */
export async function compileMdx<F extends Frontmatter = Frontmatter>(
  source: string,
  options: CompileMdxOptions = {},
): Promise<CompiledMdx<F>> {
  const { data, body } = splitFrontmatter<F>(source)
  const toc: TocEntry[] = []

  const { default: MdxContent } = await evaluate(body, {
    ...runtime,
    development: false,
    // MDC first: it claims `::name{...}` before MDX reads `{}` as an expression.
    remarkPlugins: [remarkMdc, remarkGfm, ...(options.remarkPlugins ?? [])],
    remarkRehypeOptions: { handlers: mdcHandlers },
    rehypePlugins: [
      rehypeSlug,
      rehypeCollectToc(toc),
      [rehypeShiki, SHIKI_OPTIONS],
      ...(options.rehypePlugins ?? []),
    ],
  } as EvaluateOptions)

  return {
    frontmatter: data,
    toc,
    content: <MdxContent components={getMdxComponents(options.components)} />,
  }
}

/** Read an `.mdx`/`.md` file from disk and compile it. */
export async function compileMdxFile<F extends Frontmatter = Frontmatter>(
  filePath: string,
  options?: CompileMdxOptions,
): Promise<CompiledMdx<F>> {
  return compileMdx<F>(await readFile(filePath, 'utf8'), options)
}
