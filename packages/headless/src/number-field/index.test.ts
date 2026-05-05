/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import { createNumberField } from './index.js';

function mount(controller: ReturnType<typeof createNumberField>) {
  const root = document.createElement('div');
  const input = document.createElement('input');
  const inc = document.createElement('button');
  const dec = document.createElement('button');
  document.body.append(root);
  root.append(dec, input, inc);
  const tearRoot = controller.root(root);
  const tearInput = controller.input(input);
  const tearInc = controller.increment_(inc);
  const tearDec = controller.decrement_(dec);
  return {
    root,
    input,
    inc,
    dec,
    teardown() {
      tearRoot?.();
      tearInput?.();
      tearInc?.();
      tearDec?.();
      root.remove();
    },
  };
}

describe('createNumberField', () => {
  it('paints role=spinbutton and ARIA bounds on input', () => {
    const c = createNumberField({ defaultValue: 5, min: 0, max: 10 });
    const ui = mount(c);
    expect(ui.input.getAttribute('role')).toBe('spinbutton');
    expect(ui.input.getAttribute('aria-valuemin')).toBe('0');
    expect(ui.input.getAttribute('aria-valuemax')).toBe('10');
    expect(ui.input.getAttribute('aria-valuenow')).toBe('5');
    ui.teardown();
  });

  it('reflects the value into the input element', () => {
    const c = createNumberField({ defaultValue: 7 });
    const ui = mount(c);
    expect(ui.input.value).toBe('7');
    ui.teardown();
  });

  it('omits aria-valuenow when value is null', () => {
    const c = createNumberField();
    const ui = mount(c);
    expect(ui.input.hasAttribute('aria-valuenow')).toBe(false);
    expect(ui.input.value).toBe('');
    ui.teardown();
  });

  it('ArrowUp increments via keyboard', () => {
    const c = createNumberField({ defaultValue: 5, min: 0, max: 10 });
    const ui = mount(c);
    ui.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(c.value).toBe(6);
    ui.teardown();
  });

  it('ArrowDown decrements via keyboard', () => {
    const c = createNumberField({ defaultValue: 5, min: 0, max: 10 });
    const ui = mount(c);
    ui.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(c.value).toBe(4);
    ui.teardown();
  });

  it('PageUp / PageDown use pageStep', () => {
    const c = createNumberField({ defaultValue: 50, min: 0, max: 100, pageStep: 10 });
    const ui = mount(c);
    ui.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp' }));
    expect(c.value).toBe(60);
    ui.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown' }));
    ui.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown' }));
    expect(c.value).toBe(40);
    ui.teardown();
  });

  it('Home / End jump to min / max when bounded', () => {
    const c = createNumberField({ defaultValue: 50, min: 0, max: 100 });
    const ui = mount(c);
    ui.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    expect(c.value).toBe(0);
    ui.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    expect(c.value).toBe(100);
    ui.teardown();
  });

  it('Home / End are no-ops when unbounded', () => {
    const c = createNumberField({ defaultValue: 5 });
    const ui = mount(c);
    ui.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    expect(c.value).toBe(5);
    ui.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    expect(c.value).toBe(5);
    ui.teardown();
  });

  it('blur commits typed value via parse', () => {
    const c = createNumberField({ min: 0, max: 100 });
    const ui = mount(c);
    ui.input.value = '42';
    ui.input.dispatchEvent(new Event('blur'));
    expect(c.value).toBe(42);
    ui.teardown();
  });

  it('blur with invalid text restores prior value', () => {
    const c = createNumberField({ defaultValue: 5, min: 0, max: 100 });
    const ui = mount(c);
    ui.input.value = 'banana';
    ui.input.dispatchEvent(new Event('blur'));
    expect(c.value).toBe(5);
    expect(ui.input.value).toBe('5');
    ui.teardown();
  });

  it('blur with empty string clears the value', () => {
    const c = createNumberField({ defaultValue: 5 });
    const ui = mount(c);
    ui.input.value = '';
    ui.input.dispatchEvent(new Event('blur'));
    expect(c.value).toBeNull();
    ui.teardown();
  });

  it('Enter commits typed value', () => {
    const c = createNumberField({ min: 0, max: 100 });
    const ui = mount(c);
    ui.input.value = '12';
    ui.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(c.value).toBe(12);
    ui.teardown();
  });

  it('increment button steps up', () => {
    const c = createNumberField({ defaultValue: 5, min: 0, max: 10 });
    const ui = mount(c);
    ui.inc.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(c.value).toBe(6);
    ui.teardown();
  });

  it('decrement button steps down', () => {
    const c = createNumberField({ defaultValue: 5, min: 0, max: 10 });
    const ui = mount(c);
    ui.dec.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(c.value).toBe(4);
    ui.teardown();
  });

  it('disables increment button at max boundary', () => {
    const c = createNumberField({ defaultValue: 10, min: 0, max: 10 });
    const ui = mount(c);
    expect((ui.inc as HTMLButtonElement).disabled).toBe(true);
    expect(ui.inc.getAttribute('aria-disabled')).toBe('true');
    expect((ui.dec as HTMLButtonElement).disabled).toBe(false);
    ui.teardown();
  });

  it('disables decrement button at min boundary', () => {
    const c = createNumberField({ defaultValue: 0, min: 0, max: 10 });
    const ui = mount(c);
    expect((ui.dec as HTMLButtonElement).disabled).toBe(true);
    expect((ui.inc as HTMLButtonElement).disabled).toBe(false);
    ui.teardown();
  });

  it('disabled state ignores keyboard and clicks', () => {
    const c = createNumberField({ defaultValue: 5, min: 0, max: 10, disabled: true });
    const ui = mount(c);
    ui.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    ui.inc.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(c.value).toBe(5);
    expect(ui.input.getAttribute('aria-disabled')).toBe('true');
    expect(ui.root.hasAttribute('data-disabled')).toBe(true);
    ui.teardown();
  });

  it('paints a pre-existing id without overwriting it', () => {
    const c = createNumberField({ defaultValue: 5, id: 'price' });
    const root = document.createElement('div');
    document.body.append(root);
    const tear = c.root(root);
    expect(root.id).toBe('price');
    tear?.();
    root.remove();
  });

  it('format option customizes display string', () => {
    const c = createNumberField({
      defaultValue: 1500,
      format: (n) => n.toLocaleString('en-US'),
    });
    const ui = mount(c);
    expect(ui.input.value).toBe('1,500');
    expect(ui.input.getAttribute('aria-valuetext')).toBe('1,500');
    ui.teardown();
  });

  it('parse option accepts custom string formats', () => {
    const c = createNumberField({
      min: 0,
      max: 10000,
      parse: (raw) => {
        const n = Number(raw.replace(/[$,\s]/g, ''));
        return Number.isFinite(n) ? n : undefined;
      },
    });
    const ui = mount(c);
    ui.input.value = '$1,234';
    ui.input.dispatchEvent(new Event('blur'));
    expect(c.value).toBe(1234);
    ui.teardown();
  });

  it('subscribe fires onValueChange', () => {
    const log: (number | null)[] = [];
    const c = createNumberField({ defaultValue: 5, onValueChange: (v) => log.push(v) });
    const ui = mount(c);
    c.increment();
    c.decrement();
    c.clear();
    expect(log).toEqual([6, 5, null]);
    ui.teardown();
  });
});
