import { defineDocsConfig } from "docora";

export default defineDocsConfig({
  site: {
    name: "Docora",
    description: "Beautiful documentation for Next.js and React.",
    // Change this to the deployed URL; it drives canonical links, the sitemap
    // and social images.
    url: "https://docora.example.com",
    locale: "en",
  },

  header: {
    links: [],
  },

  // Placeholder repository — swap once the project has a public home.
  socials: {
    github: "https://github.com/StaticMania/docora",
  },

  assistant: {
    suggestions: [
      "How do I add a new page?",
      "How does the sidebar order work?",
      "What MDC components are available?",
    ],
  },

  toc: {
    title: "On this page",
    bottom: {
      title: "Community",
      links: [
        {
          label: "Report an issue",
          href: "https://github.com/StaticMania/docora/issues",
          icon: "book-open",
        },
      ],
    },
  },

  github: {
    url: "https://github.com/StaticMania/docora",
    branch: "main",
    // Where this app sits in the repository, so edit links resolve.
    rootDir: "apps/docs",
  },

  footer: {
    credits: "Built with Docora",
    links: [
      { label: "Docs", href: "/docs/getting-started/introduction" },
      { label: "GitHub", href: "https://github.com/StaticMania/docora" },
    ],
  },
});
