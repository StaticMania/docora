import { Fragment } from 'react'
import { AiSpotlight } from './ai-spotlight'
import { Authoring } from './authoring'
import { Bento } from './bento'
import { Comparison } from './comparison'
import { Faq } from './faq'
import { FinalCta } from './final-cta'
import { Guides } from './guides'
import { Hero } from './hero'
import { ProjectShape } from './project-shape'
import { Quickstart } from './quickstart'

export function HomePage() {
  return (
    <Fragment key="home">
      <Hero />
      <Bento />
      <AiSpotlight />
      <Authoring />
      <ProjectShape />
      <Quickstart />
      <Comparison />
      <Guides />
      <Faq />
      <FinalCta />
    </Fragment>
  )
}
