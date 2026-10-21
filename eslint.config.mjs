import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

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
  ...nextCoreWebVitals,
  prettierRecommended,
  {
    rules: {
      'prettier/prettier': 'warn',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

export default config;
