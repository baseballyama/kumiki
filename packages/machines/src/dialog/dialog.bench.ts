/**
 * Performance benchmarks for `@kumiki/machines/dialog`.
 *
 * Mid-complexity machine — two states + policy guards on ESCAPE /
 * OUTSIDE_CLICK. Useful to validate that guard-evaluation overhead
 * stays reasonable when the typical flow exercises them on every
 * dispatch.
 */

import { bench, describe } from 'vitest';
import { createDialogMachine, type DialogMachine } from './index.ts';

describe('machines/dialog / construction', () => {
  bench('createDialogMachine() default', () => {
    createDialogMachine();
  });

  bench('createDialogMachine({ defaultOpen: true })', () => {
    createDialogMachine({ defaultOpen: true });
  });

  bench('createDialogMachine({ closeOnEscape: false })', () => {
    createDialogMachine({ closeOnEscape: false });
  });
});

let m: DialogMachine;

describe('machines/dialog / send (dispatch)', () => {
  bench(
    'OPEN / CLOSE round trip',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'CLOSE' });
    },
    { setup: () => void (m = createDialogMachine()) },
  );

  bench(
    'TOGGLE × 2 round trip',
    () => {
      m.send({ type: 'TOGGLE' });
      m.send({ type: 'TOGGLE' });
    },
    { setup: () => void (m = createDialogMachine()) },
  );

  bench(
    'ESCAPE while open (closeOnEscape: true → guard pass → close)',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'ESCAPE' });
    },
    { setup: () => void (m = createDialogMachine()) },
  );

  bench(
    'ESCAPE while open (closeOnEscape: false → guard reject → no-op)',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'ESCAPE' });
    },
    { setup: () => void (m = createDialogMachine({ closeOnEscape: false })) },
  );

  bench(
    'SET.OPEN idempotent (same value → no transition)',
    () => {
      m.send({ type: 'SET.OPEN', open: false });
    },
    { setup: () => void (m = createDialogMachine()) },
  );
});
