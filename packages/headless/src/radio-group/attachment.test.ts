// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRadioGroup, type RadioItem } from './index.ts';

const items: RadioItem<string>[] = [
  { id: 'a', value: 'apple', label: 'Apple' },
  { id: 'b', value: 'banana', label: 'Banana', disabled: true },
  { id: 'c', value: 'cherry', label: 'Cherry' },
  { id: 'd', value: 'date', label: 'Date' },
];

describe('createRadioGroup attachment', () => {
  let group: HTMLDivElement;
  let nodes: Record<string, HTMLButtonElement>;
  let teardowns: Array<() => void>;

  beforeEach(() => {
    group = document.createElement('div');
    document.body.appendChild(group);
    nodes = {};
    teardowns = [];
  });

  afterEach(() => {
    for (const t of teardowns) t();
    group.remove();
    Object.values(nodes).forEach((n) => n.remove());
  });

  function attachAll(g: ReturnType<typeof createRadioGroup<string>>) {
    teardowns.push(g.root(group) || (() => {}));
    for (const it of items) {
      const node = document.createElement('button');
      group.appendChild(node);
      nodes[it.id] = node;
      teardowns.push(g.item(it)(node) || (() => {}));
    }
  }

  it('initializes group ARIA + per-item ARIA', () => {
    const g = createRadioGroup({ items });
    attachAll(g);
    expect(group.getAttribute('role')).toBe('radiogroup');
    expect(nodes['a']!.getAttribute('role')).toBe('radio');
    expect(nodes['a']!.getAttribute('aria-checked')).toBe('false');
    expect(nodes['b']!.getAttribute('aria-disabled')).toBe('true');
  });

  it('roving tabindex: only first enabled gets tabindex=0', () => {
    const g = createRadioGroup({ items });
    attachAll(g);
    expect(nodes['a']!.getAttribute('tabindex')).toBe('0');
    expect(nodes['b']!.getAttribute('tabindex')).toBe('-1');
    expect(nodes['c']!.getAttribute('tabindex')).toBe('-1');
    expect(nodes['d']!.getAttribute('tabindex')).toBe('-1');
  });

  it('roving tabindex follows focusedId', () => {
    const g = createRadioGroup({ items });
    attachAll(g);
    g.select('c');
    expect(nodes['a']!.getAttribute('tabindex')).toBe('-1');
    expect(nodes['c']!.getAttribute('tabindex')).toBe('0');
  });

  it('roving tabindex lands on the selected item when nothing is focused', () => {
    // Programmatic setValue selects without setting focusedId — the canonical
    // "pre-selected on mount / focus has left the group" case. Tab must return
    // to the selected radio, not the first enabled one (APG).
    const g = createRadioGroup({ items });
    attachAll(g);
    g.setValue('cherry');
    expect(g.focusedId).toBe(null);
    expect(nodes['a']!.getAttribute('tabindex')).toBe('-1');
    expect(nodes['c']!.getAttribute('tabindex')).toBe('0');
  });

  it('click selects and fires onValueChange', () => {
    const onValueChange = vi.fn();
    const g = createRadioGroup({ items, onValueChange });
    attachAll(g);
    nodes['c']!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(g.value).toBe('cherry');
    expect(nodes['c']!.getAttribute('aria-checked')).toBe('true');
    expect(onValueChange).toHaveBeenCalledWith('cherry');
  });

  it('click on disabled does nothing', () => {
    const onValueChange = vi.fn();
    const g = createRadioGroup({ items, onValueChange });
    attachAll(g);
    nodes['b']!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(g.value).toBe(null);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('arrow keys navigate AND select (select-on-focus)', () => {
    const g = createRadioGroup({ items });
    attachAll(g);
    nodes['a']!.focus();
    nodes['a']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true, bubbles: true }),
    );
    // 'a' → next enabled → 'c' (skipping disabled 'b')
    expect(g.value).toBe('cherry');
    expect(g.focusedId).toBe('c');
    expect(document.activeElement).toBe(nodes['c']);
  });

  it('RTL: ArrowLeft = next, ArrowRight = prev (inversion now lives in the machine)', () => {
    const g = createRadioGroup({ items, direction: 'rtl' });
    attachAll(g);
    nodes['a']!.focus();
    nodes['a']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true, bubbles: true }),
    );
    // RTL: Left advances → next enabled → 'c' (skipping disabled 'b').
    expect(g.focusedId).toBe('c');
    expect(g.value).toBe('cherry');
    nodes['c']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true, bubbles: true }),
    );
    expect(g.focusedId).toBe('a');
  });

  it('setDirection flips the inversion at runtime', () => {
    const g = createRadioGroup({ items });
    attachAll(g);
    g.setDirection('rtl');
    nodes['a']!.focus();
    nodes['a']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true, bubbles: true }),
    );
    expect(g.focusedId).toBe('c'); // RTL → Left = next
  });

  it('Home / End jump', () => {
    const g = createRadioGroup({ items, defaultValue: 'cherry' });
    attachAll(g);
    nodes['c']!.focus();
    nodes['c']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', cancelable: true, bubbles: true }),
    );
    expect(g.focusedId).toBe('d');
    nodes['d']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', cancelable: true, bubbles: true }),
    );
    expect(g.focusedId).toBe('a');
  });

  it('Space selects the focused item', () => {
    const g = createRadioGroup({ items });
    attachAll(g);
    nodes['c']!.focus();
    nodes['c']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true }),
    );
    expect(g.value).toBe('cherry');
  });

  it('disabled group: clicks ignored, ARIA reflects', () => {
    const g = createRadioGroup({ items, disabled: true });
    attachAll(g);
    expect(group.getAttribute('aria-disabled')).toBe('true');
    nodes['a']!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(g.value).toBe(null);
  });

  it('setValue programmatically updates without changing focus', () => {
    const g = createRadioGroup({ items });
    attachAll(g);
    g.setValue('cherry');
    expect(nodes['c']!.getAttribute('aria-checked')).toBe('true');
    expect(g.focusedId).toBe(null);
  });

  it('teardown removes listeners + subscriptions', () => {
    const g = createRadioGroup({ items });
    attachAll(g);
    for (const t of teardowns) t();
    teardowns = [];
    nodes['a']!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(g.value).toBe(null);
  });
});
