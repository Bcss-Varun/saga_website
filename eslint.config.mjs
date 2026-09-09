import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import reactHooks from 'eslint-plugin-react-hooks';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'bake/**'] },
  ...compat.extends('next/core-web-vitals'),
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // The canvas work in checkpoint 3 lives or dies on effect cleanup.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      // App Router: the font link in app/layout.js is site-wide, not per-page.
      '@next/next/no-page-custom-font': 'off',
    },
  },
];

export default config;
