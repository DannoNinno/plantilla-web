import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-plugin-prettier/recommended';

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
  ...nextVitals,
  prettier,
  {rules: {'prettier/prettier': 'warn'}},
];

export default config;
