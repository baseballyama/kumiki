/**
 * Performance benchmarks for `@kumiki/runtime`.
 *
 * The dispatch loop (`machine.send`) is the hot path — every keystroke,
 * mouse event, and reactive update goes through it. A regression here
 * shows up everywhere downstream.
 *
 * Run with `pnpm --filter @kumiki/runtime bench` (or `pnpm bench` from
 * the workspace root). Results print to stdout; vitest's bench mode
 * uses tinybench under the hood and reports ops/sec ± margin.
 *
 * This file is **not** wired into the bundle-size gate or the coverage
 * gate — it's a separate command. CI runs `vitest run` (excludes
 * `.bench.ts` by default); the benchmark suite is opt-in.
 */

import { bench, describe } from 'vitest';
import { defineMachine, type Machine } from './machine.ts';

type Ctx = { count: number; flag: boolean };
type Evt = { type: 'INC' } | { type: 'DEC' } | { type: 'TOGGLE' } | { type: 'SET'; value: number };
type Sta = 'idle' | 'running' | 'paused';

const factory = defineMachine<Ctx, Evt, Sta>({
  id: 'bench',
  initial: 'idle',
  context: { count: 0, flag: false },
  states: {
    idle: {
      on: {
        INC: {
          target: 'running',
          actions: [{ type: 'inc', exec: (c) => ({ count: c.count + 1 }) }],
        },
        TOGGLE: {
          target: 'idle',
          actions: [{ type: 'toggle', exec: (c) => ({ flag: !c.flag }) }],
        },
        SET: {
          target: 'idle',
          actions: [{ type: 'set', exec: (_, e) => ({ count: (e as { value: number }).value }) }],
        },
      },
    },
    running: {
      on: {
        INC: {
          target: 'running',
          actions: [{ type: 'inc', exec: (c) => ({ count: c.count + 1 }) }],
        },
        DEC: {
          target: 'running',
          actions: [{ type: 'dec', exec: (c) => ({ count: c.count - 1 }) }],
        },
        TOGGLE: 'paused',
      },
    },
    paused: {
      on: {
        TOGGLE: 'running',
      },
    },
  },
});

describe('runtime / construction', () => {
  bench('defineMachine + factory call', () => {
    const m = factory();
    // Touch the snapshot so the JIT can't optimize the call away entirely.
    if (m.state.length === 0) throw new Error('unreachable');
  });

  bench('factory() with init override', () => {
    factory({ context: { count: 42 }, state: 'running' });
  });
});

let m: Machine<Ctx, Evt, Sta>;

describe('runtime / send (dispatch)', () => {
  bench(
    'self-transition with action (no state change)',
    () => {
      m.send({ type: 'INC' });
    },
    {
      setup: () => {
        m = factory({ state: 'running' });
      },
    },
  );

  bench(
    'cross-state transition (idle → running)',
    () => {
      m.send({ type: 'INC' });
      m.send({ type: 'TOGGLE' }); // running → paused
      m.send({ type: 'TOGGLE' }); // paused → running
    },
    {
      setup: () => {
        m = factory();
      },
    },
  );

  bench(
    'unknown event (handler miss, no-op)',
    () => {
      m.send({ type: 'NOPE' as 'INC' });
    },
    {
      setup: () => {
        m = factory();
      },
    },
  );

  bench(
    'send with payload',
    () => {
      m.send({ type: 'SET', value: 7 });
    },
    {
      setup: () => {
        m = factory();
      },
    },
  );
});

describe('runtime / subscribe', () => {
  bench('subscribe + unsubscribe (no events)', () => {
    const m = factory();
    const off = m.subscribe(() => {});
    off();
  });

  bench(
    'send with 10 listeners attached',
    () => {
      m.send({ type: 'INC' });
    },
    {
      setup: () => {
        m = factory({ state: 'running' });
        for (let i = 0; i < 10; i++) m.subscribe(() => {});
      },
    },
  );
});

describe('runtime / toJSON', () => {
  bench('toJSON (XState-compatible export)', () => {
    factory().toJSON();
  });
});
