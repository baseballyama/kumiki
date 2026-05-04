import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/with-validation/index.ts',
    'src/with-async-search/index.ts',
    'src/with-multi-select/index.ts',
    'src/with-virtualization/index.ts',
  ],
  format: ['esm'],
  dts: true,
  treeshake: true,
  clean: true,
  deps: { neverBundle: [/^@kumiki\//, 'svelte'] },
});
