# @kumiki/runtime

> Minimal pure-TS FSM runtime. ~700 B brotli; XState-compatible JSON export for the [stately.ai](https://stately.ai/viz) visualizer.

**Layer:** Layer 2 (shared by every `@kumiki/machines/<name>`).

## Install

```bash
pnpm add @kumiki/runtime
```

## Use

```ts
import { defineMachine } from '@kumiki/runtime';

const createToggle = defineMachine<{ pressed: boolean }, { type: 'TOGGLE' }, 'on' | 'off'>({
  id: 'toggle',
  initial: 'off',
  context: { pressed: false },
  states: {
    off: {
      on: {
        TOGGLE: { target: 'on', actions: [{ type: 'press', exec: () => ({ pressed: true }) }] },
      },
    },
    on: {
      on: {
        TOGGLE: { target: 'off', actions: [{ type: 'release', exec: () => ({ pressed: false }) }] },
      },
    },
  },
});

const m = createToggle();
m.send({ type: 'TOGGLE' }); // m.state === 'on'
```

## What's exported

| Symbol            | What it is                                                                     |
| ----------------- | ------------------------------------------------------------------------------ |
| `defineMachine()` | Factory factory — given a `MachineConfig`, returns a `(initial?) => Machine`.  |
| `Machine<C,E,S>`  | The runtime instance: `state`, `context`, `send()`, `subscribe()`, `toJSON()`. |
| `MachineConfig`   | The states + transitions definition.                                           |
| `Snapshot<C,S>`   | What `subscribe()` listeners receive.                                          |
| `XStateConfig`    | Shape of `toJSON()` — paste into [stately.ai/viz](https://stately.ai/viz).     |

`toJSON()` is the visualizer escape hatch — the same FSM defined in
TypeScript is browseable in stately.ai with no extra tooling.

## Performance

Bench numbers (vitest `bench` mode, dev machine):

- `defineMachine + factory call`: ~2.6M ops/s
- `send` self-transition with action: ~14M ops/s
- `send` cross-state transition: ~5M ops/s
- `send` unknown-event miss (no-op): ~18M ops/s

Run `pnpm bench` to refresh; full results at `/bench` on the docs site.

## See also

- [`@kumiki/machines`](../../machines) — Layer 2 component-specific machines built on this runtime.
- [`docs/design/04-state-machines.md`](../../../docs/design/04-state-machines.md) — runtime design doc.
- [ADR 0003](../../../docs/design/16-decisions/0003-state-machine-base.md) — why we built our own instead of using XState.
