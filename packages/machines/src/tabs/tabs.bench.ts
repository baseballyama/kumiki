/**
 * Performance benchmarks for `@kumiki/machines/tabs`.
 *
 * Tabs has two activation modes (automatic / manual) that take
 * different transition paths. Both are bench-covered so we'd notice
 * if one regresses on its own.
 */

import { bench, describe } from 'vitest';
import { createTabsMachine, type TabItem, type TabsMachine } from './index.ts';

const ITEMS: ReadonlyArray<TabItem> = [
  { id: 'overview', value: 'overview', label: 'Overview' },
  { id: 'pricing', value: 'pricing', label: 'Pricing' },
  { id: 'reviews', value: 'reviews', label: 'Reviews' },
  { id: 'faq', value: 'faq', label: 'FAQ' },
  { id: 'contact', value: 'contact', label: 'Contact' },
];

describe('machines/tabs / construction', () => {
  bench('createTabsMachine() automatic activation', () => {
    createTabsMachine({ items: ITEMS, activation: 'automatic' });
  });

  bench('createTabsMachine() manual activation', () => {
    createTabsMachine({ items: ITEMS, activation: 'manual' });
  });
});

let m: TabsMachine;

describe('machines/tabs / send (automatic)', () => {
  bench(
    'NAVIGATE next × 4 (automatic — selection follows focus)',
    () => {
      for (let i = 0; i < 4; i++) m.send({ type: 'NAVIGATE', direction: 'next' });
    },
    {
      setup: () =>
        void (m = createTabsMachine({
          items: ITEMS,
          activation: 'automatic',
          defaultValue: 'overview',
        })),
    },
  );
});

describe('machines/tabs / send (manual)', () => {
  bench(
    'NAVIGATE next × 4 then ACTIVATE_FOCUSED',
    () => {
      for (let i = 0; i < 4; i++) m.send({ type: 'NAVIGATE', direction: 'next' });
      m.send({ type: 'ACTIVATE_FOCUSED' });
    },
    {
      setup: () =>
        void (m = createTabsMachine({
          items: ITEMS,
          activation: 'manual',
          defaultValue: 'overview',
        })),
    },
  );
});

describe('machines/tabs / select', () => {
  bench(
    'SELECT (jump-to)',
    () => {
      m.send({ type: 'SELECT', id: 'reviews' });
    },
    {
      setup: () =>
        void (m = createTabsMachine({
          items: ITEMS,
          defaultValue: 'overview',
        })),
    },
  );
});
