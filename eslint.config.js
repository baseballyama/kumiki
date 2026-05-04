// Flat config root. Each package can override via its own eslint.config.js.
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import tsParser from '@typescript-eslint/parser';

const browserAndNodeGlobals = {
  process: 'readonly',
  crypto: 'readonly',
  console: 'readonly',
  document: 'readonly',
  window: 'readonly',
  globalThis: 'readonly',
  HTMLElement: 'readonly',
  HTMLButtonElement: 'readonly',
  Element: 'readonly',
  Node: 'readonly',
  MouseEvent: 'readonly',
  KeyboardEvent: 'readonly',
  Event: 'readonly',
  EventListener: 'readonly',
  AbortSignal: 'readonly',
  Intl: 'readonly',
};

// Base ESLint's `no-unused-vars` doesn't understand TypeScript syntax
// (parameter types, function-type signatures, etc.). TypeScript's
// `noUnusedLocals` / `noUnusedParameters` would be the right replacement, but
// we keep them off in tsconfig since strict + bundler mode is already loud
// enough. Disable the rule here rather than chase phantom errors.
const sharedRules = {
  'no-unused-vars': 'off',
  'no-undef': 'off', // TypeScript handles this; eslint's heuristic misjudges TS types.
};

export default [
  js.configs.recommended,
  ...svelte.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: browserAndNodeGlobals,
    },
    rules: sharedRules,
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
      },
      globals: browserAndNodeGlobals,
    },
    rules: sharedRules,
  },
  {
    ignores: [
      '**/dist/**',
      '**/.svelte-kit/**',
      '**/node_modules/**',
      '**/coverage/**',
      // External reference repositories (git submodules).
      'references/**',
    ],
  },
];
