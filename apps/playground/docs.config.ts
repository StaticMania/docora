import { defineDocsConfig } from 'docs-theme'

export default defineDocsConfig({
  site: {
    name: 'next-docs',
    description: 'A documentation framework for Next.js.',
    locale: 'en',
  },

  header: {
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Roadmap', href: '/#roadmap' },
    ],
  },

  // Hardcoded for now — Phase 2 derives this tree from the content directory.
  navigation: [
    {
      label: 'Getting Started',
      icon: 'rocket',
      children: [
        { label: 'Introduction', href: '/docs', icon: 'house' },
        { label: 'Installation', href: '/docs/getting-started', icon: 'download' },
      ],
    },
    {
      label: 'Core Concepts',
      icon: 'brain',
      children: [{ label: 'Configuration', href: '/docs/configuration', icon: 'settings' }],
    },
  ],

  // Placeholder repository — swap once the project has a public home.
  socials: {
    github: 'https://github.com/Arifulislam5577/next-docs',
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
  },

  footer: {
    credits: 'Built with next-docs',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'GitHub', href: 'https://github.com/Arifulislam5577/next-docs' },
    ],
  },
})
