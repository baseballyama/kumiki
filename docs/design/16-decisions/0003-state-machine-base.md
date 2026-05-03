# ADR 0003 — Custom minimal FSM in `@kumiki/runtime`

**Status:** Accepted
**Date:** 2026-05

## Context

Kumiki's design hinges on encoding component behavior as a finite state machine. The choice of FSM runtime determines:

- Per-component bundle size (since the runtime is shared, but loaded with each component).
- Visualizer / introspection capability.
- Authoring ergonomics for contributors.
- Whether Layer 2 stays framework-agnostic.

Three viable runtimes:

1. **XState v5** (`xstate`) — full-featured statecharts, ~16 KB gzipped just for the core.
2. **Robot3** — minimal functional FSM, ~1.2 KB gzipped, no nested states.
3. **Custom minimal FSM** — write our own, optimized for the specific shape Kumiki needs.

Zag.js validated option 3 in production (its `@zag-js/core` is "a minimal implementation of XState FSM").

## Decision

We **build our own FSM runtime** at `@kumiki/runtime`, targeting ~1 KB gzipped, supporting:

- Hierarchical / nested states (required by Combobox).
- Entry / exit / transition actions.
- Guards (`cond`).
- Subscribe API.
- Action descriptors expressible as data (so machine config is JSON-serializable for visualizer export).

We **export a `toJSON()`** that produces an XState v5–compatible config object, consumable by [stately.ai/viz](https://stately.ai/viz). This satisfies the brief's "XState compatible visualization" requirement without paying XState's runtime cost.

## Alternatives considered

| Option                                        | Per-component runtime cost | Visualizer      | Verdict                                                                                          |
| --------------------------------------------- | -------------------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| **Custom in `@kumiki/runtime`** (chosen)      | ~1 KB shared, dedup'd      | Via JSON export | ✅                                                                                               |
| **XState v5 core**                            | ~16 KB                     | Native          | ❌ Combobox alone is 4.5 KB; XState consumes our entire 10-component budget on its own           |
| **Robot3**                                    | ~1.2 KB                    | None            | ❌ No nested states; Combobox's `loading.async` / `loading.sync` substates would have to flatten |
| **No FSM, ad-hoc reactivity** (Bits UI model) | 0                          | None            | ❌ Loses testability without DOM, loses the visualizer story, loses framework portability        |

## Consequences

**Easier:**

- Bundle budget per machine is achievable (Toggle 800 B, Combobox 3 KB inclusive of runtime amortization).
- Machines are testable in pure Vitest — no `jsdom`, no Svelte. Tests are milliseconds-fast.
- Each machine's `toJSON()` is an instant statechart in stately.ai's visualizer.
- We control the API. If we need `@kumiki/runtime` to support a Phase-3 feature (e.g., parallel states), we add it without waiting on upstream XState.

**Harder:**

- We own a small FSM library. Bug fixes are on us. Mitigation: the runtime is small (~200 lines target); thoroughly tested; reference Zag's prior art.
- Contributors familiar with XState have a small learning curve. Mitigation: docs explain the differences and provide an XState-translation table.
- Action functions (closures) cannot be serialized in `toJSON()`. We use `{ type: 'name', exec: fn }` action descriptors so the _name_ can be exported.

## Scope of `@kumiki/runtime`

Supported:

- Hierarchical states.
- Entry/exit/transition actions (described as data).
- Guards.
- Subscribe.
- JSON export.

**Deliberately omitted** (revisit in Phase 3 if needed):

- Parallel states.
- Spawned actors / child machines.
- Delayed transitions / `after`.
- Activities.
- Final states.

These omissions reflect what no Phase 1 component requires.

## References

- Zag.js core: https://github.com/chakra-ui/zag/tree/main/packages/core
- XState v5 docs: https://stately.ai/docs/xstate-v5
- Robot3 size + features: https://github.com/matthewp/robot
- Stately visualizer: https://stately.ai/viz
