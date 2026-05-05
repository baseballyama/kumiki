// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSelect, type SelectItem } from './index.ts';

const items: SelectItem<string>[] = [
  { id: 's-a', value: 'apple', label: 'Apple' },
  { id: 's-b', value: 'banana', label: 'Banana', disabled: true },
  { id: 's-c', value: 'cherry', label: 'Cherry' },
  { id: 's-d', value: 'date', label: 'Date' },
];

describe('createSelect attachment', () => {
  let trigger: HTMLButtonElement;
  let listbox: HTMLDivElement;
  let optNodes: Record<string, HTMLDivElement>;
  let teardowns: Array<() => void>;

  beforeEach(() => {
    vi.useFakeTimers();
    trigger = document.createElement('button');
    document.body.appendChild(trigger);
    listbox = document.createElement('div');
    document.body.appendChild(listbox);
    optNodes = {};
    teardowns = [];
  });

  afterEach(() => {
    for (const t of teardowns) t();
    trigger.remove();
    listbox.remove();
    Object.values(optNodes).forEach((n) => n.remove());
    vi.useRealTimers();
  });

  function attachAll(s: ReturnType<typeof createSelect<string>>): void {
    teardowns.push(s.trigger(trigger) || (() => {}));
    teardowns.push(s.listbox(listbox) || (() => {}));
    for (const it of items) {
      const node = document.createElement('div');
      listbox.appendChild(node);
      optNodes[it.id] = node;
      teardowns.push(s.option(it)(node) || (() => {}));
    }
  }

  it('initializes ARIA on trigger / listbox / options', () => {
    const s = createSelect({ items });
    attachAll(s);
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.getAttribute('aria-controls')).toBe(s.listboxId);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(listbox.getAttribute('role')).toBe('listbox');
    expect(listbox.hasAttribute('hidden')).toBe(true);
    expect(optNodes['s-a']!.getAttribute('role')).toBe('option');
    expect(optNodes['s-a']!.getAttribute('aria-selected')).toBe('false');
    expect(optNodes['s-b']!.getAttribute('aria-disabled')).toBe('true');
  });

  it('clicking the trigger opens the listbox + paints aria-activedescendant', () => {
    const s = createSelect({ items });
    attachAll(s);
    trigger.click();
    expect(s.open).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(listbox.hasAttribute('hidden')).toBe(false);
    expect(trigger.getAttribute('aria-activedescendant')).toBe(s.optionElementId('s-a'));
  });

  it('Enter on closed trigger opens', () => {
    const s = createSelect({ items });
    attachAll(s);
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true }),
    );
    expect(s.open).toBe(true);
  });

  it('printable chars on closed trigger open + seed typeahead', () => {
    const s = createSelect({ items });
    attachAll(s);
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'c', cancelable: true, bubbles: true }),
    );
    expect(s.open).toBe(true);
    expect(s.highlightedId).toBe('s-c');
    expect(s.context.typeahead).toBe('c');
    vi.advanceTimersByTime(500);
    expect(s.context.typeahead).toBe(''); // debounced reset
  });

  it('ArrowDown / ArrowUp navigate while open (skipping disabled)', () => {
    const s = createSelect({ items });
    attachAll(s);
    s.show();
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true, bubbles: true }),
    );
    // 's-a' → skip 's-b' (disabled) → 's-c'
    expect(s.highlightedId).toBe('s-c');
  });

  it('Enter commits highlighted and closes', () => {
    const s = createSelect({ items });
    attachAll(s);
    s.show();
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true, bubbles: true }),
    );
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true }),
    );
    expect(s.open).toBe(false);
    expect(s.value).toBe('cherry');
  });

  it('Escape closes', () => {
    const s = createSelect({ items });
    attachAll(s);
    s.show();
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true }),
    );
    expect(s.open).toBe(false);
  });

  it('Tab while open closes (focus advances naturally)', () => {
    const s = createSelect({ items });
    attachAll(s);
    s.show();
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', cancelable: true, bubbles: true }),
    );
    expect(s.open).toBe(false);
  });

  it('clicking an option commits and closes', () => {
    const onValueChange = vi.fn();
    const s = createSelect({ items, onValueChange });
    attachAll(s);
    s.show();
    optNodes['s-c']!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(s.value).toBe('cherry');
    expect(s.open).toBe(false);
    expect(onValueChange).toHaveBeenCalledWith('cherry');
  });

  it('disabled option click is ignored', () => {
    const s = createSelect({ items });
    attachAll(s);
    s.show();
    optNodes['s-b']!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(s.value).toBe(null);
    expect(s.open).toBe(true);
  });

  it('pointerenter highlights an option (mouse-style)', () => {
    const s = createSelect({ items });
    attachAll(s);
    s.show();
    optNodes['s-d']!.dispatchEvent(new Event('pointerenter'));
    expect(s.highlightedId).toBe('s-d');
  });

  it('outside-click closes via dismissable', () => {
    const outside = document.createElement('div');
    document.body.appendChild(outside);
    const s = createSelect({ items });
    attachAll(s);
    s.show();
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    expect(s.open).toBe(false);
    outside.remove();
  });

  it('typeahead debounces TYPEAHEAD.RESET while open', () => {
    const s = createSelect({ items });
    attachAll(s);
    s.show();
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'd', cancelable: true, bubbles: true }),
    );
    expect(s.highlightedId).toBe('s-d');
    vi.advanceTimersByTime(499);
    expect(s.context.typeahead).toBe('d');
    vi.advanceTimersByTime(1);
    expect(s.context.typeahead).toBe('');
  });

  it('teardown clears listeners + pending timer', () => {
    const s = createSelect({ items });
    attachAll(s);
    s.show();
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'a', cancelable: true, bubbles: true }),
    );
    for (const t of teardowns) t();
    teardowns = [];
    vi.advanceTimersByTime(1000);
    // No crashes; machine state is whatever was last sent.
    expect(s.context.typeahead).toBe('a'); // RESET was scheduled, but timer was cleared.
  });
});
