// Flat config root. Each package can override via its own eslint.config.js.
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  ...svelte.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
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
      },
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
      },
    },
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
