/**
 * `@kumiki/runtime` — minimal finite state machine runtime for Kumiki.
 *
 * Pure TypeScript, framework-agnostic. ~1 KB gzipped target. See
 * `docs/design/04-state-machines.md` and `docs/design/16-decisions/0003-state-machine-base.md`.
 */

export { defineMachine } from './machine.ts';
export type {
  Action,
  EventLike,
  Guard,
  Listener,
  Machine,
  MachineConfig,
  Snapshot,
  StateNode,
  Transition,
  TransitionLike,
  XStateConfig,
} from './types.ts';
