import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/accordion/index.ts',
    'src/checkbox/index.ts',
    'src/combobox/index.ts',
    'src/combobox/with-validation/index.ts',
    'src/combobox/with-async-search/index.ts',
    'src/combobox/with-multi-select/index.ts',
    'src/combobox/with-virtualization/index.ts',
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
  // External: workspace deps + svelte (peer).
  deps: { neverBundle: [/^@kumiki\//, 'svelte'] },
});
