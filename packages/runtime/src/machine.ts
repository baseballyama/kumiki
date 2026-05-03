import type {
  Action,
  EventLike,
  Listener,
  Machine,
  MachineConfig,
  Snapshot,
  StateNode,
  Transition,
  TransitionLike,
  XStateConfig,
} from './types.ts';

/**
 * Resolve a `TransitionLike` into a normalized `Transition`.
 * A bare string target is upgraded to `{ target }`.
 */
function normalize<C, E extends EventLike, S extends string>(
  t: TransitionLike<C, E, S>,
): Transition<C, E, S> {
  return typeof t === 'string' ? { target: t } : t;
}

/**
 * Reduce a list of actions, threading partial context patches.
 * Each action's returned patch is merged into a fresh `context` object before
 * the next action runs — actions read each other's effects in order.
 */
function runActions<C, E extends EventLike>(
  context: C,
  event: E,
  actions: ReadonlyArray<Action<C, E>> | undefined,
): C {
  if (!actions || actions.length === 0) return context;
  let next: C = context;
  for (const a of actions) {
    const exec = typeof a === 'function' ? a : a.exec;
    const patch = exec(next, event);
    if (patch && typeof patch === 'object') {
      next = { ...next, ...patch };
    }
  }
  return next;
}

/** Stringify an action's identifier for JSON export. */
function actionId<C, E extends EventLike>(a: Action<C, E>): string {
  return typeof a === 'function' ? '<inline>' : a.type;
}

/**
 * Define a machine factory. The returned function constructs a fresh `Machine`
 * instance — useful for per-component instances that share a definition.
 *
 * @example
 * ```ts
 * const createToggle = defineMachine<Ctx, Evt, 'on' | 'off'>({
 *   id: 'toggle',
 *   initial: 'off',
 *   context: { pressed: false },
 *   states: {
 *     off: { on: { TOGGLE: 'on' } },
 *     on:  { on: { TOGGLE: 'off' } },
 *   },
 * });
 *
 * const machine = createToggle({ pressed: true });   // override initial context
 * machine.send({ type: 'TOGGLE' });
 * ```
 */
export function defineMachine<C, E extends EventLike, S extends string>(
  config: MachineConfig<C, E, S>,
): (initial?: { context?: Partial<C>; state?: S }) => Machine<C, E, S> {
  // Validate at construction time that every transition's `target` references
  // a known state. Catches typos before runtime. The check is gated on
  // `NODE_ENV !== 'production'` so production bundles drop the validation loop
  // entirely via dead-code elimination. We read `globalThis.process` (typed as
  // `unknown` to avoid the @types/node dependency in this Layer 2 package).
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  if (proc?.env?.['NODE_ENV'] !== 'production') {
    for (const [stateName, node] of Object.entries(config.states) as Array<
      [S, StateNode<C, E, S>]
    >) {
      const onMap = (node.on ?? {}) as Record<string, TransitionLike<C, E, S> | undefined>;
      for (const t of Object.values(onMap)) {
        if (t === undefined) continue;
        const target = typeof t === 'string' ? t : t.target;
        if (target !== undefined && !(target in config.states)) {
          throw new Error(
            `[@kumiki/runtime] Machine "${config.id}": state "${stateName}" has a transition targeting unknown state "${target}".`,
          );
        }
      }
    }
  }

  return (init?: { context?: Partial<C>; state?: S }) => {
    let state: S = init?.state ?? config.initial;
    let context: C = { ...config.context, ...(init?.context ?? {}) };
    const listeners = new Set<Listener<C, S>>();

    function emit(): void {
      const snap: Snapshot<C, S> = { state, context };
      for (const l of listeners) l(snap);
    }

    function send(event: E): void {
      const node: StateNode<C, E, S> | undefined = config.states[state];
      if (!node) return;
      const handler = node.on?.[event.type as E['type']];
      if (handler === undefined) return;

      const t = normalize<C, E, S>(handler);

      // Guard
      if (t.cond && !t.cond(context, event)) return;

      const prevState = state;
      const target = t.target;

      if (target !== undefined && target !== prevState) {
        // Transitioning: exit current → transition actions → entry next
        context = runActions(context, event, node.exit);
        context = runActions(context, event, t.actions);
        state = target;
        const nextNode: StateNode<C, E, S> | undefined = config.states[target];
        context = runActions(context, event, nextNode?.entry);
      } else {
        // Internal / self-transition without re-entering
        context = runActions(context, event, t.actions);
      }

      emit();
    }

    function subscribe(listener: Listener<C, S>): () => void {
      listeners.add(listener);
      // Fire current snapshot immediately so subscribers see initial state.
      listener({ state, context });
      return () => {
        listeners.delete(listener);
      };
    }

    function toJSON(): XStateConfig {
      const states: XStateConfig['states'] = {};
      for (const [name, node] of Object.entries(config.states) as Array<[S, StateNode<C, E, S>]>) {
        const onOut: Record<string, { target?: string; actions?: ReadonlyArray<string> }> = {};
        for (const [evType, raw] of Object.entries(node.on ?? {}) as Array<
          [string, TransitionLike<C, E, S>]
        >) {
          const t = normalize<C, E, S>(raw);
          onOut[evType] = {
            ...(t.target !== undefined ? { target: t.target } : {}),
            ...(t.actions ? { actions: t.actions.map(actionId) } : {}),
          };
        }
        states[name] = {
          ...(node.entry ? { entry: node.entry.map(actionId) } : {}),
          ...(node.exit ? { exit: node.exit.map(actionId) } : {}),
          ...(Object.keys(onOut).length ? { on: onOut } : {}),
        };
      }
      return {
        id: config.id,
        initial: config.initial,
        context,
        states,
      };
    }

    return {
      get state() {
        return state;
      },
      get context() {
        return context;
      },
      send,
      subscribe,
      toJSON,
    };
  };
}
