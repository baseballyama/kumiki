// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDialog } from './index.ts';

describe('createDialog attachment', () => {
  let trigger: HTMLButtonElement;
  let content: HTMLDivElement;
  let title: HTMLHeadingElement;
  let close: HTMLButtonElement;
  let overlay: HTMLDivElement;
  let teardowns: Array<() => void>;
  let outside: HTMLDivElement;

  beforeEach(() => {
    trigger = document.createElement('button');
    document.body.appendChild(trigger);

    overlay = document.createElement('div');
    document.body.appendChild(overlay);

    content = document.createElement('div');
    document.body.appendChild(content);

    title = document.createElement('h2');
    title.textContent = 'Confirm';
    content.appendChild(title);

    close = document.createElement('button');
    close.textContent = 'Close';
    content.appendChild(close);

    // A separate sibling we expect to be inerted when modal=true.
    outside = document.createElement('div');
    outside.id = 'outside';
    outside.innerHTML = '<button>elsewhere</button>';
    document.body.appendChild(outside);

    teardowns = [];
  });

  afterEach(() => {
    for (const t of teardowns) t();
    [trigger, overlay, content, outside].forEach((n) => n.remove());
  });

  function attachAll(d: ReturnType<typeof createDialog>): void {
    teardowns.push(d.trigger(trigger) || (() => {}));
    teardowns.push(d.title(title) || (() => {}));
    teardowns.push(d.close(close) || (() => {}));
    teardowns.push(d.overlay(overlay) || (() => {}));
    teardowns.push(d.content(content) || (() => {}));
  }

  it('initializes ARIA on trigger and content while closed', () => {
    const d = createDialog();
    attachAll(d);
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-controls')).toBe(d.contentId);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(content.getAttribute('role')).toBe('dialog');
    expect(content.getAttribute('aria-labelledby')).toBe(d.titleId);
    expect(content.getAttribute('aria-modal')).toBe('true');
    expect(content.hasAttribute('hidden')).toBe(true);
  });

  it('a consumer-supplied aria-label suppresses the title aria-labelledby', () => {
    const d = createDialog();
    content.setAttribute('aria-label', 'Custom dialog name');
    attachAll(d);
    // aria-label is the name; pointing aria-labelledby at a possibly-absent
    // title would be wrong, so it is omitted.
    expect(content.hasAttribute('aria-labelledby')).toBe(false);
    expect(content.getAttribute('aria-label')).toBe('Custom dialog name');
  });

  it('clicking the trigger opens the dialog', () => {
    const d = createDialog();
    attachAll(d);
    trigger.click();
    expect(d.open).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(content.hasAttribute('hidden')).toBe(false);
    expect(content.getAttribute('data-state')).toBe('open');
  });

  it('opens applies inert to body siblings (modal default)', () => {
    const d = createDialog();
    attachAll(d);
    d.show();
    expect(outside.hasAttribute('inert')).toBe(true);
    d.hide();
    expect(outside.hasAttribute('inert')).toBe(false);
  });

  it('non-modal dialog does NOT apply inert to siblings', () => {
    const d = createDialog({ modal: false });
    attachAll(d);
    d.show();
    expect(outside.hasAttribute('inert')).toBe(false);
    expect(content.getAttribute('aria-modal')).toBe('false');
  });

  it('focus moves into the content on open and returns to trigger on close', () => {
    const d = createDialog();
    attachAll(d);
    trigger.focus();
    d.show();
    expect(document.activeElement).toBe(close); // first focusable in content
    d.hide();
    expect(document.activeElement).toBe(trigger);
  });

  it('non-modal dialog does not trap focus (no focus-trap activated)', () => {
    const d = createDialog({ modal: false });
    attachAll(d);
    trigger.focus();
    d.show();
    // A non-modal dialog must not trap focus, so it does not pull focus into
    // the content the way the modal focus-trap does — Tab stays free to leave.
    expect(document.activeElement).toBe(trigger);
  });

  it('Escape closes when policy permits', () => {
    const d = createDialog();
    attachAll(d);
    d.show();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    expect(d.open).toBe(false);
  });

  it('Escape is a no-op when closeOnEscape=false', () => {
    const d = createDialog({ closeOnEscape: false });
    attachAll(d);
    d.show();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    expect(d.open).toBe(true);
  });

  it('clicking the overlay (not inside content) closes', () => {
    const d = createDialog();
    attachAll(d);
    d.show();
    // Dispatch directly on overlay so event.target === overlay.
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(d.open).toBe(false);
  });

  it('outside-click via dismissable closes when policy permits', () => {
    const d = createDialog();
    attachAll(d);
    d.show();
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    expect(d.open).toBe(false);
  });

  it('outside-click is a no-op when closeOnOutsideClick=false', () => {
    const d = createDialog({ closeOnOutsideClick: false });
    attachAll(d);
    d.show();
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    expect(d.open).toBe(true);
  });

  it('clicking the trigger does not also count as outside-click', () => {
    const d = createDialog();
    attachAll(d);
    d.show();
    // Trigger is in the dismissable's ignore list — its own pointerdown
    // shouldn't cycle the dialog closed before its own click handler runs.
    trigger.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    expect(d.open).toBe(true);
  });

  it('close attachment closes the dialog on click', () => {
    const d = createDialog();
    attachAll(d);
    d.show();
    close.click();
    expect(d.open).toBe(false);
  });

  it('onOpenChange fires only on transitions', () => {
    const onOpenChange = vi.fn();
    const d = createDialog({ onOpenChange });
    attachAll(d);
    d.show();
    d.show(); // idempotent
    d.hide();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it('description wires aria-describedby on content when attached', () => {
    const d = createDialog();
    attachAll(d);
    const desc = document.createElement('p');
    content.appendChild(desc);
    teardowns.push(d.description(desc) || (() => {}));
    expect(content.getAttribute('aria-describedby')).toBe(d.descriptionId);
    expect(desc.id).toBe(d.descriptionId);
  });

  it('teardown removes listeners + restores inert', () => {
    const d = createDialog();
    attachAll(d);
    d.show();
    expect(outside.hasAttribute('inert')).toBe(true);
    for (const t of teardowns) t();
    teardowns = [];
    expect(outside.hasAttribute('inert')).toBe(false);
  });
});
