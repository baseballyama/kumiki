import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/focus-trap/index.ts',
    'src/dismissable/index.ts',
    'src/id/index.ts',
    'src/locale/index.ts',
    'src/live-region/index.ts',
    'src/collection/index.ts',
    'src/interactions/index.ts',
    'src/motion/index.ts',
    'src/portal/index.ts',
  ],
  format: ['esm'],
  dts: true,
  treeshake: true,
  clean: true,
});
