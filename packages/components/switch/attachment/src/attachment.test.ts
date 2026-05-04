// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSwitch } from './index.ts';

describe('createSwitch attachment', () => {
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

  it('initializes role + ARIA + data attributes', () => {
    const t = createSwitch();
    teardown = t.root(node);
    expect(node.getAttribute('role')).toBe('switch');
    expect(node.getAttribute('type')).toBe('button');
    expect(node.getAttribute('aria-checked')).toBe('false');
    expect(node.getAttribute('data-state')).toBe('off');
  });

  it('initial=true → aria-checked="true"', () => {
    const t = createSwitch({ initial: true });
    teardown = t.root(node);
    expect(node.getAttribute('aria-checked')).toBe('true');
    expect(node.getAttribute('data-state')).toBe('on');
  });

  it('click triggers and fires onCheckedChange', () => {
    const onCheckedChange = vi.fn();
    const t = createSwitch({ onCheckedChange });
    teardown = t.root(node);

    node.click();
    expect(t.checked).toBe(true);
    expect(node.getAttribute('aria-checked')).toBe('true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('disabled switch ignores clicks', () => {
    const onCheckedChange = vi.fn();
    const t = createSwitch({ disabled: true, onCheckedChange });
    teardown = t.root(node);
    expect(node.getAttribute('aria-disabled')).toBe('true');
    node.click();
    expect(t.checked).toBe(false);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('controlled set(checked) updates DOM but not onCheckedChange', () => {
    const onCheckedChange = vi.fn();
    const t = createSwitch({ onCheckedChange });
    teardown = t.root(node);
    t.set(true);
    expect(node.getAttribute('aria-checked')).toBe('true');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('non-button host: Space + Enter trigger toggling', () => {
    const span = document.createElement('span');
    document.body.appendChild(span);
    const onCheckedChange = vi.fn();
    const t = createSwitch({ onCheckedChange });
    const td = t.root(span);

    span.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', cancelable: true }));
    expect(t.checked).toBe(true);

    span.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
    expect(t.checked).toBe(false);

    td?.();
    span.remove();
  });

  it('teardown removes listeners', () => {
    const t = createSwitch();
    const td = t.root(node);
    td?.();
    node.click();
    expect(t.checked).toBe(false);
  });

  it('subscribe receives initial + transition snapshots', () => {
    const t = createSwitch();
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
