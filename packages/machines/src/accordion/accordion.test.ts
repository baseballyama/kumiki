import { describe, it, expect } from 'vitest';
import { createAccordionMachine, type AccordionItem } from './index.ts';

const items: AccordionItem<string>[] = [
  { id: 'a', value: 'general', label: 'General' },
  { id: 'b', value: 'billing', label: 'Billing', disabled: true },
  { id: 'c', value: 'team', label: 'Team' },
  { id: 'd', value: 'security', label: 'Security' },
];

describe('accordion machine', () => {
  describe('initial state', () => {
    it('defaults to single mode, none expanded', () => {
      const m = createAccordionMachine({ items });
      expect(m.state).toBe('idle');
      expect(m.context.expandedIds).toEqual([]);
      expect(m.context.mode).toBe('single');
      expect(m.context.collapsible).toBe(true);
    });

    it('honors defaultValue (single)', () => {
      const m = createAccordionMachine({ items, defaultValue: 'team' });
      expect(m.context.expandedIds).toEqual(['c']);
    });

    it('honors defaultValue (multiple)', () => {
      const m = createAccordionMachine({
        items,
        mode: 'multiple',
        defaultValue: ['general', 'team'],
      });
      expect(m.context.expandedIds).toEqual(['a', 'c']);
    });
  });

  describe('TOGGLE — single mode', () => {
    it('opens an item; subsequent toggle on a different item closes the prior', () => {
      const m = createAccordionMachine({ items });
      m.send({ type: 'TOGGLE', id: 'a' });
      expect(m.context.expandedIds).toEqual(['a']);
      m.send({ type: 'TOGGLE', id: 'c' });
      expect(m.context.expandedIds).toEqual(['c']);
    });

    it('toggle on the only-open closes when collapsible (default)', () => {
      const m = createAccordionMachine({ items });
      m.send({ type: 'TOGGLE', id: 'a' });
      m.send({ type: 'TOGGLE', id: 'a' });
      expect(m.context.expandedIds).toEqual([]);
    });

    it('toggle on the only-open is a no-op when !collapsible', () => {
      const m = createAccordionMachine({ items, collapsible: false });
      m.send({ type: 'TOGGLE', id: 'a' });
      m.send({ type: 'TOGGLE', id: 'a' });
      expect(m.context.expandedIds).toEqual(['a']);
    });

    it('disabled item cannot be toggled', () => {
      const m = createAccordionMachine({ items });
      m.send({ type: 'TOGGLE', id: 'b' });
      expect(m.context.expandedIds).toEqual([]);
    });
  });

  describe('TOGGLE — multiple mode', () => {
    it('any subset can be open', () => {
      const m = createAccordionMachine({ items, mode: 'multiple' });
      m.send({ type: 'TOGGLE', id: 'a' });
      m.send({ type: 'TOGGLE', id: 'c' });
      expect(m.context.expandedIds).toEqual(['a', 'c']);
      m.send({ type: 'TOGGLE', id: 'a' });
      expect(m.context.expandedIds).toEqual(['c']);
    });
  });

  describe('EXPAND / COLLAPSE', () => {
    it('EXPAND adds (single replaces)', () => {
      const m = createAccordionMachine({ items });
      m.send({ type: 'EXPAND', id: 'a' });
      expect(m.context.expandedIds).toEqual(['a']);
      m.send({ type: 'EXPAND', id: 'c' });
      expect(m.context.expandedIds).toEqual(['c']);
    });

    it('EXPAND in multiple mode adds to set', () => {
      const m = createAccordionMachine({ items, mode: 'multiple' });
      m.send({ type: 'EXPAND', id: 'a' });
      m.send({ type: 'EXPAND', id: 'c' });
      expect(m.context.expandedIds).toEqual(['a', 'c']);
    });

    it('COLLAPSE removes', () => {
      const m = createAccordionMachine({
        items,
        mode: 'multiple',
        defaultValue: ['general', 'team'],
      });
      m.send({ type: 'COLLAPSE', id: 'a' });
      expect(m.context.expandedIds).toEqual(['c']);
    });

    it('COLLAPSE on the only-open is a no-op when !collapsible', () => {
      const m = createAccordionMachine({ items, collapsible: false, defaultValue: 'general' });
      m.send({ type: 'COLLAPSE', id: 'a' });
      expect(m.context.expandedIds).toEqual(['a']);
    });
  });

  describe('FOCUS / NAVIGATE', () => {
    it('FOCUS sets focusedId; disabled is ignored', () => {
      const m = createAccordionMachine({ items });
      m.send({ type: 'FOCUS', id: 'c' });
      expect(m.context.focusedId).toBe('c');
      m.send({ type: 'FOCUS', id: 'b' });
      expect(m.context.focusedId).toBe('c');
    });

    it('NAVIGATE next skips disabled', () => {
      const m = createAccordionMachine({ items });
      m.send({ type: 'FOCUS', id: 'a' });
      m.send({ type: 'NAVIGATE', direction: 'next' });
      expect(m.context.focusedId).toBe('c');
    });

    it('NAVIGATE first / last', () => {
      const m = createAccordionMachine({ items });
      m.send({ type: 'NAVIGATE', direction: 'last' });
      expect(m.context.focusedId).toBe('d');
      m.send({ type: 'NAVIGATE', direction: 'first' });
      expect(m.context.focusedId).toBe('a');
    });

    it('BLUR clears focusedId', () => {
      const m = createAccordionMachine({ items });
      m.send({ type: 'FOCUS', id: 'a' });
      m.send({ type: 'BLUR' });
      expect(m.context.focusedId).toBe(null);
    });
  });

  describe('SET.* (programmatic)', () => {
    it('SET.VALUE single', () => {
      const m = createAccordionMachine({ items });
      m.send({ type: 'SET.VALUE', value: 'team' });
      expect(m.context.expandedIds).toEqual(['c']);
    });

    it('SET.VALUE multiple', () => {
      const m = createAccordionMachine({ items, mode: 'multiple' });
      m.send({ type: 'SET.VALUE', value: ['general', 'security'] });
      expect(m.context.expandedIds).toEqual(['a', 'd']);
    });

    it('SET.VALUE matches object values by shape (Svelte 5 $bindable proxy safe)', () => {
      // Same shape, different object reference — the proxy case.
      type Q = { question: string };
      const objectItems = [
        { id: 'q1', value: { question: 'a' } as Q },
        { id: 'q2', value: { question: 'b' } as Q },
      ];
      const m = createAccordionMachine<Q>({ items: objectItems });
      // Simulate `$bindable` returning a different reference with the same shape.
      m.send({ type: 'SET.VALUE', value: { question: 'a' } });
      expect(m.context.expandedIds).toEqual(['q1']);
    });

    it('SET.VALUE multiple matches object values by shape', () => {
      type Q = { question: string };
      const objectItems = [
        { id: 'q1', value: { question: 'a' } as Q },
        { id: 'q2', value: { question: 'b' } as Q },
      ];
      const m = createAccordionMachine<Q>({ items: objectItems, mode: 'multiple' });
      m.send({ type: 'SET.VALUE', value: [{ question: 'a' }, { question: 'b' }] });
      expect(m.context.expandedIds).toEqual(['q1', 'q2']);
    });

    it('SET.VALUE rejects values whose shape mismatches', () => {
      type Q = { question: string };
      const m = createAccordionMachine<Q>({
        items: [{ id: 'q1', value: { question: 'a' } }],
      });
      m.send({ type: 'SET.VALUE', value: { question: 'z' } });
      expect(m.context.expandedIds).toEqual([]);
    });

    it('SET.VALUE null / undefined clear the selection', () => {
      const m = createAccordionMachine({ items, defaultValue: 'team' });
      m.send({ type: 'SET.VALUE', value: null });
      expect(m.context.expandedIds).toEqual([]);
    });

    it('SET.ITEMS prunes removed expanded', () => {
      const m = createAccordionMachine({
        items,
        mode: 'multiple',
        defaultValue: ['general', 'team'],
      });
      m.send({ type: 'SET.ITEMS', items: [{ id: 'a', value: 'general' }] });
      expect(m.context.expandedIds).toEqual(['a']);
    });

    it('SET.MODE multiple→single trims to first open', () => {
      const m = createAccordionMachine({
        items,
        mode: 'multiple',
        defaultValue: ['general', 'team'],
      });
      m.send({ type: 'SET.MODE', mode: 'single' });
      expect(m.context.expandedIds).toEqual(['a']);
    });

    it('SET.COLLAPSIBLE flips at runtime', () => {
      const m = createAccordionMachine({ items, defaultValue: 'general' });
      m.send({ type: 'SET.COLLAPSIBLE', value: false });
      m.send({ type: 'TOGGLE', id: 'a' });
      expect(m.context.expandedIds).toEqual(['a']);
      m.send({ type: 'SET.COLLAPSIBLE', value: true });
      m.send({ type: 'TOGGLE', id: 'a' });
      expect(m.context.expandedIds).toEqual([]);
    });
  });
});
