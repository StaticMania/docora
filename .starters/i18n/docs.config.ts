import { defineDocsConfig } from 'docora'

export default defineDocsConfig({
  site: {
    name: 'My Docs',
    description: 'Documentation built with Docora.',
    // Set this to enable canonical URLs, hreflang, the sitemap and social images.
    // url: 'https://docs.example.com',
  },

  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
    ],
  },

  header: {
    links: [{ label: 'Docs', href: '/en/docs/getting-started/introduction' }],
  },

  socials: {
    // github: 'https://github.com/your-org/your-repo',
  },

  footer: {
    credits: 'Built with Docora',
  },
})
