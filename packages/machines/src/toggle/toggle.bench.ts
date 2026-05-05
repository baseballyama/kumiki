/**
 * Performance benchmarks for `@kumiki/machines/toggle`.
 *
 * Smallest end-to-end FSM in the catalog — useful as a baseline for
 * "real machine" overhead vs. the synthetic runtime benchmarks. If
 * `send` here is materially slower than the runtime equivalent, the
 * machine's transition table or actions are doing something
 * unnecessary.
 *
 * Run with `pnpm --filter @kumiki/machines bench`.
 */

import { bench, describe } from 'vitest';
import { createToggleMachine, type ToggleMachine } from './index.ts';

describe('machines/toggle / construction', () => {
  bench('createToggleMachine() default', () => {
    const m = createToggleMachine();
    if (m.state.length === 0) throw new Error('unreachable');
  });

  bench('createToggleMachine({ initial: true })', () => {
    createToggleMachine({ initial: true });
  });

  bench('createToggleMachine({ disabled: true })', () => {
    createToggleMachine({ disabled: true });
  });
});

let m: ToggleMachine;

describe('machines/toggle / send (dispatch)', () => {
  bench(
    'TOGGLE (unpressed → pressed)',
    () => {
      m.send({ type: 'TOGGLE' });
    },
    { setup: () => void (m = createToggleMachine()) },
  );

  bench(
    'TOGGLE × 2 (round trip pressed ↔ unpressed)',
    () => {
      m.send({ type: 'TOGGLE' });
      m.send({ type: 'TOGGLE' });
    },
    { setup: () => void (m = createToggleMachine()) },
  );

  bench(
    'SET no-change guard (idempotent)',
    () => {
      m.send({ type: 'SET', pressed: false });
    },
    { setup: () => void (m = createToggleMachine({ initial: false })) },
  );

  bench(
    'DISABLE / ENABLE cycle',
    () => {
      m.send({ type: 'DISABLE' });
      m.send({ type: 'ENABLE' });
    },
    { setup: () => void (m = createToggleMachine()) },
  );
});
