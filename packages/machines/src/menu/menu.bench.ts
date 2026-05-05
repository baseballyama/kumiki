import { bench, describe } from 'vitest';
import { createMenuMachine, type MenuItem, type MenuMachine } from './index.ts';

const ITEMS: ReadonlyArray<MenuItem> = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { id: 'sep', kind: 'separator' },
  { id: 'delete', label: 'Delete' },
];

describe('machines/menu / construction', () => {
  bench('createMenuMachine()', () => {
    createMenuMachine({ items: ITEMS });
  });
});

let m: MenuMachine;

describe('machines/menu / send (dispatch)', () => {
  bench(
    'OPEN → NAVIGATE next × 3 → ACTIVATE',
    () => {
      m.send({ type: 'OPEN' });
      for (let i = 0; i < 3; i++) m.send({ type: 'NAVIGATE', direction: 'next' });
      m.send({ type: 'ACTIVATE', id: 'paste' });
    },
    { setup: () => void (m = createMenuMachine({ items: ITEMS })) },
  );

  bench(
    'TYPEAHEAD burst (3 chars)',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'TYPEAHEAD', char: 'P' });
      m.send({ type: 'TYPEAHEAD', char: 'a' });
      m.send({ type: 'TYPEAHEAD', char: 's' });
    },
    { setup: () => void (m = createMenuMachine({ items: ITEMS })) },
  );

  bench(
    'OPEN / CLOSE round trip',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'CLOSE' });
    },
    { setup: () => void (m = createMenuMachine({ items: ITEMS })) },
  );
});
