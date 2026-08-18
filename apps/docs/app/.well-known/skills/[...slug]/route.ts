import { createSkillsFileRoute, defaultSkillsDir } from 'docs-theme'

export const { GET, dynamic, generateStaticParams } = createSkillsFileRoute(defaultSkillsDir())
