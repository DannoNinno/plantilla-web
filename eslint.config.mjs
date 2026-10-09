import {FlatCompat} from '@eslint/eslintrc';
import {fileURLToPath} from 'node:url';

const compat = new FlatCompat({baseDirectory: fileURLToPath(new URL('.', import.meta.url))});

export default [
  {ignores: ['.next/**', '.next-validation/**', '.test-build/**', '.open-next/**']},
  ...compat.extends('next/core-web-vitals', 'plugin:prettier/recommended'),
  {rules: {'prettier/prettier': 'warn'}},
];
