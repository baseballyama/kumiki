/**
 * Performance benchmarks for `@kumiki/machines/combobox`.
 *
 * Most complex machine in the catalog — three states, ~20 events, async
 * race-token guarding, sync filter on every keystroke. Provides the
 * upper bound for "how slow can a single Kumiki machine get". A
 * regression here is a flag for the whole framework.
 *
 * The fixtures use a 100-item options list so the filter loop has
 * realistic work to do; smaller lists hide regressions.
 */

import { bench, describe } from 'vitest';
import { createComboboxMachine, type ComboboxMachine, type ComboboxOption } from './index.ts';

interface User extends ComboboxOption {
  id: string;
  label: string;
  email: string;
}

const OPTIONS: ReadonlyArray<User> = Array.from({ length: 100 }, (_, i) => ({
  id: `u${i}`,
  label: `User ${String(i).padStart(3, '0')}`,
  email: `user${i}@example.test`,
}));

describe('machines/combobox / construction', () => {
  bench('createComboboxMachine() with 100 options', () => {
    createComboboxMachine<User>({ options: OPTIONS });
  });

  bench('createComboboxMachine() with empty options', () => {
    createComboboxMachine<User>({ options: [] });
  });
});

let m: ComboboxMachine<User>;

describe('machines/combobox / open + navigate', () => {
  bench(
    'OPEN → INPUT.NAVIGATE next × 5',
    () => {
      m.send({ type: 'OPEN' });
      for (let i = 0; i < 5; i++) m.send({ type: 'INPUT.NAVIGATE', direction: 'next' });
    },
    { setup: () => void (m = createComboboxMachine<User>({ options: OPTIONS })) },
  );

  bench(
    'OPEN → CLOSE round trip',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'CLOSE' });
    },
    { setup: () => void (m = createComboboxMachine<User>({ options: OPTIONS })) },
  );
});

describe('machines/combobox / filter (hot path)', () => {
  bench(
    'INPUT.CHANGE — 100 options, 1-char prefix match',
    () => {
      m.send({ type: 'INPUT.CHANGE', value: 'u' });
    },
    { setup: () => void (m = createComboboxMachine<User>({ options: OPTIONS })) },
  );

  bench(
    'INPUT.CHANGE — 100 options, deep match',
    () => {
      m.send({ type: 'INPUT.CHANGE', value: 'User 042' });
    },
    { setup: () => void (m = createComboboxMachine<User>({ options: OPTIONS })) },
  );

  bench(
    'INPUT.CHANGE — 100 options, no match',
    () => {
      m.send({ type: 'INPUT.CHANGE', value: 'xyz-no-match' });
    },
    { setup: () => void (m = createComboboxMachine<User>({ options: OPTIONS })) },
  );

  bench(
    'typing burst (5 keystrokes)',
    () => {
      m.send({ type: 'INPUT.CHANGE', value: 'U' });
      m.send({ type: 'INPUT.CHANGE', value: 'Us' });
      m.send({ type: 'INPUT.CHANGE', value: 'Use' });
      m.send({ type: 'INPUT.CHANGE', value: 'User' });
      m.send({ type: 'INPUT.CHANGE', value: 'User 0' });
    },
    { setup: () => void (m = createComboboxMachine<User>({ options: OPTIONS })) },
  );
});

describe('machines/combobox / select', () => {
  bench(
    'OPTION.SELECT (open + select first option)',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'OPTION.SELECT', option: OPTIONS[0]! });
    },
    { setup: () => void (m = createComboboxMachine<User>({ options: OPTIONS })) },
  );

  bench(
    'SET.VALUE (programmatic, no state change)',
    () => {
      m.send({ type: 'SET.VALUE', value: OPTIONS[42]! });
    },
    { setup: () => void (m = createComboboxMachine<User>({ options: OPTIONS })) },
  );
});
