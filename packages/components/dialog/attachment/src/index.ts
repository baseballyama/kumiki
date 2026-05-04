/**
 * `@kumiki/attachment-dialog` — Layer 3 Svelte 5 attachments for Dialog.
 *
 * Compound primitive across **six** factories. Most consumers will use
 * `trigger`, `content`, `overlay`, `close`, plus optional `title` and
 * `description` to wire ARIA labelling.
 *
 * Wiring at runtime:
 * - `content` activates a focus-trap + dismissable when the machine state is
 *   `open`, and deactivates them when it returns to `closed`. The trap's
 *   return-focus restores the trigger; the dismissable's onEscape /
 *   onOutsideClick dispatch ESCAPE / OUTSIDE_CLICK to the machine.
 * - When `modal` is true, `content` also applies `inert` to every direct
 *   child of `<body>` that is not the content's own ancestor — so screen
 *   readers and keyboard navigation stay inside the dialog.
 * - `trigger` keeps `aria-expanded` and `aria-haspopup` painted so the
 *   "outside" of the dialog (the trigger itself) is in the ignore list of
 *   the dismissable, preventing the click that opens the dialog from
 *   immediately closing it.
 *
 * The machine handles the open/closed state and the policy guards
 * (closeOnEscape / closeOnOutsideClick); the attachment never hard-codes
 * dismissal logic.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */

import {
  createDialogMachine,
  type CreateDialogInput,
  type DialogContext,
  type DialogEvent,
  type DialogMachine,
  type DialogState,
} from '@kumiki/machine-dialog';
import { createDismissable, type Dismissable } from '@kumiki/primitives/dismissable';
import { createFocusTrap, type FocusTrap } from '@kumiki/primitives/focus-trap';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export interface DialogController {
  readonly id: string;
  readonly state: DialogState;
  readonly context: Readonly<DialogContext>;
  readonly open: boolean;

  toggle(): void;
  show(): void;
  hide(): void;
  setOpen(open: boolean): void;
  setModal(modal: boolean): void;
  setCloseOnEscape(value: boolean): void;
  setCloseOnOutsideClick(value: boolean): void;

  subscribe(
    listener: (snapshot: { state: DialogState; context: DialogContext }) => void,
  ): () => void;

  /** DOM ids for ARIA wiring. */
  readonly triggerId: string;
  readonly contentId: string;
  readonly titleId: string;
  readonly descriptionId: string;

  readonly trigger: Attachment;
  readonly content: Attachment;
  readonly overlay: Attachment;
  readonly close: Attachment;
  readonly title: Attachment;
  readonly description: Attachment;

  readonly machine: DialogMachine;
}

export interface CreateDialogOptions extends CreateDialogInput {
  onOpenChange?: (open: boolean) => void;
  id?: string;
  /**
   * If true, the title attachment is required for the content to label
   * itself. Defaults true — APG mandates an accessible name for modal
   * dialogs. The Layer 4 component enforces this at the type level.
   */
  requireTitle?: boolean;
}

/**
 * Create a Dialog controller plus its six attachment factories.
 *
 * @when-to-use Direct headless integration. Most consumers want Layer 4's
 *              compound `<Dialog.Root>` — reach for the controller when you
 *              need custom portal logic, custom open animation, or
 *              integration with a router-driven modal stack.
 *
 * @anti-pattern Do not feed one controller to multiple dialogs.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */
export function createDialog(options: CreateDialogOptions = {}): DialogController {
  const machine = createDialogMachine(options);
  const id = options.id ?? uid('dialog');
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

  // Track the trigger element so dismissable can ignore it (clicking the
  // trigger opens the dialog; that same click should not also count as an
  // outside click that closes it).
  let triggerEl: HTMLElement | null = null;

  // ── trigger ──────────────────────────────────────────────────────────
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

  // ── content ──────────────────────────────────────────────────────────
  const content: Attachment = (node) => {
    if (!node.id) node.id = contentId;
    node.setAttribute('role', 'dialog');
    node.setAttribute('data-component-host', 'dialog');
    node.setAttribute('aria-labelledby', titleId);

    let trap: FocusTrap | null = null;
    let dismiss: Dismissable | null = null;
    const inertedSiblings: HTMLElement[] = [];

    function paintAria(): void {
      node.setAttribute('aria-modal', String(machine.context.modal));
      node.setAttribute('data-state', machine.state);
      node.toggleAttribute('hidden', machine.state !== 'open');
    }

    function applyInert(on: boolean): void {
      if (!machine.context.modal) return;
      if (on) {
        const body = node.ownerDocument?.body;
        if (!body) return;
        for (const child of Array.from(body.children) as HTMLElement[]) {
          if (child === node || child.contains(node)) continue;
          if (child.hasAttribute('inert')) continue;
          child.setAttribute('inert', '');
          inertedSiblings.push(child);
        }
      } else {
        for (const el of inertedSiblings) el.removeAttribute('inert');
        inertedSiblings.length = 0;
      }
    }

    function activate(): void {
      if (trap) return;
      trap = createFocusTrap(node);
      dismiss = createDismissable(node, {
        ignore: triggerEl ? [() => triggerEl] : [],
        onEscape: () => machine.send({ type: 'ESCAPE' }),
        onOutsideClick: () => machine.send({ type: 'OUTSIDE_CLICK' }),
      });
      applyInert(true);
      trap.activate();
      dismiss.activate();
    }

    function deactivate(): void {
      if (!trap) return;
      trap.deactivate();
      dismiss?.deactivate();
      applyInert(false);
      trap = null;
      dismiss = null;
    }

    function react(): void {
      paintAria();
      if (machine.state === 'open') activate();
      else deactivate();
    }

    react();
    const unsub = machine.subscribe(react);

    return () => {
      unsub();
      deactivate();
    };
  };

  // ── overlay ──────────────────────────────────────────────────────────
  const overlay: Attachment = (node) => {
    node.setAttribute('data-component-part', 'overlay');
    const paint = (): void => {
      node.setAttribute('data-state', machine.state);
      node.toggleAttribute('hidden', machine.state !== 'open');
    };
    paint();

    const onClick = (event: MouseEvent): void => {
      if (event.target !== node) return;
      machine.send({ type: 'OUTSIDE_CLICK' });
    };
    node.addEventListener('click', onClick);
    const unsub = machine.subscribe(paint);

    return () => {
      unsub();
      node.removeEventListener('click', onClick);
    };
  };

  // ── close ────────────────────────────────────────────────────────────
  const close: Attachment = (node) => {
    if (node.tagName === 'BUTTON' && !node.hasAttribute('type')) {
      node.setAttribute('type', 'button');
    }
    node.setAttribute('data-component-part', 'close');
    const onClick = (): void => machine.send({ type: 'CLOSE' });
    node.addEventListener('click', onClick);
    return () => node.removeEventListener('click', onClick);
  };

  // ── title ────────────────────────────────────────────────────────────
  const title: Attachment = (node) => {
    if (!node.id) node.id = titleId;
    node.setAttribute('data-component-part', 'title');
  };

  // ── description ──────────────────────────────────────────────────────
  const description: Attachment = (node) => {
    if (!node.id) node.id = descriptionId;
    node.setAttribute('data-component-part', 'description');
    // Wire aria-describedby on the content; it's safe to do unconditionally —
    // if no description is rendered, the id simply won't resolve and AT
    // implementations gracefully fall back to no description.
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
    setModal: (modal) => machine.send({ type: 'SET.MODAL', modal }),
    setCloseOnEscape: (value) => machine.send({ type: 'SET.CLOSE_ON_ESCAPE', value }),
    setCloseOnOutsideClick: (value) => machine.send({ type: 'SET.CLOSE_ON_OUTSIDE_CLICK', value }),
    subscribe: machine.subscribe.bind(machine),
    trigger,
    content,
    overlay,
    close,
    title,
    description,
    machine,
  };
}

export type { DialogContext, DialogEvent, DialogMachine, DialogState };
