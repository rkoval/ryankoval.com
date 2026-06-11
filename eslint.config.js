import js from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

/** Rules ported from legacy .eslintrc */
const legacyRules = {
  strict: 'off',
  curly: ['error', 'multi-line', 'consistent'],
  'no-multi-assign': 'error',
  'no-debugger': 'warn',
  'no-control-regex': 'off',
  'prefer-promise-reject-errors': 'error',
  'no-mixed-spaces-and-tabs': 'off',
  'no-console': 'off',
  'comma-dangle': 'off',
  'object-shorthand': ['warn', 'properties'],
  'prefer-template': 'warn',
  'array-callback-return': 'error',
  'prefer-const': 'error',
};

/**
 * TypeScript-adapted legacy rules. Base `no-undef` / `no-unused-vars` /
 * `no-use-before-define` are replaced by their typescript-eslint equivalents.
 */
const legacyTypeScriptRules = {
  ...legacyRules,
  'no-undef': 'off',
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['warn', {args: 'none', varsIgnorePattern: '^(Promise|_)$'}],
  'no-use-before-define': 'off',
  '@typescript-eslint/no-use-before-define': [
    'error',
    {functions: false, classes: false, variables: true},
  ],
};

export default tseslint.config(
  {
    ignores: ['dist', '.output', '.vinxi', 'node_modules', '**/node_modules', '__snapshots__'],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...legacyTypeScriptRules,
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'server-only',
              message:
                'TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts` or mark it with `@tanstack/react-start/server-only`.',
            },
          ],
        },
      ],
      'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
    },
  },
  eslintPluginPrettier
);
