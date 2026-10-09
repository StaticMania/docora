#!/usr/bin/env node

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

// Dynamically transpile and import normalizeMdcToMarkdown from packages/docora/src/llm/mdc.ts
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const mdcSourcePath = path.join(root, 'packages/docora/src/llm/mdc.ts')
const tsCode = readFileSync(mdcSourcePath, 'utf8')

const jsCode = ts.transpileModule(tsCode, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext },
}).outputText

const dataUri = `data:text/javascript;base64,${Buffer.from(jsCode).toString('base64')}`
const { normalizeMdcToMarkdown } = await import(dataUri)

const CRLF = '\r\n'

test('MDC Normalization - CRLF vs LF consistency across all directives', async t => {
  const directives = [
    {
      name: 'Callout (::note)',
      input: '::note\nBe careful here.\n::\nNext paragraph',
    },
    {
      name: 'Callout with attributes (:::tip{title="ProTip"})',
      input: ':::tip{title="ProTip"}\nUseful tip content.\n:::\nNext paragraph',
    },
    {
      name: 'Card (:::card{title="..." to="..."})',
      input: ':::card{title="Install" to="/docs/install"}\nGet started fast.\n:::\nNext paragraph',
    },
    {
      name: 'Step (::step{title="Clone"})',
      input: '::step{title="Clone"}\nRun git clone repo.\n::\nNext paragraph',
    },
    {
      name: 'Collapsible (:::collapsible{name="Advanced"})',
      input: ':::collapsible{name="Advanced"}\nHidden detail goes here.\n:::\nNext paragraph',
    },
    {
      name: 'CTA (::::cta{label="Start" to="/docs"})',
      input: '::::cta{label="Start" to="/docs"}\n::::\nNext paragraph',
    },
    {
      name: 'Field (::::field{name="path" type="string" required})',
      input:
        '::::field{name="path" type="string" required}\nThe target file path.\n::::\nNext paragraph',
    },
    {
      name: 'Tabs item (::::tabs-item{label="npm"})',
      input: '::::tabs-item{label="npm"}\n```bash\nnpm install docora\n```\n::::\nNext paragraph',
    },
    {
      name: 'Accordion item (:::accordion-item{label="FAQ"})',
      input: ':::accordion-item{label="FAQ"}\nAnswer text.\n:::\nNext paragraph',
    },
    {
      name: 'Hero (::hero{title="Docora" description="Modern docs"})',
      input: '::hero{title="Docora" description="Modern docs"}\n::\nNext paragraph',
    },
    {
      name: 'Unknown container degradation',
      input: ':::custom-widget{prop="val"}\nInner content is preserved.\n:::\nNext paragraph',
    },
    {
      name: 'Code blocks shielding (unaltered code)',
      input: '```mdx\n::note\nExample inside code\n::\n```\nNext paragraph',
    },
  ]

  for (const { name, input } of directives) {
    await t.test(name, () => {
      const lfInput = input
      const crlfInput = input.replace(/\n/g, CRLF)

      const lfOutput = normalizeMdcToMarkdown(lfInput)
      const crlfOutput = normalizeMdcToMarkdown(crlfInput)

      assert.strictEqual(
        crlfOutput,
        lfOutput,
        `CRLF output did not match LF output for directive: ${name}`,
      )
      assert.ok(
        !crlfOutput.includes('\r'),
        `Output for ${name} should not contain carriage returns`,
      )
    })
  }
})

test('MDC Normalization - Complex nested structure with CRLF', () => {
  const complex = [
    '# Getting Started',
    '',
    '::hero{title="Welcome" description="Intro"}',
    '',
    ':::card{title="Installation" to="/docs/install"}',
    'Follow our simple setup guide.',
    ':::',
    '',
    '::note',
    'Requires Node 20 or higher.',
    '::',
    '',
    '::::tabs',
    '::::tabs-item{label="pnpm"}',
    '```bash',
    'pnpm add docora',
    '```',
    '::::',
    '::::',
  ].join(CRLF)

  const output = normalizeMdcToMarkdown(complex)

  assert.ok(output.includes('# Welcome'), 'Hero title should be normalized')
  assert.ok(output.includes('> [!NOTE]'), 'Note callout should be normalized to GFM alert')
  assert.ok(
    output.includes('[**Installation**](/docs/install)'),
    'Card should be converted to link',
  )
  assert.ok(output.includes('#### pnpm'), 'Tabs item should be normalized to heading')
  assert.ok(output.includes('pnpm add docora'), 'Code block should be restored intact')
  assert.ok(!output.includes('\r'), 'No carriage returns in output')
})
