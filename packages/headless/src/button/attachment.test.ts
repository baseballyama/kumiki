// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createButton } from './index.ts';

describe('createButton attachment', () => {
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

  it('applies type="button" on a <button> host', () => {
    const b = createButton();
    teardown = b.root(node);
    expect(node.getAttribute('type')).toBe('button');
  });

  it('does not set aria-busy / aria-disabled when neutral', () => {
    const b = createButton();
    teardown = b.root(node);
    expect(node.hasAttribute('aria-busy')).toBe(false);
    expect(node.hasAttribute('aria-disabled')).toBe(false);
    expect(node.hasAttribute('data-loading')).toBe(false);
    expect(node.hasAttribute('data-disabled')).toBe(false);
  });

  it('sets aria-busy + data-loading while loading', () => {
    const b = createButton({ loading: true });
    teardown = b.root(node);
    expect(node.getAttribute('aria-busy')).toBe('true');
    expect(node.hasAttribute('data-loading')).toBe(true);
  });

  it('sets aria-disabled + data-disabled while disabled', () => {
    const b = createButton({ disabled: true });
    teardown = b.root(node);
    expect(node.getAttribute('aria-disabled')).toBe('true');
    expect(node.hasAttribute('data-disabled')).toBe(true);
  });

  it('uses provided id, otherwise generates one', () => {
    const b = createButton({ id: 'custom' });
    teardown = b.root(node);
    expect(node.id).toBe('custom');
    expect(b.id).toBe('custom');
  });

  it('generates an id when none is supplied', () => {
    const b = createButton();
    teardown = b.root(node);
    expect(node.id).toMatch(/^kumiki-button-/);
  });

  it('intercepts clicks while loading', () => {
    const handler = vi.fn();
    node.addEventListener('click', handler);
    const b = createButton({ loading: true });
    teardown = b.root(node);

    node.click();
    expect(handler).not.toHaveBeenCalled();
  });

  it('intercepts clicks while disabled', () => {
    const handler = vi.fn();
    node.addEventListener('click', handler);
    const b = createButton({ disabled: true });
    teardown = b.root(node);

    node.click();
    expect(handler).not.toHaveBeenCalled();
  });

  it('lets clicks through when neutral', () => {
    const handler = vi.fn();
    node.addEventListener('click', handler);
    const b = createButton();
    teardown = b.root(node);

    node.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('intercepts Space / Enter while loading', () => {
    const handler = vi.fn();
    node.addEventListener('keydown', handler);
    const b = createButton({ loading: true });
    teardown = b.root(node);

    node.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', cancelable: true }));
    node.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
    expect(handler).not.toHaveBeenCalled();
  });

  it('lets unrelated keys through while loading', () => {
    const handler = vi.fn();
    node.addEventListener('keydown', handler);
    const b = createButton({ loading: true });
    teardown = b.root(node);

    node.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('setLoading flips state and updates DOM', () => {
    const b = createButton();
    teardown = b.root(node);
    expect(node.hasAttribute('aria-busy')).toBe(false);

    b.setLoading(true);
    expect(node.getAttribute('aria-busy')).toBe('true');
    expect(node.hasAttribute('data-loading')).toBe(true);

    b.setLoading(false);
    expect(node.hasAttribute('aria-busy')).toBe(false);
    expect(node.hasAttribute('data-loading')).toBe(false);
  });

  it('setDisabled flips state and updates DOM', () => {
    const b = createButton();
    teardown = b.root(node);

    b.setDisabled(true);
    expect(node.getAttribute('aria-disabled')).toBe('true');

    b.setDisabled(false);
    expect(node.hasAttribute('aria-disabled')).toBe(false);
  });

  it('subscribe receives initial + change snapshots', () => {
    const b = createButton();
    teardown = b.root(node);

    const fn = vi.fn();
    const unsub = b.subscribe(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith({ loading: false, disabled: false });

    b.setLoading(true);
    expect(fn).toHaveBeenLastCalledWith({ loading: true, disabled: false });

    b.setDisabled(true);
    expect(fn).toHaveBeenLastCalledWith({ loading: true, disabled: true });

    unsub();
    b.setLoading(false);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('teardown removes listeners and stops repainting', () => {
    const b = createButton();
    const td = b.root(node);
    td?.();

    b.setLoading(true);
    // After teardown, the node is no longer painted.
    expect(node.hasAttribute('aria-busy')).toBe(false);
  });
});
