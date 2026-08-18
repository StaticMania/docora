import { defineDocsConfig } from 'docora'

export default defineDocsConfig({
  site: {
    name: 'My Docs',
    description: 'Documentation built with Docora.',
    // Set this to enable canonical URLs, the sitemap and social images.
    // url: 'https://docs.example.com',
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
    credits: `Built with Docora · ${new Date().getFullYear()}`,
  },
})
