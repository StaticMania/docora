import { defineDocsConfig } from 'docora'

/** Minimal config — the playground exists to exercise the theme, not to be a site. */
export default defineDocsConfig({
  site: {
    name: 'Playground',
    description: 'Scratch app for developing the theme.',
    locale: 'en',
  },

  header: {
    links: [{ label: 'Kitchen sink', href: '/docs/kitchen-sink' }],
  },

  footer: {
    credits: 'docora playground',
  },
})
