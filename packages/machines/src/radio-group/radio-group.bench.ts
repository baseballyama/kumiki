/**
 * Performance benchmarks for `@kumiki/machines/radio-group`.
 *
 * Radio group is the simplest collection-backed machine — single-state
 * (idle), navigation around an items array, no nested states. Acts as
 * the floor for "how cheap can a collection-backed machine be".
 */

import { bench, describe } from 'vitest';
import { createRadioGroupMachine, type RadioItem, type RadioGroupMachine } from './index.ts';

const ITEMS: ReadonlyArray<RadioItem<string>> = [
  { id: 'small', value: 'small', label: 'Small' },
  { id: 'medium', value: 'medium', label: 'Medium' },
  { id: 'large', value: 'large', label: 'Large' },
  { id: 'xlarge', value: 'xlarge', label: 'XL' },
];

describe('machines/radio-group / construction', () => {
  bench('createRadioGroupMachine()', () => {
    createRadioGroupMachine<string>({ items: ITEMS });
  });

  bench('createRadioGroupMachine({ defaultValue })', () => {
    createRadioGroupMachine<string>({ items: ITEMS, defaultValue: 'medium' });
  });
});

let m: RadioGroupMachine<string>;

describe('machines/radio-group / send (dispatch)', () => {
  bench(
    'NAVIGATE next round trip',
    () => {
      m.send({ type: 'NAVIGATE', direction: 'next' });
    },
    {
      setup: () =>
        void (m = createRadioGroupMachine<string>({ items: ITEMS, defaultValue: 'medium' })),
    },
  );

  bench(
    'SELECT (jump-to)',
    () => {
      m.send({ type: 'SELECT', id: 'large' });
    },
    {
      setup: () => void (m = createRadioGroupMachine<string>({ items: ITEMS })),
    },
  );

  bench(
    'SET.VALUE programmatic',
    () => {
      m.send({ type: 'SET.VALUE', value: 'medium' });
    },
    {
      setup: () => void (m = createRadioGroupMachine<string>({ items: ITEMS })),
    },
  );

  bench(
    'DISABLE / ENABLE',
    () => {
      m.send({ type: 'DISABLE' });
      m.send({ type: 'ENABLE' });
    },
    {
      setup: () => void (m = createRadioGroupMachine<string>({ items: ITEMS })),
    },
  );
});
