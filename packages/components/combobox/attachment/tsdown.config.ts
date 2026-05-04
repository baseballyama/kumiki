import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/with-validation/index.ts', 'src/with-async-search/index.ts'],
  format: ['esm'],
  dts: true,
  treeshake: true,
  clean: true,
  deps: { neverBundle: [/^@kumiki\//, 'svelte'] },
});
