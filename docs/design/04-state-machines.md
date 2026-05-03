# 04 — State Machines

## 4.1 Why state machines

Every Kumiki component's behavior can be described as a finite state machine: a Combobox is in `idle`, `open`, `loading`, or `error`; a Dialog is `closed`, `opening`, `open`, or `closing`; a Toggle is `pressed` or `unpressed`. Encoding that explicitly buys us four things, in order of importance:

1. **Testability without a DOM.** We can run a machine in Vitest, send events, and assert state transitions. No `jsdom`, no Svelte runtime, no Playwright. The first 80% of bug coverage runs in milliseconds.
2. **Visualizability.** Each machine exports an XState-compatible JSON config. Drop the JSON into [stately.ai/viz](https://stately.ai/viz) and you see the statechart. This is invaluable for design reviews and contributor onboarding.
3. **Framework portability.** The machine doesn't import `svelte`. If we ever ship a React adapter (post-1.0), Layer 2 doesn't move.
4. **Predictability.** Ad-hoc reactivity ("if the user clicks while loading, also clear the input") drifts. A machine with explicit transitions catches the case at design time.

Both Zag.js and React Aria's `react-stately` validated this approach across 50+ components. We follow the Zag shape (a minimal FSM, intentionally simpler than full XState) — see [16-decisions/0003-state-machine-base.md](16-decisions/0003-state-machine-base.md).

## 4.2 Runtime: build vs adopt

We considered three options ([16-decisions/0003-state-machine-base.md](16-decisions/0003-state-machine-base.md)):

| Option                                      | gzip cost (added) | Visualizer story                                     | Decision                                                                                                                   |
| ------------------------------------------- | ----------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Custom minimal FSM in `@kumiki/runtime`** | ~1 KB             | Export to XState v5 config JSON; visualizer reads it | ✅ chosen                                                                                                                  |
| **XState v5 (`xstate`)** as runtime         | ~16 KB            | Native                                               | ❌ blows the budget. Combobox alone is 4.5 KB and shares the runtime                                                       |
| **Robot3**                                  | ~1.2 KB           | None first-party                                     | ❌ feature-thin (no nested states, no parallel states). Combobox needs nested states for `loading.async` vs `loading.sync` |

The chosen runtime is small enough to inline mentally:

```ts
// @kumiki/runtime — sketch (actual ≈ 200 lines).
export interface Machine<Context, Event extends { type: string }, State extends string> {
  readonly state: State;
  readonly context: Context;
  send(event: Event): void;
  subscribe(listener: (snapshot: { state: State; context: Context }) => void): () => void;
  toJSON(): XStateConfig; // for visualizer
}

export interface MachineConfig<Context, Event, State extends string> {
  id: string;
  context: Context;
  initial: State;
  states: Record<State, StateNode<Context, Event, State>>;
}

export interface StateNode<Context, Event, State> {
  on?: { [K in Event['type']]?: Transition<Context, Event, State> };
  entry?: Action<Context, Event>;
  exit?: Action<Context, Event>;
  // Nested states: substates share the parent's `on` plus their own.
  states?: Record<string, StateNode<Context, Event, State>>;
}

export interface Transition<Context, Event, State> {
  target: State;
  cond?: (ctx: Context, event: Event) => boolean;
  actions?: Array<Action<Context, Event>>;
}

export type Action<Context, Event> =
  | ((ctx: Context, event: Event) => Partial<Context> | void)
  | { type: string; exec: (ctx: Context, event: Event) => Partial<Context> | void };

export function defineMachine<C, E extends { type: string }, S extends string>(
  config: MachineConfig<C, E, S>,
): (input?: Partial<C>) => Machine<C, E, S> {
  /* … */
}
```

Note that **actions are described as data when possible** — using the `{ type, exec }` shape allows the machine's `toJSON()` to serialize action _names_ (not function bodies) for the visualizer.

## 4.3 Authoring a machine — example: Toggle

```ts
import { defineMachine } from '@kumiki/runtime';

export type ToggleEvent =
  | { type: 'TOGGLE' }
  | { type: 'SET'; pressed: boolean }
  | { type: 'DISABLE' }
  | { type: 'ENABLE' };

export type ToggleContext = { pressed: boolean; disabled: boolean };

const toggleMachine = defineMachine<
  ToggleContext,
  ToggleEvent,
  'pressed' | 'unpressed' | 'disabled'
>({
  id: 'toggle',
  context: { pressed: false, disabled: false },
  initial: 'unpressed',
  states: {
    unpressed: {
      on: {
        TOGGLE: {
          target: 'pressed',
          actions: [{ type: 'press', exec: (ctx) => ({ pressed: true }) }],
        },
        SET: { target: 'pressed', cond: (_, e) => e.pressed === true },
        DISABLE: 'disabled',
      },
    },
    pressed: {
      on: {
        TOGGLE: {
          target: 'unpressed',
          actions: [{ type: 'unpress', exec: () => ({ pressed: false }) }],
        },
        SET: { target: 'unpressed', cond: (_, e) => e.pressed === false },
        DISABLE: 'disabled',
      },
    },
    disabled: {
      on: { ENABLE: 'unpressed' }, // re-enable always returns to unpressed
    },
  },
});

export function createToggleMachine(input: { initial?: boolean; disabled?: boolean } = {}) {
  return toggleMachine({
    pressed: input.initial ?? false,
    disabled: input.disabled ?? false,
  });
}
```

## 4.4 Authoring a machine — example: Combobox (sketch)

A Combobox machine illustrates nested states (`loading` has `loading.idle` / `loading.fetching` substates):

```
combobox
├── closed                             // input not focused, list hidden
├── open
│   ├── filtering                      // user typing, sync filter on options
│   ├── async-loading                  // user typing, awaiting fetcher result
│   ├── empty                          // no results
│   └── populated                      // list has results
└── selected                           // value committed; user can re-open via key/click
```

Events: `INPUT.FOCUS`, `INPUT.BLUR`, `INPUT.CHANGE`, `INPUT.ESCAPE`, `INPUT.ENTER`, `OPTION.CLICK`, `OPTION.NAVIGATE`, `FETCH.RESOLVE`, `FETCH.REJECT`, `RESET`. Transitions are encoded explicitly in [components/combobox.md](../components/combobox.md).

## 4.5 Adapter: Layer 3 binds machine to Svelte runes

Layer 3 wraps a machine in a `.svelte.ts` controller class so that machine state becomes reactive in Svelte:

```ts
// @kumiki/attachment-toggle — controller (sketch)
import { createToggleMachine } from '@kumiki/machine-toggle';

export class ToggleController {
  #machine = createToggleMachine();
  state = $state(this.#machine.state);
  context = $state(this.#machine.context);

  constructor(input: ToggleInput = {}) {
    this.#machine = createToggleMachine(input);
    this.#machine.subscribe(({ state, context }) => {
      this.state = state;
      this.context = context;
    });
  }

  toggle = () => this.#machine.send({ type: 'TOGGLE' });
  set = (pressed: boolean) => this.#machine.send({ type: 'SET', pressed });

  // Attachment factory: a function the user spreads with {@attach}
  root = (node: HTMLElement) => {
    node.setAttribute('role', 'switch');
    node.setAttribute('aria-pressed', String(this.context.pressed));
    const onClick = () => this.toggle();
    node.addEventListener('click', onClick);
    return () => node.removeEventListener('click', onClick);
  };
}

export function createToggle(input?: ToggleInput) {
  return new ToggleController(input);
}
```

Two notes:

1. The controller class lives in a file named `*.svelte.ts` so the Svelte compiler preprocesses the runes.
2. Reactive synchronization between machine and runes is handled by `subscribe`. The machine doesn't know it's being observed reactively — that's the controller's job.

## 4.6 XState compatibility — visualizer export

Every machine exports `toJSON()`, returning a config object that conforms to XState v5's machine config shape. The shape is _not_ identical to our internal config — actions and guards are referenced by string names in the export.

```ts
// Pseudo-output from createToggleMachine().toJSON()
{
  id: 'toggle',
  context: { pressed: false, disabled: false },
  initial: 'unpressed',
  states: {
    unpressed: {
      on: {
        TOGGLE: { target: 'pressed', actions: ['press'] },
        SET: { target: 'pressed' },
        DISABLE: { target: 'disabled' }
      }
    },
    pressed: {
      on: {
        TOGGLE: { target: 'unpressed', actions: ['unpress'] },
        SET: { target: 'unpressed' },
        DISABLE: { target: 'disabled' }
      }
    },
    disabled: {
      on: { ENABLE: { target: 'unpressed' } }
    }
  }
}
```

Drop into [stately.ai/viz](https://stately.ai/viz) → instant statechart. We document this in [13-docs-strategy.md](13-docs-strategy.md) and link the JSON export from each component's `.md`.

**Caveat.** Guards (predicates) and inline action functions cannot be serialized; the export uses _names_ and lists guards as strings. This is sufficient for visualization — the visualizer doesn't execute, it draws.

## 4.7 Testing a machine

Pure-TS, no DOM, no Svelte:

```ts
import { describe, it, expect } from 'vitest';
import { createToggleMachine } from '@kumiki/machine-toggle';

describe('toggle machine', () => {
  it('starts unpressed by default', () => {
    const m = createToggleMachine();
    expect(m.state).toBe('unpressed');
    expect(m.context.pressed).toBe(false);
  });

  it('toggles pressed → unpressed → pressed', () => {
    const m = createToggleMachine();
    m.send({ type: 'TOGGLE' });
    expect(m.state).toBe('pressed');
    m.send({ type: 'TOGGLE' });
    expect(m.state).toBe('unpressed');
  });

  it('respects controlled SET when pressed value matches predicate', () => {
    const m = createToggleMachine({ initial: true });
    m.send({ type: 'SET', pressed: false });
    expect(m.state).toBe('unpressed');
  });

  it('disables and re-enables', () => {
    const m = createToggleMachine();
    m.send({ type: 'DISABLE' });
    expect(m.state).toBe('disabled');
    m.send({ type: 'ENABLE' });
    expect(m.state).toBe('unpressed');
  });
});
```

This is the cheap, fast first line of test defense. The browser tests in [12-testing.md](12-testing.md) cover the rest (rendering, focus, ARIA, screen-reader announcements).

## 4.8 Constraints and trade-offs

We deliberately omit features XState has:

| XState feature                | Kumiki runtime status | Why                                                                                                        |
| ----------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------- |
| Hierarchical / nested states  | ✅ supported          | Combobox needs them.                                                                                       |
| Parallel states               | ⛔️ omitted            | Not needed by any Phase 1 component.                                                                       |
| Actors / spawned children     | ⛔️ omitted            | Async work happens in user-supplied promises (`withAsyncSearch`).                                          |
| Delayed transitions / `after` | ⛔️ omitted            | Tooltip's open-delay is implemented as a setTimeout in the action; we don't need scheduler infrastructure. |
| Activities                    | ⛔️ omitted            | Same.                                                                                                      |
| Final states                  | ⛔️ omitted            | Forms have submission "done" states but they're modelled as a normal state with no outgoing transitions.   |
| Invoked services              | ⛔️ omitted            | Same as actors.                                                                                            |

If a component lands in Phase 2 or 3 that _requires_ one of these (e.g., a Form Wizard with parallel form sections), we revisit. Adopting all of XState core to avoid the conversation has a 16 KB cost we don't want to pay yet.

## 4.9 Open questions

- **TBD: how to express types for nested-state machines without explosive type signatures.** The `defineMachine` signature above takes the full state-name union as a generic; nested states multiply the union. Phase 0b (Combobox spike) will determine whether we need an alternative builder API.
- **TBD: should `subscribe` allow filtering by state?** Currently every subscriber sees every transition. Layer 3 controllers are the only consumers, and they're cheap, so we're not doing this until profiling shows it matters.
