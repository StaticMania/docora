import { defineDocsConfig } from 'docs-theme'

export default defineDocsConfig({
  site: {
    name: 'My Docs',
    description: 'Documentation built with next-docs.',
    locale: 'en',
  },

  header: {
    links: [{ label: 'Docs', href: '/docs/getting-started/introduction' }],
  },

  socials: {
    // github: 'https://github.com/your-org/your-repo',
  },

  toc: {
    title: 'On this page',
  },

  footer: {
    credits: `Built with next-docs · ${new Date().getFullYear()}`,
  },
})
