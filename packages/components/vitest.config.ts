import { defineConfig } from 'vitest/config';

/**
 * Vitest config for @kumiki/components.
 *
 * svelte-package copies the entire src/ tree into dist/, including any
 * `*.test.ts` files. Vitest's default `include` glob walks the whole
 * package and picks them up (post-build), where the relative TS imports
 * no longer resolve. We constrain include to src/ and explicitly exclude
 * the build outputs.
 */
export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['dist/**', '.svelte-kit/**', 'node_modules/**'],
    passWithNoTests: true,
  },
});
