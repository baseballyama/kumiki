import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  treeshake: true,
  clean: true,
  // Pure runtime — no externals needed.
});
