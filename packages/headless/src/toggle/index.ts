/**
 * `@kumiki/headless/toggle` — Layer 3 Svelte 5 attachment for the Toggle machine.
 *
 * Strategy: the attachment owns the machine and synchronises ARIA attributes /
 * `data-state` directly on the DOM element. Layer 4 (`@kumiki/components/toggle`)
 * uses `{@attach}` to wire it up. We keep Layer 3 as plain TS — runes-free —
 * so the same code is usable from non-Svelte hosts (vanilla JS, tests with
 * jsdom, server-side validation) without dragging the Svelte runtime.
 *
 * @see docs/design/02-architecture.md §2.5
 */

import {
  createToggleMachine,
  type CreateToggleInput,
  type ToggleContext,
  type ToggleEvent,
  type ToggleMachine,
  type ToggleState,
} from '@kumiki/machines/toggle';
import { uid } from '@kumiki/primitives/id';

// ─── Public types ─────────────────────────────────────────────────────────

/**
 * Svelte 5 attachment function. Receives the DOM element and returns an
 * optional teardown.
 *
 * @see https://svelte.dev/docs/svelte/@attach
 */
export type Attachment = (node: HTMLElement) => void | (() => void);

export interface ToggleController {
  /** A stable unique id for this controller. */
  readonly id: string;

  // Reactive read-only state.
  readonly state: ToggleState;
  readonly context: Readonly<ToggleContext>;
  readonly pressed: boolean;
  readonly disabled: boolean;

  // Imperative API.
  toggle(): void;
  set(pressed: boolean): void;
  setDisabled(disabled: boolean): void;

  /** Subscribe to state changes. Returns an unsubscribe. */
  subscribe(
    listener: (snapshot: { state: ToggleState; context: ToggleContext }) => void,
  ): () => void;

  /** The Svelte 5 attachment to spread on the toggle's button element. */
  readonly root: Attachment;

  /** Underlying machine — exposed for advanced use, debugging, and tests. */
  readonly machine: ToggleMachine;
}

export interface CreateToggleOptions extends CreateToggleInput {
  /**
   * Called whenever the pressed value changes via user interaction (`TOGGLE`).
   * Not called for controlled `set()` updates that already came from the parent.
   */
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Stable id override. If not provided, an id is generated via
   * `@kumiki/primitives/id` (`crypto.randomUUID` or a counter fallback).
   */
  id?: string;
}

// ─── Implementation ──────────────────────────────────────────────────────

/**
 * Create a Toggle controller plus its `{@attach}`-compatible root attachment.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { createToggle } from '@kumiki/headless/toggle';
 *   const t = createToggle({ initial: false });
 * </script>
 *
 * <button {@attach t.root}>{t.pressed ? 'On' : 'Off'}</button>
 * ```
 *
 * @when-to-use Direct headless integration when Layer 4's compound API is too
 *              opinionated about the surrounding markup.
 *
 * @anti-pattern Don't reuse a single controller across multiple `<button>`s —
 *               each button should own its own controller. The state machine
 *               is per-component, not per-app.
 */
export function createToggle(options: CreateToggleOptions = {}): ToggleController {
  const machine = createToggleMachine(options);
  const id = options.id ?? uid('toggle');

  /** Apply the current snapshot to a node's ARIA + data attributes. */
  function paint(node: HTMLElement, state: ToggleState, ctx: ToggleContext): void {
    const isPressed = ctx.pressed;
    const isDisabled = state === 'disabled';

    node.setAttribute('aria-pressed', String(isPressed));
    if (isDisabled) {
      node.setAttribute('aria-disabled', 'true');
      node.setAttribute('data-disabled', '');
    } else {
      node.removeAttribute('aria-disabled');
      node.removeAttribute('data-disabled');
    }
    node.setAttribute('data-state', isPressed ? 'on' : 'off');
  }

  /**
   * Perform a user-initiated toggle and notify via `onPressedChange`. Shared by
   * the DOM event handlers and the imperative `toggle()` so every user-driven
   * path notifies consistently. A non-disabled `TOGGLE` always flips `pressed`,
   * so the new value is always a change worth reporting.
   */
  function userToggle(): void {
    if (machine.state === 'disabled') return;
    machine.send({ type: 'TOGGLE' });
    options.onPressedChange?.(machine.context.pressed);
  }

  const root: Attachment = (node) => {
    // Ensure the element looks like a toggle button to ATs.
    if (!node.hasAttribute('type') && node.tagName === 'BUTTON') {
      node.setAttribute('type', 'button');
    }
    if (node.tagName !== 'BUTTON') {
      // Non-button hosts get role="button" and must be keyboard-focusable;
      // native <button> implies both. Without tabindex the host is skipped by
      // Tab, violating APG button focus requirements.
      if (!node.hasAttribute('role')) node.setAttribute('role', 'button');
      if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '0');
    }
    if (!node.id) node.id = id;

    paint(node, machine.state, machine.context);

    const onClick = (event: MouseEvent): void => {
      if (machine.state === 'disabled') return;
      event.preventDefault();
      userToggle();
    };

    const onKeydown = (event: KeyboardEvent): void => {
      // For non-button hosts (role="button"), Space/Enter must trigger toggling.
      // <button> elements get this for free; we skip them.
      if (node.tagName === 'BUTTON') return;
      if (event.key !== ' ' && event.key !== 'Enter') return;
      if (machine.state === 'disabled') return;
      event.preventDefault();
      userToggle();
    };

    const unsubscribe = machine.subscribe(({ state, context }) => {
      paint(node, state, context);
    });

    node.addEventListener('click', onClick);
    node.addEventListener('keydown', onKeydown);

    return () => {
      unsubscribe();
      node.removeEventListener('click', onClick);
      node.removeEventListener('keydown', onKeydown);
    };
  };

  return {
    id,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get pressed() {
      return machine.context.pressed;
    },
    get disabled() {
      return machine.state === 'disabled';
    },
    toggle: userToggle,
    set: (pressed: boolean) => machine.send({ type: 'SET', pressed }),
    setDisabled: (disabled: boolean) =>
      machine.send({ type: disabled ? 'DISABLE' : 'ENABLE' } as ToggleEvent),
    subscribe: machine.subscribe.bind(machine),
    root,
    machine,
  };
}

// Re-export machine types so consumers don't have to import two packages.
export type { ToggleContext, ToggleEvent, ToggleMachine, ToggleState };
