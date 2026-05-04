/**
 * `@kumiki/attachment-tooltip` — Layer 3 Svelte 5 attachments for Tooltip.
 *
 * Two factories:
 * - `trigger` — listens for pointer-enter / pointer-leave / focus / blur and
 *   schedules debounced OPEN / CLOSE dispatches honoring `openDelay` and
 *   `closeDelay` from the machine. Listens for Escape on document and sends
 *   ESCAPE while open. Paints `aria-describedby` once the content has
 *   mounted (resolved by `contentId`).
 * - `content` — `role="tooltip"`, `id={contentId}`, hidden when closed.
 *   When `disableHoverableContent` is false (default), pointer-enter on the
 *   content cancels any pending close timer; pointer-leave kicks off a new
 *   close timer. This lets the user move from trigger → content without the
 *   tooltip vanishing mid-transit.
 *
 * `prefers-reduced-motion: reduce` short-circuits both delays to 0 — the
 * tooltip opens / closes immediately. (Per APG: tooltips with animation can
 * trigger vestibular discomfort; respecting the system preference is part
 * of the a11y bar.)
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 */

import {
  createTooltipMachine,
  type CreateTooltipInput,
  type TooltipContext,
  type TooltipEvent,
  type TooltipMachine,
  type TooltipState,
} from '@kumiki/machine-tooltip';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export interface TooltipController {
  readonly id: string;
  readonly state: TooltipState;
  readonly context: Readonly<TooltipContext>;
  readonly open: boolean;

  show(): void;
  hide(): void;
  toggle(): void;
  setOpen(open: boolean): void;
  setOpenDelay(ms: number): void;
  setCloseDelay(ms: number): void;
  setDisableHoverableContent(value: boolean): void;

  subscribe(
    listener: (snapshot: { state: TooltipState; context: TooltipContext }) => void,
  ): () => void;

  readonly triggerId: string;
  readonly contentId: string;

  readonly trigger: Attachment;
  readonly content: Attachment;

  readonly machine: TooltipMachine;
}

export interface CreateTooltipOptions extends CreateTooltipInput {
  onOpenChange?: (open: boolean) => void;
  id?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function createTooltip(options: CreateTooltipOptions = {}): TooltipController {
  const machine = createTooltipMachine(options);
  const id = options.id ?? uid('tooltip');
  const triggerId = `${id}-trigger`;
  const contentId = `${id}-content`;

  let prevOpen = machine.state === 'open';
  machine.subscribe(({ state }) => {
    const next = state === 'open';
    if (next !== prevOpen) {
      prevOpen = next;
      options.onOpenChange?.(next);
    }
  });

  // Single shared timer per controller — only one open/close transition can
  // be pending at a time.
  let pendingTimer: ReturnType<typeof setTimeout> | null = null;
  function clearPending(): void {
    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
  }
  function scheduleOpen(): void {
    clearPending();
    const delay = prefersReducedMotion() ? 0 : machine.context.openDelay;
    if (delay <= 0) {
      machine.send({ type: 'OPEN' });
      return;
    }
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      machine.send({ type: 'OPEN' });
    }, delay);
  }
  function scheduleClose(): void {
    clearPending();
    const delay = prefersReducedMotion() ? 0 : machine.context.closeDelay;
    if (delay <= 0) {
      machine.send({ type: 'CLOSE' });
      return;
    }
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      machine.send({ type: 'CLOSE' });
    }, delay);
  }

  // ── trigger attachment ──────────────────────────────────────────────
  const trigger: Attachment = (node) => {
    if (!node.id) node.id = triggerId;
    node.setAttribute('aria-describedby', contentId);
    node.setAttribute('data-component-host', 'tooltip');

    const paint = (): void => {
      node.setAttribute('data-state', machine.state);
    };
    paint();

    const onPointerEnter = (): void => scheduleOpen();
    const onPointerLeave = (): void => scheduleClose();
    const onFocus = (): void => scheduleOpen();
    const onBlur = (): void => scheduleClose();
    const onKeydown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && machine.state === 'open') {
        clearPending();
        machine.send({ type: 'ESCAPE' });
      }
    };

    node.addEventListener('pointerenter', onPointerEnter);
    node.addEventListener('pointerleave', onPointerLeave);
    node.addEventListener('focus', onFocus);
    node.addEventListener('blur', onBlur);
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', onKeydown);
    }
    const unsub = machine.subscribe(paint);

    return () => {
      unsub();
      clearPending();
      node.removeEventListener('pointerenter', onPointerEnter);
      node.removeEventListener('pointerleave', onPointerLeave);
      node.removeEventListener('focus', onFocus);
      node.removeEventListener('blur', onBlur);
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', onKeydown);
      }
    };
  };

  // ── content attachment ──────────────────────────────────────────────
  const content: Attachment = (node) => {
    if (!node.id) node.id = contentId;
    node.setAttribute('role', 'tooltip');

    const paint = (): void => {
      node.setAttribute('data-state', machine.state);
      node.toggleAttribute('hidden', machine.state !== 'open');
    };
    paint();

    const onPointerEnter = (): void => {
      if (machine.context.disableHoverableContent) return;
      // Pointer made it from trigger → content; cancel any pending close.
      clearPending();
    };
    const onPointerLeave = (): void => {
      if (machine.context.disableHoverableContent) return;
      scheduleClose();
    };

    node.addEventListener('pointerenter', onPointerEnter);
    node.addEventListener('pointerleave', onPointerLeave);
    const unsub = machine.subscribe(paint);

    return () => {
      unsub();
      node.removeEventListener('pointerenter', onPointerEnter);
      node.removeEventListener('pointerleave', onPointerLeave);
    };
  };

  return {
    id,
    triggerId,
    contentId,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get open() {
      return machine.state === 'open';
    },
    show: () => {
      clearPending();
      machine.send({ type: 'OPEN' });
    },
    hide: () => {
      clearPending();
      machine.send({ type: 'CLOSE' });
    },
    toggle: () => {
      clearPending();
      machine.send({ type: 'TOGGLE' });
    },
    setOpen: (open) => {
      clearPending();
      machine.send({ type: 'SET.OPEN', open });
    },
    setOpenDelay: (ms) => machine.send({ type: 'SET.OPEN_DELAY', ms }),
    setCloseDelay: (ms) => machine.send({ type: 'SET.CLOSE_DELAY', ms }),
    setDisableHoverableContent: (value) =>
      machine.send({ type: 'SET.DISABLE_HOVERABLE_CONTENT', value }),
    subscribe: machine.subscribe.bind(machine),
    trigger,
    content,
    machine,
  };
}

export type { TooltipContext, TooltipEvent, TooltipMachine, TooltipState };
