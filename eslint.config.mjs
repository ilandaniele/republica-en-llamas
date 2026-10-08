import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/.expo/**', 'apps/mobile/**', 'scripts/**', 'supabase/functions/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      complexity: ['warn', 15],
      'max-lines-per-function': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // React Compiler rules: legacy code violates them; warn until each screen is refactored.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'max-lines-per-function': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'posthog-js', message: 'Use the wrappers in lib/analytics.ts (posthog-js is lazy-loaded).' }],
          patterns: [{ group: ['@engine/*'], message: 'Import from @republica/game-engine instead.' }],
        },
      ],
    },
  },
  {
    files: ['apps/web/src/lib/analytics.ts', 'apps/web/src/**/__tests__/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
  { files: ['apps/web/src/**/*.tsx'], ...jsxA11y.flatConfigs.recommended },
  {
    files: ['packages/game-engine/src/**/*.ts'],
    languageOptions: { globals: globals.node },
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [{ group: ['react', 'react-*', '@supabase/*', 'posthog-js'], message: 'game-engine must stay pure: no UI or IO imports.' }] },
      ],
    },
  },
  {
    files: ['packages/game-engine/src/events/**', 'packages/game-engine/src/i18n/**', '**/__tests__/**', '**/*.test.{ts,tsx}'],
    rules: { 'max-lines-per-function': 'off' },
  },
  prettier,
);
