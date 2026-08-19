import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  outExtension: () => ({ js: '.mjs' }),
  target: 'node20',
  clean: true,
  // Bundle Clack/nypm so `npx create-docora` stays a single file.
  noExternal: [/.*/],
  banner: { js: '#!/usr/bin/env node' },
})
