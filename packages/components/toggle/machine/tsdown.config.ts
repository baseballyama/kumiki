import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  treeshake: true,
  clean: true,
  // Keep runtime / primitives external so consumers benefit from dedup.
  // (When measured via size-limit, the deps are still inlined to reflect what
  //  the user actually pays for the first time they import this package.)
  deps: { neverBundle: [/^@kumiki\//] },
});
