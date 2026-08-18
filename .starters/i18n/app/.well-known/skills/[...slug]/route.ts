import { createSkillsFileRoute, defaultSkillsDir } from 'docora'

export const { GET, dynamic, generateStaticParams } = createSkillsFileRoute(defaultSkillsDir())
