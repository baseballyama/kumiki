/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest';
import { createCombobox } from '../index.js';
import { withMultiSelect } from './index.js';

interface Tag {
  readonly id: string;
  readonly value: string;
  readonly label: string;
}

const TAGS: Tag[] = [
  { id: 'svelte', value: 'svelte', label: 'Svelte' },
  { id: 'ts', value: 'ts', label: 'TypeScript' },
  { id: 'rust', value: 'rust', label: 'Rust' },
  { id: 'go', value: 'go', label: 'Go' },
];

function newCb() {
  return createCombobox<Tag>({ options: TAGS });
}

describe('withMultiSelect', () => {
  it('starts with an empty selection', () => {
    const cb = withMultiSelect(newCb());
    expect(cb.selected).toEqual([]);
  });

  it('honors an initial selection', () => {
    const cb = withMultiSelect(newCb(), [TAGS[0]!, TAGS[2]!]);
    expect(cb.selected.map((t) => t.id)).toEqual(['svelte', 'rust']);
  });

  it('toggle adds when absent and removes when present', () => {
    const cb = withMultiSelect(newCb());
    cb.toggle(TAGS[0]!);
    expect(cb.selected.map((t) => t.id)).toEqual(['svelte']);
    cb.toggle(TAGS[1]!);
    expect(cb.selected.map((t) => t.id)).toEqual(['svelte', 'ts']);
    cb.toggle(TAGS[0]!);
    expect(cb.selected.map((t) => t.id)).toEqual(['ts']);
  });

  it('isSelected reflects the array', () => {
    const cb = withMultiSelect(newCb(), [TAGS[1]!]);
    expect(cb.isSelected(TAGS[0]!)).toBe(false);
    expect(cb.isSelected(TAGS[1]!)).toBe(true);
  });

  it('selectAll adds every currently-filtered option', () => {
    const cb = withMultiSelect(newCb());
    cb.selectAll();
    expect(cb.selected.map((t) => t.id)).toEqual(['svelte', 'ts', 'rust', 'go']);
  });

  it('selectAll only adds new options (no duplicates)', () => {
    const cb = withMultiSelect(newCb(), [TAGS[0]!]);
    cb.selectAll();
    expect(cb.selected.map((t) => t.id)).toEqual(['svelte', 'ts', 'rust', 'go']);
  });

  it('selectAll respects the current filter', () => {
    const base = newCb();
    base.machine.send({ type: 'INPUT.CHANGE', value: 'ust' });
    const cb = withMultiSelect(base);
    cb.selectAll();
    // Filter matches "Rust" only.
    expect(cb.selected.map((t) => t.id)).toEqual(['rust']);
  });

  it('clear empties the selection', () => {
    const cb = withMultiSelect(newCb(), [TAGS[0]!, TAGS[1]!]);
    cb.clear();
    expect(cb.selected).toEqual([]);
  });

  it('user click on the base controller toggles into selected[]', () => {
    const base = newCb();
    const cb = withMultiSelect(base);
    base.open();
    base.machine.send({ type: 'OPTION.SELECT', option: TAGS[0]! });
    expect(cb.selected.map((t) => t.id)).toEqual(['svelte']);
    // Listbox should re-open after the toggle so the user can keep picking.
    expect(cb.isOpen).toBe(true);
    base.machine.send({ type: 'OPTION.SELECT', option: TAGS[1]! });
    expect(cb.selected.map((t) => t.id)).toEqual(['svelte', 'ts']);
    base.machine.send({ type: 'OPTION.SELECT', option: TAGS[0]! });
    expect(cb.selected.map((t) => t.id)).toEqual(['ts']);
  });

  it('base.value resets to null after every toggle', () => {
    const base = newCb();
    const cb = withMultiSelect(base);
    base.open();
    base.machine.send({ type: 'OPTION.SELECT', option: TAGS[0]! });
    expect(cb.value).toBeNull();
  });

  it('subscribeMultiSelect fires on every selection change', () => {
    const cb = withMultiSelect(newCb());
    const fn = vi.fn();
    const unsub = cb.subscribeMultiSelect(fn);
    cb.toggle(TAGS[0]!);
    cb.toggle(TAGS[1]!);
    cb.clear();
    expect(fn).toHaveBeenCalledTimes(3);
    expect(fn.mock.calls[0]?.[0].selected.map((t: Tag) => t.id)).toEqual(['svelte']);
    expect(fn.mock.calls[2]?.[0].selected).toEqual([]);
    unsub();
  });

  it('proxies base methods (open / close / setValue still work)', () => {
    const cb = withMultiSelect(newCb());
    cb.open();
    expect(cb.isOpen).toBe(true);
    cb.close();
    expect(cb.isOpen).toBe(false);
  });

  it('clear on empty selection is a no-op (no listener call)', () => {
    const cb = withMultiSelect(newCb());
    const fn = vi.fn();
    cb.subscribeMultiSelect(fn);
    cb.clear();
    expect(fn).not.toHaveBeenCalled();
  });

  it('toggling identifies items by id, not reference', () => {
    const cb = withMultiSelect(newCb());
    cb.toggle({ id: 'svelte', value: 'svelte', label: 'Svelte (clone)' });
    cb.toggle({ id: 'svelte', value: 'svelte', label: 'Svelte (different clone)' });
    expect(cb.selected).toEqual([]);
  });

  // ── F-01: aria-selected reflects selected[], listbox is multiselectable ──

  it('option attachment reflects aria-selected from the selected[] array', () => {
    const cb = withMultiSelect(newCb(), [TAGS[1]!]);
    const el0 = document.createElement('li');
    const el1 = document.createElement('li');
    const t0 = cb.option(TAGS[0]!)(el0);
    const t1 = cb.option(TAGS[1]!)(el1);
    expect(el0.getAttribute('aria-selected')).toBe('false');
    expect(el1.getAttribute('aria-selected')).toBe('true');
    expect(el0.getAttribute('role')).toBe('option'); // base wiring preserved
    t0?.();
    t1?.();
  });

  it('aria-selected updates live as the selection changes', () => {
    const cb = withMultiSelect(newCb());
    const el = document.createElement('li');
    const teardown = cb.option(TAGS[0]!)(el);
    expect(el.getAttribute('aria-selected')).toBe('false');
    cb.toggle(TAGS[0]!);
    expect(el.getAttribute('aria-selected')).toBe('true');
    cb.toggle(TAGS[0]!);
    expect(el.getAttribute('aria-selected')).toBe('false');
    teardown?.();
  });

  it('user commit through the base machine flips the rendered option to selected', () => {
    const base = newCb();
    const cb = withMultiSelect(base);
    const el = document.createElement('li');
    const teardown = cb.option(TAGS[0]!)(el);
    base.open();
    base.machine.send({ type: 'OPTION.SELECT', option: TAGS[0]! });
    // Base machine value was reset to null, but the wrapper keeps it selected.
    expect(cb.value).toBeNull();
    expect(el.getAttribute('aria-selected')).toBe('true');
    teardown?.();
  });

  it('listbox attachment sets aria-multiselectable="true"', () => {
    const cb = withMultiSelect(newCb());
    const el = document.createElement('ul');
    const teardown = cb.listbox(el);
    expect(el.getAttribute('aria-multiselectable')).toBe('true');
    expect(el.getAttribute('role')).toBe('listbox'); // base wiring preserved
    teardown?.();
  });

  it('destroy() unsubscribes the base value watcher', () => {
    const base = newCb();
    const cb = withMultiSelect(base);
    cb.destroy();
    base.open();
    base.machine.send({ type: 'OPTION.SELECT', option: TAGS[0]! });
    // After destroy the watcher no longer mirrors picks into selected[].
    expect(cb.selected).toEqual([]);
  });
});
