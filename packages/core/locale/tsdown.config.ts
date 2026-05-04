import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/en/index.ts',
    'src/ja/index.ts',
    'src/zh-Hans/index.ts',
    'src/zh-Hant/index.ts',
    'src/ko/index.ts',
    'src/es/index.ts',
    'src/fr/index.ts',
    'src/de/index.ts',
    'src/ar/index.ts',
    'src/he/index.ts',
  ],
  format: ['esm'],
  dts: true,
  treeshake: true,
  clean: true,
});
