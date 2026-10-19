import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    '.worktrees/**',
    'out/**',
    'build/**',
    'playwright-report/**',
    'test-results/**',
    '.playwright/**',
    // Git-ignored measurement reports, traces and downloaded CI artifacts (their trace-viewer bundles are not source).
    '.superpowers/**',
    'next-env.d.ts'
  ])
]);
