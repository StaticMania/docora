import { AiSpotlight } from './ai-spotlight'
import { Authoring } from './authoring'
import { Bento } from './bento'
import { Comparison } from './comparison'
import { Faq } from './faq'
import { FinalCta } from './final-cta'
import { Guides } from './guides'
import { Hero } from './hero'
import { Inspiration } from './inspiration'
import { ProjectShape } from './project-shape'
import { Quickstart } from './quickstart'

/**
 * The marketing home page. Rendered instead of `content/index.mdx` so the
 * landing experience is plain React and Tailwind, while the MDX file stays the
 * source of truth for metadata, search and `llms.txt`.
 */
export function HomePage() {
  return (
    <div className="w-full">
      <Hero />
      <Bento />
      <AiSpotlight />
      <Inspiration />
      <Authoring />
      <ProjectShape />
      <Quickstart />
      <Comparison />
      <Guides />
      <Faq />
      <FinalCta />
    </div>
  )
}
