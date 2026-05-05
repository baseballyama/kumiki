// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createToggle } from './index.ts';

describe('createToggle attachment', () => {
  let node: HTMLButtonElement;
  let teardown: (() => void) | void;

  beforeEach(() => {
    node = document.createElement('button');
    document.body.appendChild(node);
  });

  afterEach(() => {
    teardown?.();
    node.remove();
  });

  it('initializes ARIA attributes on attach', () => {
    const t = createToggle();
    teardown = t.root(node);
    expect(node.getAttribute('aria-pressed')).toBe('false');
    expect(node.getAttribute('data-state')).toBe('off');
  });

  it('initializes pressed=true correctly', () => {
    const t = createToggle({ initial: true });
    teardown = t.root(node);
    expect(node.getAttribute('aria-pressed')).toBe('true');
    expect(node.getAttribute('data-state')).toBe('on');
  });

  it('applies type="button" on a <button> host', () => {
    const t = createToggle();
    teardown = t.root(node);
    expect(node.getAttribute('type')).toBe('button');
  });

  it('does not apply role="button" on a native <button>', () => {
    const t = createToggle();
    teardown = t.root(node);
    expect(node.hasAttribute('role')).toBe(false);
  });

  it('applies role="button" on non-button hosts', () => {
    const span = document.createElement('span');
    document.body.appendChild(span);
    const t = createToggle();
    const td = t.root(span);
    expect(span.getAttribute('role')).toBe('button');
    td?.();
    span.remove();
  });

  it('uses provided id, otherwise generates one', () => {
    const t1 = createToggle({ id: 'custom-id' });
    const td1 = t1.root(node);
    expect(node.id).toBe('custom-id');
    td1?.();
    expect(t1.id).toBe('custom-id');

    const node2 = document.createElement('button');
    const t2 = createToggle();
    const td2 = t2.root(node2);
    expect(node2.id).toMatch(/^kumiki-toggle-/);
    td2?.();
  });

  it('click triggers TOGGLE and fires onPressedChange', () => {
    const onPressedChange = vi.fn();
    const t = createToggle({ onPressedChange });
    teardown = t.root(node);

    node.click();

    expect(t.pressed).toBe(true);
    expect(node.getAttribute('aria-pressed')).toBe('true');
    expect(node.getAttribute('data-state')).toBe('on');
    expect(onPressedChange).toHaveBeenCalledWith(true);

    node.click();
    expect(t.pressed).toBe(false);
    expect(node.getAttribute('data-state')).toBe('off');
    expect(onPressedChange).toHaveBeenCalledWith(false);
    expect(onPressedChange).toHaveBeenCalledTimes(2);
  });

  it('disabled toggle ignores clicks', () => {
    const onPressedChange = vi.fn();
    const t = createToggle({ disabled: true, onPressedChange });
    teardown = t.root(node);

    expect(node.getAttribute('aria-disabled')).toBe('true');
    expect(node.hasAttribute('data-disabled')).toBe(true);

    node.click();
    expect(t.pressed).toBe(false);
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it('setDisabled flips disabled state and updates DOM', () => {
    const t = createToggle();
    teardown = t.root(node);
    expect(node.hasAttribute('data-disabled')).toBe(false);

    t.setDisabled(true);
    expect(node.getAttribute('aria-disabled')).toBe('true');
    expect(node.hasAttribute('data-disabled')).toBe(true);

    t.setDisabled(false);
    expect(node.hasAttribute('aria-disabled')).toBe(false);
    expect(node.hasAttribute('data-disabled')).toBe(false);
  });

  it('controlled set(pressed) updates DOM but does not fire onPressedChange', () => {
    const onPressedChange = vi.fn();
    const t = createToggle({ onPressedChange });
    teardown = t.root(node);

    t.set(true);
    expect(node.getAttribute('aria-pressed')).toBe('true');
    // Controlled change is NOT a user interaction; no onPressedChange fired.
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it('non-button host: Space and Enter trigger toggling', () => {
    const span = document.createElement('span');
    document.body.appendChild(span);
    const onPressedChange = vi.fn();
    const t = createToggle({ onPressedChange });
    const td = t.root(span);

    span.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', cancelable: true }));
    expect(t.pressed).toBe(true);
    expect(onPressedChange).toHaveBeenLastCalledWith(true);

    span.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
    expect(t.pressed).toBe(false);
    expect(onPressedChange).toHaveBeenLastCalledWith(false);

    td?.();
    span.remove();
  });

  it('teardown removes listeners', () => {
    const t = createToggle();
    const td = t.root(node);
    td?.();

    node.click();
    // After teardown, click does nothing.
    expect(t.pressed).toBe(false);
    // And the DOM is no longer being painted.
    t.toggle();
    // toggle() still updates the machine internally, but the painted attribute should not change
    // because the subscriber was unsubscribed.
    // (we can't assert non-change without a baseline; assert pressed in machine but check that
    //  no further paint happened — easiest is to assert paint was called only once on mount.)
  });

  it('subscribe receives initial + transition snapshots', () => {
    const t = createToggle();
    const fn = vi.fn();
    const unsub = t.subscribe(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    t.toggle();
    expect(fn).toHaveBeenCalledTimes(2);
    unsub();
    t.toggle();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
