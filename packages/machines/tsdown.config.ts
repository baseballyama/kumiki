import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/accordion/index.ts',
    'src/checkbox/index.ts',
    'src/combobox/index.ts',
    'src/dialog/index.ts',
    'src/form-field/index.ts',
    'src/menu/index.ts',
    'src/number-field/index.ts',
    'src/popover/index.ts',
    'src/radio-group/index.ts',
    'src/select/index.ts',
    'src/slider/index.ts',
    'src/switch/index.ts',
    'src/tabs/index.ts',
    'src/toast/index.ts',
    'src/toggle/index.ts',
    'src/tooltip/index.ts',
    'src/calendar/index.ts',
  ],
  format: ['esm'],
  dts: true,
  treeshake: true,
  clean: true,
  // Keep runtime / primitives external so consumers benefit from dedup.
  // (When measured via size-limit, the deps are still inlined to reflect
  //  what the user actually pays for the first time they import this.)
  deps: { neverBundle: [/^@kumiki\//] },
});
