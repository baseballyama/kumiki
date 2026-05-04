// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createFocusTrap } from './index.ts';

describe('createFocusTrap', () => {
  let container: HTMLDivElement;
  let trigger: HTMLButtonElement;

  beforeEach(() => {
    trigger = document.createElement('button');
    trigger.id = 'trigger';
    document.body.appendChild(trigger);

    container = document.createElement('div');
    container.id = 'modal';
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    trigger.remove();
  });

  function add(html: string): void {
    container.insertAdjacentHTML('beforeend', html);
  }

  it('focuses first focusable descendant on activate', () => {
    add(`<button id="a">A</button><input id="b" />`);
    const trap = createFocusTrap(container);
    trigger.focus();
    trap.activate();
    expect(document.activeElement?.id).toBe('a');
  });

  it('respects custom initialFocus element', () => {
    add(`<button id="a">A</button><input id="b" />`);
    const inputB = container.querySelector<HTMLInputElement>('#b')!;
    const trap = createFocusTrap(container, { initialFocus: inputB });
    trap.activate();
    expect(document.activeElement?.id).toBe('b');
  });

  it('respects initialFocus as a function', () => {
    add(`<button id="a">A</button><input id="b" />`);
    const trap = createFocusTrap(container, {
      initialFocus: () => container.querySelector<HTMLElement>('#b'),
    });
    trap.activate();
    expect(document.activeElement?.id).toBe('b');
  });

  it('no-op activate when no focusable descendant and no initialFocus', () => {
    add(`<p>just text</p>`);
    const trap = createFocusTrap(container);
    trigger.focus();
    trap.activate();
    // Focus stays where it was; consumer is expected to pass initialFocus.
    expect(document.activeElement?.id).toBe('trigger');
  });

  it('Tab from last focusable wraps to first', () => {
    add(`<button id="a">A</button><button id="b">B</button>`);
    const trap = createFocusTrap(container);
    trap.activate();
    container.querySelector<HTMLButtonElement>('#b')!.focus();
    container.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', cancelable: true, bubbles: true }),
    );
    expect(document.activeElement?.id).toBe('a');
  });

  it('Shift+Tab from first focusable wraps to last', () => {
    add(`<button id="a">A</button><button id="b">B</button>`);
    const trap = createFocusTrap(container);
    trap.activate();
    container.querySelector<HTMLButtonElement>('#a')!.focus();
    container.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true, bubbles: true }),
    );
    expect(document.activeElement?.id).toBe('b');
  });

  it('returns focus to the element that was active before activate()', () => {
    add(`<button id="a">A</button>`);
    const trap = createFocusTrap(container);
    trigger.focus();
    trap.activate();
    expect(document.activeElement?.id).toBe('a');
    trap.deactivate();
    expect(document.activeElement?.id).toBe('trigger');
  });

  it('skips return focus when returnFocus is false', () => {
    add(`<button id="a">A</button>`);
    const trap = createFocusTrap(container, { returnFocus: false });
    trigger.focus();
    trap.activate();
    container.querySelector<HTMLButtonElement>('#a')!.focus();
    trap.deactivate();
    // We don't assert what *is* focused (likely body), only that it's NOT trigger.
    expect(document.activeElement?.id).not.toBe('trigger');
  });

  it('routes return focus to a specific override element', () => {
    add(`<button id="a">A</button>`);
    const target = document.createElement('button');
    target.id = 'override';
    document.body.appendChild(target);
    const trap = createFocusTrap(container, { returnFocus: target });
    trigger.focus();
    trap.activate();
    trap.deactivate();
    expect(document.activeElement?.id).toBe('override');
    target.remove();
  });

  it('skips disabled and inert subtrees', () => {
    container.innerHTML = `
      <button id="a" disabled>A</button>
      <div inert><button id="b">B</button></div>
      <button id="c">C</button>`;
    const trap = createFocusTrap(container);
    trap.activate();
    expect(document.activeElement?.id).toBe('c');
  });

  it('idempotent activate / deactivate', () => {
    add(`<button id="a">A</button>`);
    const trap = createFocusTrap(container);
    trap.activate();
    trap.activate();
    expect(trap.active).toBe(true);
    trap.deactivate();
    trap.deactivate();
    expect(trap.active).toBe(false);
  });

  it('Tab when focus has escaped the container brings it back to first', () => {
    add(`<button id="a">A</button>`);
    const trap = createFocusTrap(container);
    trap.activate();
    trigger.focus(); // simulate focus jumping outside
    container.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', cancelable: true, bubbles: true }),
    );
    expect(document.activeElement?.id).toBe('a');
  });
});
