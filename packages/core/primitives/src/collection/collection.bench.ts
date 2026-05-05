/**
 * Performance benchmarks for `@kumiki/primitives/collection`.
 *
 * `getNextEnabledId` is called on every arrow-key press in Combobox,
 * Listbox, Menu, RadioGroup, Tabs — anywhere a roving cursor moves
 * across an ordered list. It runs inside the FSM transition, so its
 * cost compounds with `machine.send` overhead. Worth tracking.
 *
 * `findByTypeAhead` runs on rapid keystrokes during type-ahead in
 * Listbox / Menu. Less hot but fine to track in the same suite.
 *
 * Fixtures use 100-item lists so the linear scan does realistic work.
 */

import { bench, describe } from 'vitest';
import { type CollectionItem, findByTypeAhead, getNextEnabledId, tabindexFor } from './index.ts';

interface Item extends CollectionItem {
  id: string;
  label: string;
  disabled?: boolean;
}

const ITEMS_100: ReadonlyArray<Item> = Array.from({ length: 100 }, (_, i) => ({
  id: `item-${i}`,
  label: `Item ${String(i).padStart(3, '0')}`,
}));

const ITEMS_100_SPARSE: ReadonlyArray<Item> = Array.from({ length: 100 }, (_, i) => ({
  id: `item-${i}`,
  label: `Item ${String(i).padStart(3, '0')}`,
  // Every fourth item disabled — exercises the skip-disabled branch.
  ...(i % 4 === 0 ? { disabled: true } : {}),
}));

describe('primitives/collection / getNextEnabledId', () => {
  bench('next from middle (100 items, all enabled)', () => {
    getNextEnabledId(ITEMS_100, 'item-50', 'next');
  });

  bench('prev from middle (100 items, all enabled)', () => {
    getNextEnabledId(ITEMS_100, 'item-50', 'prev');
  });

  bench('first (100 items)', () => {
    getNextEnabledId(ITEMS_100, 'item-50', 'first');
  });

  bench('last (100 items)', () => {
    getNextEnabledId(ITEMS_100, 'item-50', 'last');
  });

  bench('page-next stride 10 (100 items)', () => {
    getNextEnabledId(ITEMS_100, 'item-15', 'page-next');
  });

  bench('next from middle, every 4th disabled', () => {
    getNextEnabledId(ITEMS_100_SPARSE, 'item-50', 'next');
  });

  bench('next from null (no current cursor)', () => {
    getNextEnabledId(ITEMS_100, null, 'next');
  });

  bench('next wrap end → start', () => {
    getNextEnabledId(ITEMS_100, 'item-99', 'next');
  });
});

describe('primitives/collection / findByTypeAhead', () => {
  bench('first match (1-char query, 100 items)', () => {
    findByTypeAhead(ITEMS_100, 'I');
  });

  bench('deep match (4-char query, 100 items)', () => {
    findByTypeAhead(ITEMS_100, 'Item 042');
  });

  bench('no match (100 items)', () => {
    findByTypeAhead(ITEMS_100, 'xxx');
  });
});

describe('primitives/collection / tabindexFor', () => {
  bench('roving tabindex on focused item (100 items)', () => {
    tabindexFor(ITEMS_100, 'item-50', 'item-50');
  });

  bench('roving tabindex on non-focused item (100 items)', () => {
    tabindexFor(ITEMS_100, 'item-13', 'item-50');
  });

  bench('roving tabindex with no focus (100 items)', () => {
    tabindexFor(ITEMS_100, 'item-13', null);
  });
});
