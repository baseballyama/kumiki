import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/accordion.ts',
    'src/checkbox.ts',
    'src/combobox.ts',
    'src/dialog.ts',
    'src/form-field.ts',
    'src/number-field.ts',
    'src/radio-group.ts',
    'src/select.ts',
    'src/slider.ts',
    'src/switch.ts',
    'src/tabs.ts',
    'src/toggle.ts',
    'src/tooltip.ts',
  ],
  format: ['esm'],
  dts: true,
  treeshake: true,
  clean: true,
  deps: { neverBundle: [/^@kumiki\//, 'svelte'] },
});
