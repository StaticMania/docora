import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    settings: {
      react: {
        version: '19.2',
      },
      next: {
        rootDir: ['apps/*/', '.starters/*/'],
      },
    },
    rules: {
      'react/prefer-read-only-props': 'error',
      'react-hooks/set-state-in-effect': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/postcss.config.mjs'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },
  globalIgnores([
    '**/.next/**',
    '**/out/**',
    '**/dist/**',
    '**/node_modules/**',
    '**/next-env.d.ts',
    'packages/create-docora/templates/**',
  ]),
])
