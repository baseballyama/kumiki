import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/dialog.ts', 'src/toggle.ts'],
  format: ['esm'],
  dts: true,
  treeshake: true,
  clean: true,
  deps: { neverBundle: [/^@kumiki\//, 'svelte'] },
});
