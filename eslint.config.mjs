import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {FlatCompat} from '@eslint/eslintrc';

const compat = new FlatCompat({baseDirectory: dirname(fileURLToPath(import.meta.url))});

const config = [
  {
    ignores: [
      '.next/**',
      '.next-validation/**',
      '.test-build/**',
      '.open-next/**',
      '.wrangler/**',
      'out/**',
      'next-env.d.ts',
      'cloudflare-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'plugin:prettier/recommended'),
  {rules: {'prettier/prettier': 'warn'}},
];

export default config;
