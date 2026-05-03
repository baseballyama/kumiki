import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  treeshake: true,
  clean: true,
  // Layer 3 keeps Layer 2 and Layer 1 external — consumers ship one copy of each.
  deps: { neverBundle: [/^@kumiki\//, 'svelte'] },
});
