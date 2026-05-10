#!/usr/bin/env node
/**
 * Emit `machine.toJSON()` snapshots for every Layer 2 FSM in
 * `@kumiki/machines/*` to `apps/docs/static/machine-specs/<name>.json`,
 * plus an `index.json` summary.
 *
 * The output is XState v5 — compatible JSON: paste it into
 * <https://stately.ai/viz> to visualize, or feed it to llms-full.txt
 * generation.
 *
 * Promised in `docs/release/v1-execution-plan.md` Track A-2 "FSM 列".
 *
 * Run via `pnpm --filter @kumiki/docs machine-specs` (depends on
 * `@kumiki/machines` being built — `pnpm build` from the repo root or
 * `pnpm --filter @kumiki/machines build`).
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CalendarDate } from '@internationalized/date';

import { createAccordionMachine } from '@kumiki/machines/accordion';
import { createCalendarMachine } from '@kumiki/machines/calendar';
import { createCheckboxMachine } from '@kumiki/machines/checkbox';
import { createComboboxMachine } from '@kumiki/machines/combobox';
import { createDialogMachine } from '@kumiki/machines/dialog';
import { createFormFieldMachine } from '@kumiki/machines/form-field';
import { createMenuMachine } from '@kumiki/machines/menu';
import { createNumberFieldMachine } from '@kumiki/machines/number-field';
import { createPopoverMachine } from '@kumiki/machines/popover';
import { createRadioGroupMachine } from '@kumiki/machines/radio-group';
import { createSelectMachine } from '@kumiki/machines/select';
import { createSliderMachine } from '@kumiki/machines/slider';
import { createSwitchMachine } from '@kumiki/machines/switch';
import { createTabsMachine } from '@kumiki/machines/tabs';
import { createToastMachine } from '@kumiki/machines/toast';
import { createToggleMachine } from '@kumiki/machines/toggle';
import { createTooltipMachine } from '@kumiki/machines/tooltip';

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = dirname(__filename);
const OUT_DIR = join(SCRIPT_DIR, '..', 'static', 'machine-specs');
const TS_INDEX_PATH = join(SCRIPT_DIR, '..', 'src', 'lib', 'playgrounds', 'machine-specs-index.ts');

/**
 * One entry per machine. `make()` constructs the machine with the
 * smallest valid input that exercises the documented surface — the
 * point is to expose state shape, not to drive behavior.
 */
const ENTRIES = [
  {
    name: 'accordion',
    pkg: '@kumiki/machines/accordion',
    blurb: 'Single- or multi-region disclosure (APG accordion).',
    make: () =>
      createAccordionMachine({
        items: [
          { id: 'one', value: 'one' },
          { id: 'two', value: 'two' },
        ],
      }),
  },
  {
    name: 'calendar',
    pkg: '@kumiki/machines/calendar',
    blurb:
      'Date-grid focus & selection (Gregorian here, Hijri / Buddhist / Hebrew supported via @internationalized/date).',
    make: () => createCalendarMachine({ focusedDate: new CalendarDate(2026, 5, 10) }),
  },
  {
    name: 'checkbox',
    pkg: '@kumiki/machines/checkbox',
    blurb: 'Tri-state (unchecked / checked / mixed) checkbox.',
    make: () => createCheckboxMachine(),
  },
  {
    name: 'combobox',
    pkg: '@kumiki/machines/combobox',
    blurb: 'APG combobox (single-select listbox + filterable input).',
    make: () =>
      createComboboxMachine({
        options: [
          { value: 'a', label: 'Apple' },
          { value: 'b', label: 'Banana' },
        ],
      }),
  },
  {
    name: 'dialog',
    pkg: '@kumiki/machines/dialog',
    blurb: 'Modal / non-modal dialog with focus trap + scroll-lock states.',
    make: () => createDialogMachine(),
  },
  {
    name: 'form-field',
    pkg: '@kumiki/machines/form-field',
    blurb: 'Per-field state (pristine / dirty / touched / validating / invalid).',
    make: () => createFormFieldMachine({ initialValue: '' }),
  },
  {
    name: 'menu',
    pkg: '@kumiki/machines/menu',
    blurb: 'APG menu / menubar (open + highlighted item navigation).',
    make: () =>
      createMenuMachine({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
        ],
      }),
  },
  {
    name: 'number-field',
    pkg: '@kumiki/machines/number-field',
    blurb: 'APG spinbutton — bounded numeric input with step & long-press repeat.',
    make: () => createNumberFieldMachine(),
  },
  {
    name: 'popover',
    pkg: '@kumiki/machines/popover',
    blurb: 'Non-modal anchored panel.',
    make: () => createPopoverMachine(),
  },
  {
    name: 'radio-group',
    pkg: '@kumiki/machines/radio-group',
    blurb: 'APG radiogroup with roving tabindex.',
    make: () =>
      createRadioGroupMachine({
        items: [
          { id: 'a', value: 'a' },
          { id: 'b', value: 'b' },
        ],
      }),
  },
  {
    name: 'select',
    pkg: '@kumiki/machines/select',
    blurb: 'APG listbox-style select (no inline filter — use combobox for that).',
    make: () =>
      createSelectMachine({
        items: [
          { id: 'a', value: 'a', label: 'Alpha' },
          { id: 'b', value: 'b', label: 'Beta' },
        ],
      }),
  },
  {
    name: 'slider',
    pkg: '@kumiki/machines/slider',
    blurb: 'APG slider (single-thumb here; range slider composes two).',
    make: () => createSliderMachine(),
  },
  {
    name: 'switch',
    pkg: '@kumiki/machines/switch',
    blurb: 'On/off switch (aria-checked).',
    make: () => createSwitchMachine(),
  },
  {
    name: 'tabs',
    pkg: '@kumiki/machines/tabs',
    blurb: 'APG tabs — automatic / manual activation, RTL-aware arrow keys.',
    make: () =>
      createTabsMachine({
        items: [
          { value: 'overview', id: 'overview' },
          { value: 'details', id: 'details' },
        ],
      }),
  },
  {
    name: 'toast',
    pkg: '@kumiki/machines/toast',
    blurb: 'Live-region notification queue.',
    make: () => createToastMachine(),
  },
  {
    name: 'toggle',
    pkg: '@kumiki/machines/toggle',
    blurb: 'aria-pressed two-state toggle.',
    make: () => createToggleMachine(),
  },
  {
    name: 'tooltip',
    pkg: '@kumiki/machines/tooltip',
    blurb: 'Hover / focus tooltip with open-delay + group sharing.',
    make: () => createTooltipMachine(),
  },
];

mkdirSync(OUT_DIR, { recursive: true });

const summary = [];
let errors = 0;

for (const entry of ENTRIES) {
  let json;
  try {
    json = entry.make().toJSON();
  } catch (err) {
    errors++;
    console.error(`✘ ${entry.name}: failed to construct — ${err.message ?? err}`);
    continue;
  }
  const outPath = join(OUT_DIR, `${entry.name}.json`);
  writeFileSync(outPath, JSON.stringify(json, null, 2) + '\n', 'utf8');
  summary.push({
    name: entry.name,
    package: entry.pkg,
    file: `${entry.name}.json`,
    blurb: entry.blurb,
    states: Object.keys(json.states ?? {}),
    initial: json.initial,
  });
}

const indexPath = join(OUT_DIR, 'index.json');
writeFileSync(
  indexPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      visualizer: 'https://stately.ai/viz',
      machines: summary,
    },
    null,
    2,
  ) + '\n',
  'utf8',
);

// Emit a tiny TS module so playground pages know which machines have specs
// without needing fs at request time. Imported by `routes/play/[package]/+page.ts`.
const tsLines = [
  '/**',
  ' * AUTO-GENERATED by `apps/docs/scripts/build-machine-specs.mjs`. Do not edit by hand.',
  ' *',
  ' * Lists the Layer 2 machines whose `toJSON()` snapshot is published at',
  ' * `/machine-specs/<name>.json`. Used by the `/play/<slug>` route to render',
  ' * a "State machine" link to the JSON + stately.ai/viz.',
  ' */',
  '',
  'export interface MachineSpecMeta {',
  '  /** Bare machine name, e.g. `toggle`. Matches the JSON filename. */',
  '  readonly name: string;',
  '  /** Source package, e.g. `@kumiki/machines/toggle`. */',
  '  readonly pkg: string;',
  '  /** One-line blurb echoing the build-machine-specs entry. */',
  '  readonly blurb: string;',
  '  /** Top-level state names, in declaration order. */',
  '  readonly states: readonly string[];',
  '  /** Initial state. */',
  '  readonly initial: string;',
  '}',
  '',
  'export const MACHINE_SPECS = {',
];
for (const m of summary) {
  tsLines.push(`  ${JSON.stringify(m.name)}: {`);
  tsLines.push(`    name: ${JSON.stringify(m.name)},`);
  tsLines.push(`    pkg: ${JSON.stringify(m.package)},`);
  tsLines.push(`    blurb: ${JSON.stringify(m.blurb)},`);
  tsLines.push(`    states: ${JSON.stringify(m.states)} as const,`);
  tsLines.push(`    initial: ${JSON.stringify(m.initial)},`);
  tsLines.push('  },');
}
tsLines.push('} as const satisfies Record<string, MachineSpecMeta>;');
tsLines.push('');
tsLines.push('export type MachineSpecName = keyof typeof MACHINE_SPECS;');
tsLines.push('');
tsLines.push('/**');
tsLines.push(' * Resolve a play-route slug (`machine-toggle`, `attachment-toggle`,');
tsLines.push(' * `component-toggle`) to its machine spec metadata if one exists.');
tsLines.push(' */');
tsLines.push('export function findMachineSpec(slug: string): MachineSpecMeta | undefined {');
tsLines.push("  const key = slug.replace(/^(machine|attachment|component)-/, '');");
tsLines.push('  return (MACHINE_SPECS as Record<string, MachineSpecMeta>)[key];');
tsLines.push('}');
tsLines.push('');
writeFileSync(TS_INDEX_PATH, tsLines.join('\n'), 'utf8');

console.log(`✓ Wrote ${summary.length}/${ENTRIES.length} machine specs to ${OUT_DIR}`);
console.log(`✓ Wrote TS index to ${TS_INDEX_PATH}`);
if (errors > 0) {
  console.error(`✘ ${errors} machine${errors === 1 ? '' : 's'} failed to serialize.`);
  process.exit(1);
}
