import { defineDocsConfig } from 'docs-theme'

export default defineDocsConfig({
  site: {
    name: 'next-docs',
    description: 'A documentation framework for Next.js.',
    // Change this to the deployed URL; it drives canonical links, the sitemap
    // and social images.
    url: 'https://next-docs.example.com',
    locale: 'en',
  },

  header: {
    links: [
      { label: 'Docs', href: '/docs/getting-started/introduction' },
      { label: 'Roadmap', href: '/#roadmap' },
    ],
  },

  // Placeholder repository — swap once the project has a public home.
  socials: {
    github: 'https://github.com/Arifulislam5577/next-docs',
  },

  assistant: {
    suggestions: [
      'How do I add a new page?',
      'How does the sidebar order work?',
      'What MDC components are available?',
    ],
  },

  toc: {
    title: 'On this page',
    bottom: {
      title: 'Community',
      links: [
        {
          label: 'Report an issue',
          href: 'https://github.com/Arifulislam5577/next-docs/issues',
          icon: 'book-open',
        },
      ],
    },
  },

  github: {
    url: 'https://github.com/Arifulislam5577/next-docs',
    branch: 'main',
    // Where this app sits in the repository, so edit links resolve.
    rootDir: 'apps/docs',
  },

  footer: {
    credits: 'Built with next-docs',
    links: [
      { label: 'Docs', href: '/docs/getting-started/introduction' },
      { label: 'GitHub', href: 'https://github.com/Arifulislam5577/next-docs' },
    ],
  },
})
