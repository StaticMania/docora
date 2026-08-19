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
    links: [],
  },

  socials: {
    // github: 'https://github.com/your-org/your-repo',
  },

  toc: {
    title: 'On this page',
  },

  footer: {
    credits: 'Built with Docora',
    columns: [
      {
        title: 'Docs',
        links: [
          { label: 'Introduction', href: '/docs/getting-started/introduction' },
          { label: 'Installation', href: '/docs/getting-started/installation' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'llms.txt', href: '/llms.txt' },
        ],
      },
    ],
  },
})
