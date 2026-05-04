// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTabs, type TabItem } from './index.ts';

const items: TabItem[] = [
  { id: 't-a', value: 'account', label: 'Account' },
  { id: 't-b', value: 'billing', label: 'Billing', disabled: true },
  { id: 't-c', value: 'team', label: 'Team' },
  { id: 't-d', value: 'security', label: 'Security' },
];

describe('createTabs attachment', () => {
  let list: HTMLDivElement;
  let tabNodes: Record<string, HTMLButtonElement>;
  let panelNodes: Record<string, HTMLDivElement>;
  let teardowns: Array<() => void>;

  beforeEach(() => {
    list = document.createElement('div');
    document.body.appendChild(list);
    tabNodes = {};
    panelNodes = {};
    teardowns = [];
  });

  afterEach(() => {
    for (const t of teardowns) t();
    list.remove();
    Object.values(tabNodes).forEach((n) => n.remove());
    Object.values(panelNodes).forEach((n) => n.remove());
  });

  function attachAll(c: ReturnType<typeof createTabs>): void {
    teardowns.push(c.list(list) || (() => {}));
    for (const it of items) {
      const tab = document.createElement('button');
      list.appendChild(tab);
      tabNodes[it.id] = tab;
      teardowns.push(c.tab(it)(tab) || (() => {}));

      const panel = document.createElement('div');
      document.body.appendChild(panel);
      panelNodes[it.id] = panel;
      teardowns.push(c.panel(it)(panel) || (() => {}));
    }
  }

  it('initializes tablist + tab + panel ARIA', () => {
    const c = createTabs({ items });
    attachAll(c);
    expect(list.getAttribute('role')).toBe('tablist');
    expect(list.getAttribute('aria-orientation')).toBe('horizontal');
    expect(tabNodes['t-a']!.getAttribute('role')).toBe('tab');
    expect(tabNodes['t-a']!.getAttribute('aria-selected')).toBe('true');
    expect(tabNodes['t-a']!.getAttribute('aria-controls')).toBe(panelNodes['t-a']!.id);
    expect(panelNodes['t-a']!.getAttribute('role')).toBe('tabpanel');
    expect(panelNodes['t-a']!.getAttribute('aria-labelledby')).toBe(tabNodes['t-a']!.id);
    expect(tabNodes['t-b']!.getAttribute('aria-disabled')).toBe('true');
  });

  it('panels: only the active is shown; others have hidden', () => {
    const c = createTabs({ items });
    attachAll(c);
    expect(panelNodes['t-a']!.hasAttribute('hidden')).toBe(false);
    expect(panelNodes['t-c']!.hasAttribute('hidden')).toBe(true);
    c.select('t-c');
    expect(panelNodes['t-a']!.hasAttribute('hidden')).toBe(true);
    expect(panelNodes['t-c']!.hasAttribute('hidden')).toBe(false);
  });

  it('roving tabindex: only the active tab gets tabindex=0', () => {
    const c = createTabs({ items });
    attachAll(c);
    expect(tabNodes['t-a']!.getAttribute('tabindex')).toBe('0');
    expect(tabNodes['t-b']!.getAttribute('tabindex')).toBe('-1');
    expect(tabNodes['t-c']!.getAttribute('tabindex')).toBe('-1');
    expect(tabNodes['t-d']!.getAttribute('tabindex')).toBe('-1');
  });

  it('click selects and fires onValueChange', () => {
    const onValueChange = vi.fn();
    const c = createTabs({ items, onValueChange });
    attachAll(c);
    tabNodes['t-c']!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(c.value).toBe('team');
    expect(tabNodes['t-c']!.getAttribute('aria-selected')).toBe('true');
    expect(onValueChange).toHaveBeenCalledWith('team');
  });

  it('click on disabled tab is a no-op', () => {
    const onValueChange = vi.fn();
    const c = createTabs({ items, onValueChange });
    attachAll(c);
    tabNodes['t-b']!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(c.value).toBe('account');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('horizontal LTR: ArrowRight = next, ArrowLeft = prev', () => {
    const c = createTabs({ items });
    attachAll(c);
    tabNodes['t-a']!.focus();
    tabNodes['t-a']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true, bubbles: true }),
    );
    expect(c.focusedId).toBe('t-c');
    expect(c.value).toBe('team');
    expect(document.activeElement).toBe(tabNodes['t-c']);

    tabNodes['t-c']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true, bubbles: true }),
    );
    expect(c.focusedId).toBe('t-a');
  });

  it('horizontal RTL: arrows are inverted', () => {
    const c = createTabs({ items, direction: 'rtl' });
    attachAll(c);
    tabNodes['t-a']!.focus();
    // RTL ArrowLeft should advance to next item.
    tabNodes['t-a']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true, bubbles: true }),
    );
    expect(c.focusedId).toBe('t-c');
  });

  it('vertical: ArrowDown = next, ArrowUp = prev; horizontal arrows ignored', () => {
    const c = createTabs({ items, orientation: 'vertical' });
    attachAll(c);
    expect(list.getAttribute('aria-orientation')).toBe('vertical');
    tabNodes['t-a']!.focus();
    tabNodes['t-a']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true, bubbles: true }),
    );
    expect(c.focusedId).toBe('t-c');

    // ArrowRight is a no-op in vertical orientation.
    tabNodes['t-c']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true, bubbles: true }),
    );
    expect(c.focusedId).toBe('t-c');
  });

  it('Home / End jump regardless of orientation', () => {
    const c = createTabs({ items });
    attachAll(c);
    tabNodes['t-a']!.focus();
    tabNodes['t-a']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', cancelable: true, bubbles: true }),
    );
    expect(c.focusedId).toBe('t-d');
    tabNodes['t-d']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', cancelable: true, bubbles: true }),
    );
    expect(c.focusedId).toBe('t-a');
  });

  it('manual activation: arrows move focus, do not change value', () => {
    const c = createTabs({ items, activation: 'manual' });
    attachAll(c);
    tabNodes['t-a']!.focus();
    tabNodes['t-a']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true, bubbles: true }),
    );
    expect(c.focusedId).toBe('t-c');
    expect(c.value).toBe('account'); // unchanged
    expect(panelNodes['t-c']!.hasAttribute('hidden')).toBe(true);

    // Enter activates the focused tab.
    tabNodes['t-c']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true }),
    );
    expect(c.value).toBe('team');
    expect(panelNodes['t-c']!.hasAttribute('hidden')).toBe(false);
  });

  it('disabled controller: clicks and arrows ignored, ARIA reflects', () => {
    const c = createTabs({ items, disabled: true });
    attachAll(c);
    expect(list.getAttribute('aria-disabled')).toBe('true');
    tabNodes['t-c']!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(c.value).toBe('account'); // value seeded but never changed
  });

  it('setOrientation / setDirection update the controller without remount', () => {
    const c = createTabs({ items });
    attachAll(c);
    c.setOrientation('vertical');
    // aria-orientation is repainted on next subscribe tick — trigger one.
    c.select('t-c');
    expect(list.getAttribute('aria-orientation')).toBe('vertical');

    c.setDirection('rtl');
    tabNodes['t-c']!.focus();
    tabNodes['t-c']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true, bubbles: true }),
    );
    // vertical mode: ArrowDown = next regardless of dir.
    expect(c.focusedId).toBe('t-d');
  });

  it('setActivation toggles activation mode at runtime', () => {
    const c = createTabs({ items });
    attachAll(c);
    c.setActivation('manual');
    expect(c.activation).toBe('manual');
    tabNodes['t-c']!.focus();
    tabNodes['t-c']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true, bubbles: true }),
    );
    // Now manual: focus moves, value does not change beyond initial seed.
    expect(c.focusedId).toBe('t-d');
    expect(c.value).toBe('account');
  });

  it('teardown removes listeners + subscriptions', () => {
    const c = createTabs({ items });
    attachAll(c);
    for (const t of teardowns) t();
    teardowns = [];
    tabNodes['t-c']!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(c.value).toBe('account');
  });
});
