/**
 * `@kumiki/attachment-popover` — Layer 3 Svelte 5 attachments for Popover.
 *
 * Compound primitive across five factories — `trigger`, `content`,
 * `close`, `title`, `description`.
 *
 * Wiring at runtime:
 * - `content` activates a dismissable when the machine is `open`. The
 *   dismissable's `onEscape` / `onOutsideClick` dispatch ESCAPE /
 *   OUTSIDE_CLICK to the machine, which respects the policy guards.
 *   The trigger element is added to the dismissable's ignore list so
 *   the click that opens the popover does not also count as an outside
 *   click.
 * - When opening, focus moves into `content` (the first focusable
 *   descendant, or `content` itself with `tabindex=-1` if none). When
 *   closing, focus returns to the trigger.
 * - `trigger` paints `aria-expanded` and `aria-haspopup="dialog"`.
 * - Popover is **non-modal** — there is no focus trap, no overlay, no
 *   inert background. Tab moves out of the popover normally.
 */

import {
  createPopoverMachine,
  type CreatePopoverInput,
  type PopoverContext,
  type PopoverEvent,
  type PopoverMachine,
  type PopoverState,
} from '@kumiki/machine-popover';
import { createDismissable, type Dismissable } from '@kumiki/primitives/dismissable';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export interface PopoverController {
  readonly id: string;
  readonly state: PopoverState;
  readonly context: Readonly<PopoverContext>;
  readonly open: boolean;

  toggle(): void;
  show(): void;
  hide(): void;
  setOpen(open: boolean): void;
  setCloseOnEscape(value: boolean): void;
  setCloseOnOutsideClick(value: boolean): void;

  subscribe(
    listener: (snapshot: { state: PopoverState; context: PopoverContext }) => void,
  ): () => void;

  readonly triggerId: string;
  readonly contentId: string;
  readonly titleId: string;
  readonly descriptionId: string;

  readonly trigger: Attachment;
  readonly content: Attachment;
  readonly close: Attachment;
  readonly title: Attachment;
  readonly description: Attachment;

  readonly machine: PopoverMachine;
}

export interface CreatePopoverOptions extends CreatePopoverInput {
  onOpenChange?: (open: boolean) => void;
  id?: string;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function focusFirst(content: HTMLElement): void {
  const focusable = content.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
  if (focusable) {
    focusable.focus();
    return;
  }
  if (!content.hasAttribute('tabindex')) content.setAttribute('tabindex', '-1');
  content.focus();
}

export function createPopover(options: CreatePopoverOptions = {}): PopoverController {
  const machine = createPopoverMachine(options);
  const id = options.id ?? uid('popover');
  const triggerId = `${id}-trigger`;
  const contentId = `${id}-content`;
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  let prevOpen = machine.state === 'open';
  machine.subscribe(({ state }) => {
    const next = state === 'open';
    if (next !== prevOpen) {
      prevOpen = next;
      options.onOpenChange?.(next);
    }
  });

  let triggerEl: HTMLElement | null = null;

  const trigger: Attachment = (node) => {
    if (!node.id) node.id = triggerId;
    if (node.tagName === 'BUTTON' && !node.hasAttribute('type')) {
      node.setAttribute('type', 'button');
    }
    node.setAttribute('aria-haspopup', 'dialog');
    node.setAttribute('aria-controls', contentId);
    triggerEl = node;

    const paint = (): void => {
      node.setAttribute('aria-expanded', String(machine.state === 'open'));
      node.setAttribute('data-state', machine.state);
    };
    paint();

    const onClick = (): void => machine.send({ type: 'TOGGLE' });
    node.addEventListener('click', onClick);
    const unsub = machine.subscribe(paint);

    return () => {
      unsub();
      node.removeEventListener('click', onClick);
      if (triggerEl === node) triggerEl = null;
    };
  };

  const content: Attachment = (node) => {
    if (!node.id) node.id = contentId;
    node.setAttribute('role', 'dialog');
    node.setAttribute('data-component-host', 'popover');

    let dismiss: Dismissable | null = null;

    function paintAria(): void {
      node.setAttribute('data-state', machine.state);
      node.toggleAttribute('hidden', machine.state !== 'open');
    }

    function activate(): void {
      if (dismiss) return;
      dismiss = createDismissable(node, {
        ignore: triggerEl ? [() => triggerEl] : [],
        onEscape: () => machine.send({ type: 'ESCAPE' }),
        onOutsideClick: () => machine.send({ type: 'OUTSIDE_CLICK' }),
      });
      dismiss.activate();
      // Move focus into content; queueMicrotask so we run after the
      // browser paints `hidden=false`.
      queueMicrotask(() => {
        if (machine.state === 'open') focusFirst(node);
      });
    }

    function deactivate(restoreFocus: boolean): void {
      if (!dismiss) return;
      dismiss.deactivate();
      dismiss = null;
      if (restoreFocus && triggerEl) {
        // Restore focus only if focus is currently inside the popover —
        // otherwise the user has already moved on.
        const active = node.ownerDocument?.activeElement;
        if (active === node || node.contains(active)) {
          triggerEl.focus();
        }
      }
    }

    let wasOpen = machine.state === 'open';
    function react(): void {
      paintAria();
      const isOpen = machine.state === 'open';
      if (isOpen && !wasOpen) {
        activate();
      } else if (!isOpen && wasOpen) {
        deactivate(true);
      }
      wasOpen = isOpen;
    }

    react();
    const unsub = machine.subscribe(react);

    return () => {
      unsub();
      deactivate(false);
    };
  };

  const close: Attachment = (node) => {
    if (node.tagName === 'BUTTON' && !node.hasAttribute('type')) {
      node.setAttribute('type', 'button');
    }
    node.setAttribute('data-component-part', 'close');
    const onClick = (): void => machine.send({ type: 'CLOSE' });
    node.addEventListener('click', onClick);
    return () => node.removeEventListener('click', onClick);
  };

  const title: Attachment = (node) => {
    if (!node.id) node.id = titleId;
    node.setAttribute('data-component-part', 'title');
    const contentEl = node.ownerDocument?.getElementById(contentId);
    contentEl?.setAttribute('aria-labelledby', titleId);
  };

  const description: Attachment = (node) => {
    if (!node.id) node.id = descriptionId;
    node.setAttribute('data-component-part', 'description');
    const contentEl = node.ownerDocument?.getElementById(contentId);
    contentEl?.setAttribute('aria-describedby', descriptionId);
  };

  return {
    id,
    triggerId,
    contentId,
    titleId,
    descriptionId,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get open() {
      return machine.state === 'open';
    },
    toggle: () => machine.send({ type: 'TOGGLE' }),
    show: () => machine.send({ type: 'OPEN' }),
    hide: () => machine.send({ type: 'CLOSE' }),
    setOpen: (open) => machine.send({ type: 'SET.OPEN', open }),
    setCloseOnEscape: (value) => machine.send({ type: 'SET.CLOSE_ON_ESCAPE', value }),
    setCloseOnOutsideClick: (value) => machine.send({ type: 'SET.CLOSE_ON_OUTSIDE_CLICK', value }),
    subscribe: machine.subscribe.bind(machine),
    trigger,
    content,
    close,
    title,
    description,
    machine,
  };
}

export type { PopoverContext, PopoverEvent, PopoverMachine, PopoverState };
