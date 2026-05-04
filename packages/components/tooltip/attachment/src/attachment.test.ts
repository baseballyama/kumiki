// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTooltip } from './index.ts';

describe('createTooltip attachment', () => {
  let trigger: HTMLButtonElement;
  let content: HTMLDivElement;
  let teardowns: Array<() => void>;

  beforeEach(() => {
    vi.useFakeTimers();
    trigger = document.createElement('button');
    trigger.textContent = 'Help';
    document.body.appendChild(trigger);
    content = document.createElement('div');
    content.textContent = 'Hint text';
    document.body.appendChild(content);
    teardowns = [];
  });

  afterEach(() => {
    for (const t of teardowns) t();
    trigger.remove();
    content.remove();
    vi.useRealTimers();
  });

  function attachAll(t: ReturnType<typeof createTooltip>): void {
    teardowns.push(t.trigger(trigger) || (() => {}));
    teardowns.push(t.content(content) || (() => {}));
  }

  it('initializes ARIA on trigger and content', () => {
    const t = createTooltip();
    attachAll(t);
    expect(trigger.getAttribute('aria-describedby')).toBe(t.contentId);
    expect(content.getAttribute('role')).toBe('tooltip');
    expect(content.hasAttribute('hidden')).toBe(true);
  });

  it('pointerenter on trigger schedules OPEN; debounce respects openDelay', () => {
    const t = createTooltip({ openDelay: 500, closeDelay: 200 });
    attachAll(t);
    trigger.dispatchEvent(new Event('pointerenter'));
    expect(t.open).toBe(false);
    vi.advanceTimersByTime(499);
    expect(t.open).toBe(false);
    vi.advanceTimersByTime(1);
    expect(t.open).toBe(true);
    expect(content.hasAttribute('hidden')).toBe(false);
  });

  it('pointerleave before openDelay cancels the pending OPEN', () => {
    const t = createTooltip({ openDelay: 500, closeDelay: 200 });
    attachAll(t);
    trigger.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(100);
    trigger.dispatchEvent(new Event('pointerleave'));
    vi.advanceTimersByTime(1000);
    expect(t.open).toBe(false);
  });

  it('focus opens after delay; blur closes after delay', () => {
    const t = createTooltip({ openDelay: 100, closeDelay: 50 });
    attachAll(t);
    trigger.dispatchEvent(new Event('focus'));
    vi.advanceTimersByTime(100);
    expect(t.open).toBe(true);
    trigger.dispatchEvent(new Event('blur'));
    vi.advanceTimersByTime(50);
    expect(t.open).toBe(false);
  });

  it('pointerenter on content cancels pending close (hoverable content)', () => {
    const t = createTooltip({ openDelay: 0, closeDelay: 200 });
    attachAll(t);
    trigger.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(0);
    expect(t.open).toBe(true);

    // Pointer leaves trigger → schedule close in 200 ms…
    trigger.dispatchEvent(new Event('pointerleave'));
    vi.advanceTimersByTime(50);
    // …but pointer enters content first → cancel.
    content.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(500);
    expect(t.open).toBe(true);
  });

  it('pointerleave on content schedules close', () => {
    const t = createTooltip({ openDelay: 0, closeDelay: 100 });
    attachAll(t);
    trigger.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(0);
    content.dispatchEvent(new Event('pointerenter'));
    content.dispatchEvent(new Event('pointerleave'));
    vi.advanceTimersByTime(100);
    expect(t.open).toBe(false);
  });

  it('disableHoverableContent: pointer on content does NOT keep tooltip open', () => {
    const t = createTooltip({
      openDelay: 0,
      closeDelay: 100,
      disableHoverableContent: true,
    });
    attachAll(t);
    trigger.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(0);
    expect(t.open).toBe(true);
    trigger.dispatchEvent(new Event('pointerleave'));
    // Even if pointer is now on content, ignored.
    content.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(100);
    expect(t.open).toBe(false);
  });

  it('Escape closes immediately and cancels pending timers', () => {
    const t = createTooltip({ openDelay: 0, closeDelay: 500 });
    attachAll(t);
    trigger.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(0);
    expect(t.open).toBe(true);
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    expect(t.open).toBe(false);
  });

  it('show / hide / toggle bypass timers', () => {
    const t = createTooltip({ openDelay: 1000, closeDelay: 1000 });
    attachAll(t);
    t.show();
    expect(t.open).toBe(true);
    t.hide();
    expect(t.open).toBe(false);
    t.toggle();
    expect(t.open).toBe(true);
  });

  it('setOpen reflects state without timer delay', () => {
    const t = createTooltip({ openDelay: 1000 });
    attachAll(t);
    t.setOpen(true);
    expect(t.open).toBe(true);
    t.setOpen(false);
    expect(t.open).toBe(false);
  });

  it('teardown removes listeners + clears pending timer', () => {
    const t = createTooltip({ openDelay: 500 });
    attachAll(t);
    trigger.dispatchEvent(new Event('pointerenter'));
    for (const td of teardowns) td();
    teardowns = [];
    vi.advanceTimersByTime(1000);
    // Tooltip never opened because teardown cleared the timer.
    expect(t.open).toBe(false);
  });

  it('onOpenChange fires only on transitions', () => {
    const onOpenChange = vi.fn();
    const t = createTooltip({ openDelay: 0, closeDelay: 0, onOpenChange });
    attachAll(t);
    t.show();
    t.show(); // idempotent
    t.hide();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });
});
