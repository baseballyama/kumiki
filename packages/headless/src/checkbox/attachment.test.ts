// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCheckbox } from './index.ts';

describe('createCheckbox attachment', () => {
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

  it('initializes role + ARIA + data attributes for unchecked', () => {
    const c = createCheckbox();
    teardown = c.root(node);
    expect(node.getAttribute('role')).toBe('checkbox');
    expect(node.getAttribute('type')).toBe('button');
    expect(node.getAttribute('aria-checked')).toBe('false');
    expect(node.getAttribute('data-state')).toBe('unchecked');
  });

  it('initial=checked → aria-checked="true"', () => {
    const c = createCheckbox({ initial: 'checked' });
    teardown = c.root(node);
    expect(node.getAttribute('aria-checked')).toBe('true');
    expect(node.getAttribute('data-state')).toBe('checked');
  });

  it('initial=mixed → aria-checked="mixed"', () => {
    const c = createCheckbox({ initial: 'mixed' });
    teardown = c.root(node);
    expect(node.getAttribute('aria-checked')).toBe('mixed');
    expect(node.getAttribute('data-state')).toBe('mixed');
  });

  it('click triggers TOGGLE and fires onCheckedChange', () => {
    const onCheckedChange = vi.fn();
    const c = createCheckbox({ onCheckedChange });
    teardown = c.root(node);

    node.click();
    expect(c.value).toBe('checked');
    expect(node.getAttribute('aria-checked')).toBe('true');
    expect(onCheckedChange).toHaveBeenCalledWith('checked');
  });

  it('click on mixed lands on checked (APG tristate)', () => {
    const onCheckedChange = vi.fn();
    const c = createCheckbox({ initial: 'mixed', onCheckedChange });
    teardown = c.root(node);

    node.click();
    expect(c.value).toBe('checked');
    expect(node.getAttribute('aria-checked')).toBe('true');
    expect(onCheckedChange).toHaveBeenCalledWith('checked');
  });

  it('disabled checkbox ignores clicks', () => {
    const onCheckedChange = vi.fn();
    const c = createCheckbox({ disabled: true, onCheckedChange });
    teardown = c.root(node);
    expect(node.getAttribute('aria-disabled')).toBe('true');
    node.click();
    expect(c.value).toBe('unchecked');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('controlled set() updates DOM but does not fire onCheckedChange', () => {
    const onCheckedChange = vi.fn();
    const c = createCheckbox({ onCheckedChange });
    teardown = c.root(node);
    c.set('mixed');
    expect(node.getAttribute('aria-checked')).toBe('mixed');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('non-button host: Space + Enter trigger toggling', () => {
    const span = document.createElement('span');
    document.body.appendChild(span);
    const c = createCheckbox();
    const td = c.root(span);

    expect(span.getAttribute('role')).toBe('checkbox');
    // A non-button host must be keyboard-focusable to receive Space/Enter.
    expect(span.getAttribute('tabindex')).toBe('0');
    span.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', cancelable: true }));
    expect(c.value).toBe('checked');
    span.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
    expect(c.value).toBe('unchecked');

    td?.();
    span.remove();
  });

  it('imperative toggle() fires onCheckedChange; no-op while disabled', () => {
    const onCheckedChange = vi.fn();
    const c = createCheckbox({ onCheckedChange });
    teardown = c.root(node);
    c.toggle();
    expect(c.value).toBe('checked');
    expect(onCheckedChange).toHaveBeenCalledWith('checked');

    const cb2 = createCheckbox({ disabled: true, onCheckedChange: vi.fn() });
    const node2 = document.createElement('button');
    const td2 = cb2.root(node2);
    cb2.toggle();
    expect(cb2.value).toBe('unchecked');
    td2?.();
  });

  it('setDisabled flips disabled state', () => {
    const c = createCheckbox();
    teardown = c.root(node);
    expect(node.hasAttribute('aria-disabled')).toBe(false);

    c.setDisabled(true);
    expect(node.getAttribute('aria-disabled')).toBe('true');
    expect(node.hasAttribute('data-disabled')).toBe(true);

    c.setDisabled(false);
    expect(node.hasAttribute('aria-disabled')).toBe(false);
  });

  it('exposes checked / indeterminate getters', () => {
    const c = createCheckbox({ initial: 'mixed' });
    teardown = c.root(node);
    expect(c.checked).toBe(false);
    expect(c.indeterminate).toBe(true);
    c.set('checked');
    expect(c.checked).toBe(true);
    expect(c.indeterminate).toBe(false);
  });

  it('teardown removes listeners', () => {
    const c = createCheckbox();
    const td = c.root(node);
    td?.();
    node.click();
    expect(c.value).toBe('unchecked');
  });

  it('subscribe receives initial + transition snapshots', () => {
    const c = createCheckbox();
    const fn = vi.fn();
    const unsub = c.subscribe(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    c.toggle();
    expect(fn).toHaveBeenCalledTimes(2);
    unsub();
    c.toggle();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
