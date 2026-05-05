/**
 * Performance benchmarks for `@kumiki/machines/select`.
 *
 * Listbox-shaped (idle/open) — second-most-complex machine after
 * Combobox. Uses `@kumiki/primitives/collection` under the hood for
 * NAVIGATE; bench coverage cross-validates that combination.
 */

import { bench, describe } from 'vitest';
import { createSelectMachine, type SelectItem, type SelectMachine } from './index.ts';

interface Country {
  code: string;
  name: string;
}

const ITEMS: ReadonlyArray<SelectItem<Country>> = Array.from({ length: 50 }, (_, i) => ({
  id: `country-${i}`,
  value: { code: `c${i}`, name: `Country ${String(i).padStart(2, '0')}` },
  label: `Country ${String(i).padStart(2, '0')}`,
}));

describe('machines/select / construction', () => {
  bench('createSelectMachine() with 50 items', () => {
    createSelectMachine<Country>({ items: ITEMS });
  });
});

let m: SelectMachine<Country>;

describe('machines/select / send (dispatch)', () => {
  bench(
    'OPEN → NAVIGATE next × 5 → SELECT',
    () => {
      m.send({ type: 'OPEN' });
      for (let i = 0; i < 5; i++) m.send({ type: 'NAVIGATE', direction: 'next' });
      m.send({ type: 'SELECT', id: 'country-5' });
    },
    { setup: () => void (m = createSelectMachine<Country>({ items: ITEMS })) },
  );

  bench(
    'TYPEAHEAD burst (3 chars matching one item)',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'TYPEAHEAD', char: 'C' });
      m.send({ type: 'TYPEAHEAD', char: 'o' });
      m.send({ type: 'TYPEAHEAD', char: 'u' });
    },
    { setup: () => void (m = createSelectMachine<Country>({ items: ITEMS })) },
  );

  bench(
    'SET.VALUE programmatic',
    () => {
      m.send({ type: 'SET.VALUE', value: { code: 'c10', name: 'Country 10' } });
    },
    { setup: () => void (m = createSelectMachine<Country>({ items: ITEMS })) },
  );

  bench(
    'OPEN / CLOSE round trip',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'CLOSE' });
    },
    { setup: () => void (m = createSelectMachine<Country>({ items: ITEMS })) },
  );
});
