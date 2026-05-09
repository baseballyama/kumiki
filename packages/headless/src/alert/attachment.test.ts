// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAlert } from './index.ts';

describe('createAlert attachment', () => {
  let node: HTMLDivElement;
  let teardown: (() => void) | void;

  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node);
  });

  afterEach(() => {
    teardown?.();
    node.remove();
  });

  it('default severity info → role="status" + aria-live="polite"', () => {
    const a = createAlert();
    teardown = a.root(node);
    expect(node.getAttribute('role')).toBe('status');
    expect(node.getAttribute('aria-live')).toBe('polite');
    expect(node.getAttribute('aria-atomic')).toBe('true');
  });

  it('severity error → role="alert" + aria-live="assertive"', () => {
    const a = createAlert({ severity: 'error' });
    teardown = a.root(node);
    expect(node.getAttribute('role')).toBe('alert');
    expect(node.getAttribute('aria-live')).toBe('assertive');
  });

  it('severity warn → role="status" by default', () => {
    const a = createAlert({ severity: 'warn' });
    teardown = a.root(node);
    expect(node.getAttribute('role')).toBe('status');
  });

  it('explicit live="assertive" overrides severity-derived role', () => {
    const a = createAlert({ severity: 'info', live: 'assertive' });
    teardown = a.root(node);
    expect(node.getAttribute('role')).toBe('alert');
    expect(node.getAttribute('aria-live')).toBe('assertive');
  });

  it('exposes id, titleId, descriptionId derived from root id', () => {
    const a = createAlert({ id: 'myalert' });
    teardown = a.root(node);
    expect(a.id).toBe('myalert');
    expect(a.titleId).toBe('myalert-title');
    expect(a.descriptionId).toBe('myalert-desc');
    expect(node.id).toBe('myalert');
  });

  it('generates an id when none is supplied', () => {
    const a = createAlert();
    teardown = a.root(node);
    expect(node.id).toMatch(/^kumiki-alert-/);
  });

  it('Escape on focused node fires onDismiss when dismissible', () => {
    const onDismiss = vi.fn();
    const a = createAlert({ dismissible: true, onDismiss });
    teardown = a.root(node);

    node.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('Escape does nothing when not dismissible', () => {
    const onDismiss = vi.fn();
    const a = createAlert({ onDismiss });
    teardown = a.root(node);

    node.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('dismiss() fires onDismiss programmatically', () => {
    const onDismiss = vi.fn();
    const a = createAlert({ onDismiss });
    teardown = a.root(node);

    a.dismiss();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('setSeverity repaints role/aria-live', () => {
    const a = createAlert({ severity: 'info' });
    teardown = a.root(node);
    expect(node.getAttribute('role')).toBe('status');

    a.setSeverity('error');
    expect(node.getAttribute('role')).toBe('alert');
    expect(node.getAttribute('aria-live')).toBe('assertive');

    a.setSeverity('info');
    expect(node.getAttribute('role')).toBe('status');
    expect(node.getAttribute('aria-live')).toBe('polite');
  });

  it('subscribe receives initial + change snapshots', () => {
    const a = createAlert();
    teardown = a.root(node);

    const fn = vi.fn();
    const unsub = a.subscribe(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith({ severity: 'info' });

    a.setSeverity('warn');
    expect(fn).toHaveBeenLastCalledWith({ severity: 'warn' });

    unsub();
    a.setSeverity('error');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('teardown removes listener and stops repaint', () => {
    const a = createAlert();
    const td = a.root(node);
    td?.();

    a.setSeverity('error');
    // Node attribute is no longer being repainted.
    expect(node.getAttribute('role')).toBe('status');
  });
});
