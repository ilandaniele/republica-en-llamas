import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import { readdirSync } from 'node:fs';

const WEB_SRC = './apps/web/src';
const FEATURES = readdirSync(`${WEB_SRC}/features`, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const SHARED_DIRS = ['components', 'hooks', 'lib', 'stores'];

// A feature never imports another feature; shared code never imports a feature.
const featureBoundaryZones = [
  ...FEATURES.map((feature) => ({
    target: `${WEB_SRC}/features/${feature}`,
    from: `${WEB_SRC}/features`,
    except: [`./${feature}`],
    message: 'Features are independent. Move shared code to components/, hooks/, stores/ or lib/.',
  })),
  {
    target: SHARED_DIRS.map((dir) => `${WEB_SRC}/${dir}`),
    from: `${WEB_SRC}/features`,
    message: 'Shared code must not depend on a feature.',
  },
];

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
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh, import: importPlugin },
    settings: { 'import/resolver': { typescript: { project: './apps/web/tsconfig.json' } } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // React Compiler rules: legacy code violates them; warn until each screen is refactored.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'max-lines-per-function': 'off',
      'import/no-restricted-paths': ['error', { zones: featureBoundaryZones }],
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
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Use createRng(seed) so runs stay replayable.' },
      ],
    },
  },
  {
    files: ['packages/game-engine/src/events/**', 'packages/game-engine/src/i18n/**', '**/__tests__/**', '**/*.test.{ts,tsx}'],
    rules: { 'max-lines-per-function': 'off' },
  },
  prettier,
);
