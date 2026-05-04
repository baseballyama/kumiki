/**
 * Public types for `@kumiki/runtime`.
 * Kept in a separate file so `@kumiki/types` can re-export the relevant subset
 * without dragging the runtime implementation.
 */

/** A union-typed event. Always carries a string `type` discriminator. */
export interface EventLike {
  readonly type: string;
}

/** A guard predicate evaluated against `(context, event)`. */
export type Guard<C, E extends EventLike> = (context: C, event: E) => boolean;

/**
 * An action descriptor.
 *
 * - **Object form** (`{ type, exec }`) — preferred for serialization. Only the
 *   string `type` is exported to JSON, so the visualizer can render the action
 *   by name even though `exec` is a closure.
 * - **Function form** — convenient for one-off internal actions. Exported to
 *   JSON as the literal string `"<inline>"`.
 *
 * Actions return a partial context patch (or void) — the runtime merges patches
 * into the next context.
 */
export type Action<C, E extends EventLike> =
  | { readonly type: string; exec: (context: C, event: E) => Partial<C> | void }
  | ((context: C, event: E) => Partial<C> | void);

/** A transition from one state to another, optionally guarded and with actions. */
export interface Transition<C, E extends EventLike, S extends string> {
  readonly target?: S;
  readonly cond?: Guard<C, E>;
  readonly actions?: ReadonlyArray<Action<C, E>>;
  /**
   * If true and `target` is omitted, the transition is *internal*: it executes
   * `actions` without changing state. If false / unset, omitting `target` is
   * the same as targeting the current state (no exit/entry actions fire).
   */
  readonly internal?: boolean;
}

/**
 * Shorthand: a bare target string is equivalent to `{ target }`. An array means
 * "first guard that passes wins" (XState convention) — useful when one event
 * dispatches to different targets based on payload.
 */
export type TransitionLike<C, E extends EventLike, S extends string> =
  | S
  | Transition<C, E, S>
  | ReadonlyArray<S | Transition<C, E, S>>;

/** A state node — entry/exit actions plus an event handler map. */
export interface StateNode<C, E extends EventLike, S extends string> {
  readonly entry?: ReadonlyArray<Action<C, E>>;
  readonly exit?: ReadonlyArray<Action<C, E>>;
  readonly on?: { readonly [K in E['type']]?: TransitionLike<C, E, S> };
}

/** Top-level machine config. */
export interface MachineConfig<C, E extends EventLike, S extends string> {
  readonly id: string;
  readonly initial: S;
  readonly context: C;
  readonly states: { readonly [K in S]: StateNode<C, E, S> };
}

/** A snapshot of the machine. */
export interface Snapshot<C, S extends string> {
  readonly state: S;
  readonly context: C;
}

/** Listener invoked on every transition (including no-ops). */
export type Listener<C, S extends string> = (snapshot: Snapshot<C, S>) => void;

/** XState v5–compatible JSON config produced by `Machine.toJSON()`. */
export interface XStateConfig {
  readonly id: string;
  readonly initial: string;
  readonly context: unknown;
  readonly states: Record<
    string,
    {
      readonly entry?: ReadonlyArray<string>;
      readonly exit?: ReadonlyArray<string>;
      readonly on?: Record<
        string,
        { readonly target?: string; readonly actions?: ReadonlyArray<string> }
      >;
    }
  >;
}

/** The running machine. */
export interface Machine<C, E extends EventLike, S extends string> {
  /** Current state name. */
  readonly state: S;
  /** Current context. */
  readonly context: C;
  /** Send an event. Synchronous: actions run, listeners fire before return. */
  send(event: E): void;
  /** Subscribe to snapshots. Returns an unsubscribe function. */
  subscribe(listener: Listener<C, S>): () => void;
  /** Export an XState v5–compatible JSON config (for stately.ai/viz). */
  toJSON(): XStateConfig;
}
