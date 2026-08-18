import { createSkillsIndexRoute, defaultSkillsDir } from 'docora'

export const { GET, dynamic } = createSkillsIndexRoute(defaultSkillsDir())
