// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDismissable } from './index.ts';

describe('createDismissable', () => {
  let container: HTMLDivElement;
  let outside: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'panel';
    container.innerHTML = `<button id="inside">Inside</button>`;
    document.body.appendChild(container);

    outside = document.createElement('div');
    outside.id = 'outside';
    outside.innerHTML = `<button id="elsewhere">Elsewhere</button>`;
    document.body.appendChild(outside);
  });

  afterEach(() => {
    container.remove();
    outside.remove();
  });

  function pointerDown(target: Element): void {
    target.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
  }
  function keyDown(key: string): void {
    document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  }

  it('fires onOutsideClick when pointerdown is outside the container', () => {
    const onOutsideClick = vi.fn();
    const d = createDismissable(container, { onOutsideClick });
    d.activate();
    pointerDown(outside.querySelector('#elsewhere')!);
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('does NOT fire onOutsideClick when pointerdown is inside the container', () => {
    const onOutsideClick = vi.fn();
    const d = createDismissable(container, { onOutsideClick });
    d.activate();
    pointerDown(container.querySelector('#inside')!);
    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('respects the ignore list (element ref)', () => {
    const onOutsideClick = vi.fn();
    const d = createDismissable(container, { onOutsideClick, ignore: [outside] });
    d.activate();
    pointerDown(outside.querySelector('#elsewhere')!);
    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('respects the ignore list (thunk)', () => {
    const onOutsideClick = vi.fn();
    const d = createDismissable(container, { onOutsideClick, ignore: [() => outside] });
    d.activate();
    pointerDown(outside.querySelector('#elsewhere')!);
    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('fires onEscape on Escape key', () => {
    const onEscape = vi.fn();
    const d = createDismissable(container, { onEscape });
    d.activate();
    keyDown('Escape');
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it('ignores non-Escape keys', () => {
    const onEscape = vi.fn();
    const d = createDismissable(container, { onEscape });
    d.activate();
    keyDown('Enter');
    keyDown('a');
    keyDown('Tab');
    expect(onEscape).not.toHaveBeenCalled();
  });

  it('listeners detach on deactivate', () => {
    const onOutsideClick = vi.fn();
    const onEscape = vi.fn();
    const d = createDismissable(container, { onOutsideClick, onEscape });
    d.activate();
    d.deactivate();
    pointerDown(outside);
    keyDown('Escape');
    expect(onOutsideClick).not.toHaveBeenCalled();
    expect(onEscape).not.toHaveBeenCalled();
  });

  it('idempotent activate / deactivate', () => {
    const onOutsideClick = vi.fn();
    const d = createDismissable(container, { onOutsideClick });
    d.activate();
    d.activate();
    expect(d.active).toBe(true);
    pointerDown(outside);
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
    d.deactivate();
    d.deactivate();
    expect(d.active).toBe(false);
  });

  it('unresolved ignore thunks (returning null) do not crash', () => {
    const onOutsideClick = vi.fn();
    const d = createDismissable(container, { onOutsideClick, ignore: [() => null] });
    d.activate();
    pointerDown(outside);
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('events with non-Node targets do not crash', () => {
    const onOutsideClick = vi.fn();
    const d = createDismissable(container, { onOutsideClick });
    d.activate();
    // Synthetic event with no DOM target.
    document.dispatchEvent(new Event('pointerdown'));
    expect(onOutsideClick).toHaveBeenCalled();
  });
});
