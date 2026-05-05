// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAccordion, type AccordionItem } from './index.ts';

const items: AccordionItem<string>[] = [
  { id: 'a', value: 'general', label: 'General' },
  { id: 'b', value: 'billing', label: 'Billing', disabled: true },
  { id: 'c', value: 'team', label: 'Team' },
  { id: 'd', value: 'security', label: 'Security' },
];

describe('createAccordion attachment', () => {
  let root: HTMLDivElement;
  let triggerNodes: Record<string, HTMLButtonElement>;
  let panelNodes: Record<string, HTMLDivElement>;
  let teardowns: Array<() => void>;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
    triggerNodes = {};
    panelNodes = {};
    teardowns = [];
  });

  afterEach(() => {
    for (const t of teardowns) t();
    root.remove();
    Object.values(triggerNodes).forEach((n) => n.remove());
    Object.values(panelNodes).forEach((n) => n.remove());
  });

  function attachAll(c: ReturnType<typeof createAccordion<string>>): void {
    teardowns.push(c.root(root) || (() => {}));
    for (const it of items) {
      const itemDiv = document.createElement('div');
      root.appendChild(itemDiv);
      teardowns.push(c.item(it)(itemDiv) || (() => {}));

      const trigger = document.createElement('button');
      itemDiv.appendChild(trigger);
      triggerNodes[it.id] = trigger;
      teardowns.push(c.trigger(it)(trigger) || (() => {}));

      const panel = document.createElement('div');
      itemDiv.appendChild(panel);
      panelNodes[it.id] = panel;
      teardowns.push(c.panel(it)(panel) || (() => {}));
    }
  }

  it('initializes ARIA on root, trigger, panel', () => {
    const c = createAccordion({ items });
    attachAll(c);
    expect(root.getAttribute('data-component-host')).toBe('accordion');
    expect(triggerNodes['a']!.getAttribute('aria-controls')).toBe(panelNodes['a']!.id);
    expect(triggerNodes['a']!.getAttribute('aria-expanded')).toBe('false');
    expect(triggerNodes['b']!.getAttribute('aria-disabled')).toBe('true');
    expect(panelNodes['a']!.getAttribute('role')).toBe('region');
    expect(panelNodes['a']!.getAttribute('aria-labelledby')).toBe(triggerNodes['a']!.id);
    expect(panelNodes['a']!.hasAttribute('hidden')).toBe(true);
  });

  it('clicking trigger toggles aria-expanded + panel hidden', () => {
    const c = createAccordion({ items });
    attachAll(c);
    triggerNodes['a']!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(triggerNodes['a']!.getAttribute('aria-expanded')).toBe('true');
    expect(panelNodes['a']!.hasAttribute('hidden')).toBe(false);
  });

  it('single mode: opening a different item closes the prior', () => {
    const c = createAccordion({ items });
    attachAll(c);
    triggerNodes['a']!.click();
    triggerNodes['c']!.click();
    expect(triggerNodes['a']!.getAttribute('aria-expanded')).toBe('false');
    expect(triggerNodes['c']!.getAttribute('aria-expanded')).toBe('true');
  });

  it('multiple mode: any subset can be open', () => {
    const c = createAccordion({ items, mode: 'multiple' });
    attachAll(c);
    triggerNodes['a']!.click();
    triggerNodes['c']!.click();
    expect(triggerNodes['a']!.getAttribute('aria-expanded')).toBe('true');
    expect(triggerNodes['c']!.getAttribute('aria-expanded')).toBe('true');
  });

  it('disabled trigger click is ignored', () => {
    const c = createAccordion({ items });
    attachAll(c);
    triggerNodes['b']!.click();
    expect(triggerNodes['b']!.getAttribute('aria-expanded')).toBe('false');
  });

  it('ArrowDown moves focus to next enabled trigger (skip disabled)', () => {
    const c = createAccordion({ items });
    attachAll(c);
    triggerNodes['a']!.focus();
    triggerNodes['a']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true, bubbles: true }),
    );
    expect(document.activeElement).toBe(triggerNodes['c']);
  });

  it('Home / End jump within triggers', () => {
    const c = createAccordion({ items });
    attachAll(c);
    triggerNodes['a']!.focus();
    triggerNodes['a']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', cancelable: true, bubbles: true }),
    );
    expect(document.activeElement).toBe(triggerNodes['d']);
    triggerNodes['d']!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', cancelable: true, bubbles: true }),
    );
    expect(document.activeElement).toBe(triggerNodes['a']);
  });

  it('roving tabindex: only first enabled gets tabindex=0', () => {
    const c = createAccordion({ items });
    attachAll(c);
    expect(triggerNodes['a']!.getAttribute('tabindex')).toBe('0');
    expect(triggerNodes['b']!.getAttribute('tabindex')).toBe('-1');
    expect(triggerNodes['c']!.getAttribute('tabindex')).toBe('-1');
  });

  it('onValueChange fires only when expandedIds change', () => {
    const onValueChange = vi.fn();
    const c = createAccordion({ items, onValueChange });
    attachAll(c);
    triggerNodes['a']!.click();
    triggerNodes['a']!.click(); // collapse (collapsible default)
    expect(onValueChange.mock.calls.length).toBe(2);
    expect(onValueChange.mock.calls[0]?.[0]).toEqual(['a']);
    expect(onValueChange.mock.calls[1]?.[0]).toEqual([]);
  });

  it('teardown removes listeners + subscriptions', () => {
    const c = createAccordion({ items });
    attachAll(c);
    for (const t of teardowns) t();
    teardowns = [];
    triggerNodes['a']!.click();
    expect(c.expandedIds).toEqual([]);
  });
});
