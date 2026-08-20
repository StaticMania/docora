import { Container, Section, SectionHeader } from './primitives'
import { CodeSwitcher, type CodeSwitcherFile } from './code-switcher'
import { highlight } from './code-surface'

const FILES = [
  {
    name: 'docs.config.ts',
    icon: 'file-code',
    lang: 'ts',
    code: `import { defineDocsConfig } from 'docora'

export default defineDocsConfig({
  site: {
    name: 'Acme',
    description: 'Acme documentation',
  },
})`,
  },
  {
    name: '1.introduction.mdx',
    icon: 'file-text',
    lang: 'mdx',
    code: `---
title: Introduction
description: What the theme gives you.
icon: house
---

Every file under \`content/\` is a route.
Numeric prefixes order the sidebar
and never appear in the URL.`,
  },
  {
    name: 'app/layout.tsx',
    icon: 'braces',
    lang: 'tsx',
    code: `import { DocsRoot } from 'docora'
import docsConfig from '../docs.config'

export default function RootLayout({ children }) {
  return <DocsRoot config={docsConfig}>{children}</DocsRoot>
}`,
  },
  {
    name: 'content/',
    icon: 'folder-tree',
    lang: 'bash',
    code: `content/
├── index.mdx
└── docs/
    └── 1.getting-started/
        ├── .navigation.yml
        └── 1.introduction.mdx`,
  },
] as const

export async function ProjectShape() {
  const files: CodeSwitcherFile[] = await Promise.all(
    FILES.map(async file => ({
      name: file.name,
      icon: file.icon,
      node: await highlight(file.code, file.lang),
    })),
  )

  return (
    <Section id="structure" tone="muted">
      <Container>
        <SectionHeader
          eyebrow="Project shape"
          eyebrowIcon="folder-tree"
          title="A Next.js app, a content folder"
          description="Scaffolding gives you an App Router project. Add pages as files; keep using anything else Next.js already does."
        />

        <CodeSwitcher files={files} className="mt-14" />
      </Container>
    </Section>
  )
}
