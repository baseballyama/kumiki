// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSlider } from './index.ts';

describe('createSlider attachment', () => {
  let track: HTMLDivElement;
  let thumb: HTMLDivElement;
  let teardowns: Array<() => void>;

  beforeEach(() => {
    track = document.createElement('div');
    document.body.appendChild(track);
    thumb = document.createElement('div');
    track.appendChild(thumb);
    teardowns = [];
    // jsdom getBoundingClientRect default — make track 100x20 at origin.
    track.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 100,
        bottom: 20,
        width: 100,
        height: 20,
        toJSON: () => ({}),
      }) as DOMRect;
  });

  afterEach(() => {
    for (const t of teardowns) t();
    track.remove();
    thumb.remove();
  });

  function attachAll(s: ReturnType<typeof createSlider>): void {
    teardowns.push(s.root(track) || (() => {}));
    teardowns.push(s.thumb(thumb) || (() => {}));
  }

  it('initializes ARIA on thumb', () => {
    const s = createSlider({ min: 0, max: 100, defaultValue: 25 });
    attachAll(s);
    expect(thumb.getAttribute('role')).toBe('slider');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
    expect(thumb.getAttribute('aria-valuenow')).toBe('25');
    expect(thumb.getAttribute('tabindex')).toBe('0');
  });

  it('horizontal LTR: ArrowRight increments, ArrowLeft decrements', () => {
    const s = createSlider({ defaultValue: 50 });
    attachAll(s);
    thumb.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true, bubbles: true }),
    );
    expect(s.value).toBe(51);
    thumb.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true, bubbles: true }),
    );
    expect(s.value).toBe(50);
  });

  it('horizontal RTL: arrows are inverted', () => {
    const s = createSlider({ defaultValue: 50, direction: 'rtl' });
    attachAll(s);
    thumb.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true, bubbles: true }),
    );
    expect(s.value).toBe(51); // RTL: Left = next
    thumb.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true, bubbles: true }),
    );
    expect(s.value).toBe(50);
  });

  it('vertical: ArrowUp = increment, ArrowDown = decrement', () => {
    const s = createSlider({ defaultValue: 50, orientation: 'vertical' });
    attachAll(s);
    thumb.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true, bubbles: true }),
    );
    expect(s.value).toBe(51);
    thumb.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true, bubbles: true }),
    );
    expect(s.value).toBe(50);
  });

  it('PageUp / PageDown use pageStep', () => {
    const s = createSlider({ defaultValue: 50 });
    attachAll(s);
    thumb.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'PageUp', cancelable: true, bubbles: true }),
    );
    expect(s.value).toBe(60);
    thumb.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'PageDown', cancelable: true, bubbles: true }),
    );
    expect(s.value).toBe(50);
  });

  it('Home / End jump to bounds', () => {
    const s = createSlider({ defaultValue: 50 });
    attachAll(s);
    thumb.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', cancelable: true, bubbles: true }),
    );
    expect(s.value).toBe(100);
    thumb.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', cancelable: true, bubbles: true }),
    );
    expect(s.value).toBe(0);
  });

  it('pointerdown on track sets value at pointer position', () => {
    const s = createSlider();
    attachAll(s);
    // Track is 0..100px wide, slider is 0..100. Click at x=75 → value 75.
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        clientX: 75,
        clientY: 10,
        button: 0,
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(s.value).toBe(75);
  });

  it('pointer drag updates value continuously', () => {
    const s = createSlider();
    attachAll(s);
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        clientX: 25,
        clientY: 10,
        button: 0,
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(s.value).toBe(25);
    document.dispatchEvent(
      new MouseEvent('pointermove', {
        clientX: 60,
        clientY: 10,
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(s.value).toBe(60);
    document.dispatchEvent(
      new MouseEvent('pointerup', { clientX: 60, clientY: 10, bubbles: true, cancelable: true }),
    );
    // After pointerup, document listeners are removed.
    document.dispatchEvent(
      new MouseEvent('pointermove', {
        clientX: 90,
        clientY: 10,
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(s.value).toBe(60); // Stayed at 60.
  });

  it('right-click pointerdown is ignored', () => {
    const s = createSlider({ defaultValue: 50 });
    attachAll(s);
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        clientX: 25,
        clientY: 10,
        button: 2, // right
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(s.value).toBe(50);
  });

  it('disabled: keyboard + pointer ignored', () => {
    const s = createSlider({ defaultValue: 50, disabled: true });
    attachAll(s);
    expect(thumb.getAttribute('aria-disabled')).toBe('true');
    thumb.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true, bubbles: true }),
    );
    expect(s.value).toBe(50);
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        clientX: 80,
        clientY: 10,
        button: 0,
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(s.value).toBe(50);
  });

  it('onValueChange fires only on change', () => {
    const onValueChange = vi.fn();
    const s = createSlider({ defaultValue: 50, onValueChange });
    attachAll(s);
    s.setValue(60);
    s.setValue(60); // no-op
    s.setValue(40);
    expect(onValueChange.mock.calls).toEqual([[60], [40]]);
  });

  it('setDirection repaints --kumiki-slider-pct without a machine event', () => {
    const s = createSlider({ min: 0, max: 100, defaultValue: 25 });
    attachAll(s);
    // LTR: 25% fill.
    expect(track.style.getPropertyValue('--kumiki-slider-pct')).toBe('25%');
    expect(thumb.style.getPropertyValue('--kumiki-slider-pct')).toBe('25%');
    const before = s.value;
    s.setDirection('rtl');
    // RTL inverts the visual percentage to 75% — no machine event sent.
    expect(track.style.getPropertyValue('--kumiki-slider-pct')).toBe('75%');
    expect(thumb.style.getPropertyValue('--kumiki-slider-pct')).toBe('75%');
    expect(s.value).toBe(before);
  });

  it('teardown removes listeners + ends pending drag', () => {
    const s = createSlider();
    attachAll(s);
    track.dispatchEvent(
      new MouseEvent('pointerdown', {
        clientX: 30,
        clientY: 10,
        button: 0,
        bubbles: true,
        cancelable: true,
      }),
    );
    for (const t of teardowns) t();
    teardowns = [];
    document.dispatchEvent(
      new MouseEvent('pointermove', {
        clientX: 80,
        clientY: 10,
        bubbles: true,
        cancelable: true,
      }),
    );
    expect(s.value).toBe(30); // No update after teardown.
  });
});
