import { createSkillsIndexRoute, defaultSkillsDir } from 'docs-theme'

export const { GET, dynamic } = createSkillsIndexRoute(defaultSkillsDir())
