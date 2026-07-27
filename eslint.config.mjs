import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const ignored = [
  '.next/**',
  'node_modules/**',
  'public/games/**',
  'public/partner-games/**',
  'public/art/**',
  'public/brand/**',
  'public/og/**'
];

const config = [
  { ignores: ignored },
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      '@next/next/no-img-element': 'error',
      'react/no-unescaped-entities': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
    }
  }
];

export default config;
