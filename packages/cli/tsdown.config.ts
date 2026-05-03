import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/bin/kumiki.ts'],
  format: ['esm'],
  dts: true,
  treeshake: true,
  clean: true,
});
