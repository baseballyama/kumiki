/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createToast } from './index.js';

interface UI {
  viewport: HTMLDivElement;
  teardown: () => void;
}

function mountViewport(controller: ReturnType<typeof createToast>): UI {
  const viewport = document.createElement('div');
  document.body.append(viewport);
  const tear = controller.viewport(viewport);
  return {
    viewport,
    teardown() {
      tear?.();
      viewport.remove();
    },
  };
}

function mountItem(
  controller: ReturnType<typeof createToast>,
  parent: HTMLElement,
  toastId: string,
) {
  const el = document.createElement('div');
  parent.append(el);
  const tear = controller.item(toastId)(el);
  return { el, tear };
}

describe('createToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('viewport paints role=region + aria-live="polite" + aria-label', () => {
    const c = createToast();
    const ui = mountViewport(c);
    expect(ui.viewport.getAttribute('role')).toBe('region');
    expect(ui.viewport.getAttribute('aria-live')).toBe('polite');
    expect(ui.viewport.getAttribute('aria-label')).toBe('Notifications');
    expect(ui.viewport.id).toBe(c.viewportId);
    ui.teardown();
  });

  it('add() returns the toast id and pushes to the queue', () => {
    const c = createToast();
    const id = c.add({ title: 'Saved' });
    expect(typeof id).toBe('string');
    expect(c.toasts).toHaveLength(1);
    expect(c.toasts[0]?.id).toBe(id);
  });

  it('item attachment paints role=status / role=alert by politeness', () => {
    const c = createToast();
    const ui = mountViewport(c);
    const id1 = c.add({ title: 'Polite', politeness: 'polite' });
    const id2 = c.add({ title: 'Loud', politeness: 'assertive' });
    const a = mountItem(c, ui.viewport, id1);
    const b = mountItem(c, ui.viewport, id2);
    expect(a.el.getAttribute('role')).toBe('status');
    expect(a.el.getAttribute('aria-live')).toBe('polite');
    expect(b.el.getAttribute('role')).toBe('alert');
    expect(b.el.getAttribute('aria-live')).toBe('assertive');
    a.tear?.();
    b.tear?.();
    ui.teardown();
  });

  it('item paints data-type from the toast.type field', () => {
    const c = createToast();
    const ui = mountViewport(c);
    const id = c.add({ title: 'Failed', type: 'error' });
    const item = mountItem(c, ui.viewport, id);
    expect(item.el.getAttribute('data-type')).toBe('error');
    item.tear?.();
    ui.teardown();
  });

  it('auto-dismiss fires after duration', () => {
    const c = createToast({ defaultDuration: 1000 });
    c.add({ title: 'Saved' });
    expect(c.toasts).toHaveLength(1);
    vi.advanceTimersByTime(1100);
    expect(c.toasts).toHaveLength(0);
  });

  it('explicit duration overrides default', () => {
    const c = createToast({ defaultDuration: 1000 });
    c.add({ title: 'Long', duration: 3000 });
    vi.advanceTimersByTime(1500);
    expect(c.toasts).toHaveLength(1);
    vi.advanceTimersByTime(2000);
    expect(c.toasts).toHaveLength(0);
  });

  it('sticky toast (duration=-1) never auto-dismisses', () => {
    const c = createToast({ defaultDuration: 500 });
    c.add({ title: 'Sticky', duration: -1 });
    vi.advanceTimersByTime(60000);
    expect(c.toasts).toHaveLength(1);
  });

  it('hover pauses the timer; leave resumes it', () => {
    const c = createToast({ defaultDuration: 1000 });
    const ui = mountViewport(c);
    c.add({ title: 'Saved' });
    vi.advanceTimersByTime(400);
    ui.viewport.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(5000);
    expect(c.toasts).toHaveLength(1);
    ui.viewport.dispatchEvent(new Event('pointerleave'));
    vi.advanceTimersByTime(700);
    expect(c.toasts).toHaveLength(0);
    ui.teardown();
  });

  it('focus inside viewport pauses timers', () => {
    const c = createToast({ defaultDuration: 1000 });
    const ui = mountViewport(c);
    c.add({ title: 'Saved' });
    ui.viewport.dispatchEvent(new Event('focusin'));
    vi.advanceTimersByTime(5000);
    expect(c.toasts).toHaveLength(1);
    ui.teardown();
  });

  it('closeButton dispatches REMOVE on click', () => {
    const c = createToast();
    const id = c.add({ title: 'Saved' });
    const button = document.createElement('button');
    document.body.append(button);
    const tear = c.closeButton(id)(button);
    button.click();
    expect(c.toasts).toHaveLength(0);
    expect(button.getAttribute('aria-label')).toBe('Dismiss notification');
    tear?.();
    button.remove();
  });

  it('dismiss() removes by id', () => {
    const c = createToast();
    const a = c.add({ title: 'A' });
    const b = c.add({ title: 'B' });
    c.dismiss(a);
    expect(c.toasts.map((t) => t.id)).toEqual([b]);
  });

  it('clear() drops everything and clears timers', () => {
    const c = createToast({ defaultDuration: 1000 });
    c.add({ title: 'A' });
    c.add({ title: 'B' });
    c.clear();
    expect(c.toasts).toHaveLength(0);
    // Advancing time should not throw / re-add anything.
    vi.advanceTimersByTime(5000);
    expect(c.toasts).toHaveLength(0);
  });

  it('update() with new duration re-schedules the timer', () => {
    const c = createToast({ defaultDuration: 500 });
    const id = c.add({ title: 'Saved' });
    vi.advanceTimersByTime(200);
    c.update(id, { duration: 5000 });
    vi.advanceTimersByTime(1000);
    expect(c.toasts).toHaveLength(1);
    vi.advanceTimersByTime(4500);
    expect(c.toasts).toHaveLength(0);
  });

  it('onAdd / onRemove callbacks fire', () => {
    const added: string[] = [];
    const removed: string[] = [];
    const c = createToast({
      onAdd: (t) => added.push(t.id),
      onRemove: (id) => removed.push(id),
    });
    const id = c.add({ title: 'A' });
    c.dismiss(id);
    expect(added).toEqual([id]);
    expect(removed).toEqual([id]);
  });

  it('setMax trims the queue and cancels removed timers', () => {
    const c = createToast({ max: 3, defaultDuration: 1000 });
    c.add({ title: 'a' });
    c.add({ title: 'b' });
    c.add({ title: 'c' });
    c.setMax(1);
    expect(c.toasts).toHaveLength(1);
  });

  it('passes a pre-existing id through to the toast item', () => {
    const c = createToast();
    const id = c.add({ id: 'mine', title: 'Saved' });
    expect(id).toBe('mine');
    expect(c.toasts[0]?.id).toBe('mine');
  });
});
