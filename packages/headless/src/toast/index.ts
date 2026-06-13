/**
 * `@kumiki/headless/toast` — Layer 3 Svelte 5 attachments for the Toast
 * (toaster queue) component.
 *
 * Three factories:
 * - `viewport` — the live-region container hosting all toasts. Hover or
 *   focus inside the viewport pauses every active timer; leave resumes
 *   them with elapsed-ms preserved.
 * - `item(toastId)` — wraps a single toast element. Sets `role` based
 *   on politeness, `data-state`, an `id` derived from the toast id,
 *   and (when not sticky) the auto-dismiss timer for that item.
 * - `closeButton(toastId)` — wires a click handler to dispatch
 *   `REMOVE` for the matching toast.
 *
 * Two convenience helpers — `add` and `dismiss` — sit on the controller
 * for ergonomic call-sites that don't want to construct events by hand.
 *
 * @see https://www.w3.org/TR/wai-aria-practices-1.2/#live
 */

import {
  createToastMachine,
  type CreateToastInput,
  type ToastContext,
  type ToastEvent,
  type ToastItem,
  type ToastMachine,
  type ToastPoliteness,
  type ToastState,
  type ToastType,
} from '@kumiki/machines/toast';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export interface ToastController {
  readonly id: string;
  readonly state: ToastState;
  readonly context: Readonly<ToastContext>;
  readonly toasts: readonly ToastItem[];

  /**
   * Push a toast. If `id` is omitted, a fresh uid is generated. Returns
   * the id used so the caller can later `dismiss`/`update` it.
   */
  add(toast: Partial<ToastItem> & { title: string }): string;
  update(id: string, patch: Partial<Omit<ToastItem, 'id'>>): void;
  dismiss(id: string): void;
  clear(): void;
  setMax(value: number): void;

  subscribe(listener: (snapshot: { state: ToastState; context: ToastContext }) => void): () => void;

  /** Stable id used as `aria-describedby` target by viewport. */
  readonly viewportId: string;

  readonly viewport: Attachment;
  readonly item: (toastId: string) => Attachment;
  readonly closeButton: (toastId: string) => Attachment;

  readonly machine: ToastMachine;
}

export interface CreateToastOptions extends CreateToastInput {
  onAdd?: (toast: ToastItem) => void;
  onRemove?: (id: string) => void;
  id?: string;
}

interface PendingTimer {
  remaining: number;
  startedAt: number;
  handle: ReturnType<typeof setTimeout> | null;
}

const now = (): number => (typeof performance !== 'undefined' ? performance.now() : Date.now());

export function createToast(options: CreateToastOptions = {}): ToastController {
  const machine = createToastMachine(options);
  const id = options.id ?? uid('toast');
  const viewportId = `${id}-viewport`;

  // Per-toast timer bookkeeping. Keyed by toast id so we can pause/resume
  // and clean up when the toast is removed.
  const timers = new Map<string, PendingTimer>();

  let viewportEl: HTMLElement | null = null;
  let paused = false;

  function isStickyDuration(d: number | undefined): boolean {
    return d === undefined ? false : d < 0 || !Number.isFinite(d);
  }

  function clearTimer(toastId: string): void {
    const t = timers.get(toastId);
    if (t?.handle != null) clearTimeout(t.handle);
    timers.delete(toastId);
  }

  function scheduleTimer(toast: ToastItem): void {
    if (isStickyDuration(toast.duration)) return;
    const ms = toast.duration ?? machine.context.defaultDuration;
    const existing = timers.get(toast.id);
    const remaining = existing?.remaining ?? ms;
    const handle = paused
      ? null
      : setTimeout(() => {
          machine.send({ type: 'REMOVE', id: toast.id });
        }, remaining);
    timers.set(toast.id, { remaining, startedAt: now(), handle });
  }

  function pauseAll(): void {
    if (paused) return;
    paused = true;
    for (const [tid, t] of timers) {
      if (t.handle == null) continue;
      clearTimeout(t.handle);
      const elapsed = now() - t.startedAt;
      timers.set(tid, {
        remaining: Math.max(0, t.remaining - elapsed),
        startedAt: now(),
        handle: null,
      });
    }
  }

  function resumeAll(): void {
    if (!paused) return;
    paused = false;
    for (const [tid, t] of timers) {
      if (t.handle != null) continue;
      const handle = setTimeout(() => {
        machine.send({ type: 'REMOVE', id: tid });
      }, t.remaining);
      timers.set(tid, { remaining: t.remaining, startedAt: now(), handle });
    }
  }

  // Track diffs between snapshots so we can fire add/remove callbacks.
  let prevToasts = machine.context.toasts;
  machine.subscribe(({ context }) => {
    const next = context.toasts;
    if (next === prevToasts) return;
    const prevIds = new Set(prevToasts.map((t) => t.id));
    const nextIds = new Set(next.map((t) => t.id));
    for (const t of next) {
      if (!prevIds.has(t.id)) {
        scheduleTimer(t);
        options.onAdd?.(t);
      }
    }
    for (const t of prevToasts) {
      if (!nextIds.has(t.id)) {
        clearTimer(t.id);
        options.onRemove?.(t.id);
      }
    }
    // Updates: same id present in both — re-schedule if duration changed.
    for (const t of next) {
      const before = prevToasts.find((p) => p.id === t.id);
      if (before && before.duration !== t.duration) {
        clearTimer(t.id);
        scheduleTimer(t);
      }
    }
    prevToasts = next;
  });

  // Schedule timers for any seeded toasts.
  for (const t of machine.context.toasts) scheduleTimer(t);

  const viewport: Attachment = (node) => {
    if (!node.id) node.id = viewportId;
    node.setAttribute('data-component-host', 'toast');
    node.setAttribute('role', 'region');
    if (!node.hasAttribute('aria-label')) node.setAttribute('aria-label', 'Notifications');
    // Default politeness for the region; per-toast `aria-live` overrides
    // when the toast is `assertive`.
    if (!node.hasAttribute('aria-live')) node.setAttribute('aria-live', 'polite');
    node.setAttribute('aria-relevant', 'additions text');
    viewportEl = node;

    const onEnter = (): void => pauseAll();
    const onLeave = (): void => resumeAll();
    node.addEventListener('pointerenter', onEnter);
    node.addEventListener('pointerleave', onLeave);
    node.addEventListener('focusin', onEnter);
    const onFocusOut = (event: FocusEvent): void => {
      const next = event.relatedTarget as Node | null;
      if (next && node.contains(next)) return;
      onLeave();
    };
    node.addEventListener('focusout', onFocusOut);

    return () => {
      node.removeEventListener('pointerenter', onEnter);
      node.removeEventListener('pointerleave', onLeave);
      node.removeEventListener('focusin', onEnter);
      node.removeEventListener('focusout', onFocusOut);
      if (viewportEl === node) viewportEl = null;
    };
  };

  const item =
    (toastId: string): Attachment =>
    (node) => {
      if (!node.id) node.id = `${id}-item-${toastId}`;
      node.setAttribute('data-component-part', 'item');
      const paint = (): void => {
        const toast = machine.context.toasts.find((t) => t.id === toastId);
        if (!toast) return;
        const politeness: ToastPoliteness = toast.politeness ?? 'polite';
        node.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
        node.setAttribute('aria-live', politeness);
        node.setAttribute('aria-atomic', 'true');
        if (toast.type) node.setAttribute('data-type', toast.type);
        node.setAttribute('data-state', 'open');
      };
      paint();
      const unsub = machine.subscribe(paint);
      return () => unsub();
    };

  const closeButton =
    (toastId: string): Attachment =>
    (node) => {
      if (node.tagName === 'BUTTON' && !node.hasAttribute('type')) {
        node.setAttribute('type', 'button');
      }
      if (!node.hasAttribute('aria-label')) node.setAttribute('aria-label', 'Dismiss notification');
      node.setAttribute('data-component-part', 'close');
      const onClick = (): void => machine.send({ type: 'REMOVE', id: toastId });
      node.addEventListener('click', onClick);
      return () => node.removeEventListener('click', onClick);
    };

  return {
    id,
    viewportId,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get toasts() {
      return machine.context.toasts;
    },
    add(input) {
      const t: ToastItem = { id: input.id ?? uid('toast-item'), ...input } as ToastItem;
      machine.send({ type: 'ADD', toast: t });
      return t.id;
    },
    update: (toastId, patch) => machine.send({ type: 'UPDATE', id: toastId, patch }),
    dismiss: (toastId) => machine.send({ type: 'REMOVE', id: toastId }),
    clear: () => machine.send({ type: 'CLEAR' }),
    setMax: (value) => machine.send({ type: 'SET.MAX', value } as ToastEvent),
    subscribe: machine.subscribe.bind(machine),
    viewport,
    item,
    closeButton,
    machine,
  };
}

export type {
  ToastContext,
  ToastEvent,
  ToastItem,
  ToastMachine,
  ToastPoliteness,
  ToastState,
  ToastType,
};
