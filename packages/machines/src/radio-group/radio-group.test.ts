import { describe, it, expect } from 'vitest';
import { createRadioGroupMachine, idForValue, type RadioItem } from './index.ts';

const items: RadioItem<string>[] = [
  { id: 'a', value: 'apple', label: 'Apple' },
  { id: 'b', value: 'banana', label: 'Banana', disabled: true },
  { id: 'c', value: 'cherry', label: 'Cherry' },
  { id: 'd', value: 'date', label: 'Date' },
];

describe('radio-group machine', () => {
  describe('initial state', () => {
    it('starts idle with no value or focus', () => {
      const m = createRadioGroupMachine({ items });
      expect(m.state).toBe('idle');
      expect(m.context.value).toBe(null);
      expect(m.context.focusedId).toBe(null);
    });

    it('respects defaultValue', () => {
      const m = createRadioGroupMachine({ items, defaultValue: 'cherry' });
      expect(m.context.value).toBe('cherry');
    });

    it('starts disabled when disabled=true', () => {
      const m = createRadioGroupMachine({ items, disabled: true });
      expect(m.state).toBe('disabled');
    });
  });

  describe('SELECT', () => {
    it('selects an item', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'SELECT', id: 'a' });
      expect(m.context.value).toBe('apple');
      expect(m.context.focusedId).toBe('a');
    });

    it('disabled item cannot be selected', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'SELECT', id: 'b' });
      expect(m.context.value).toBe(null);
      expect(m.context.focusedId).toBe(null);
    });

    it('unknown id is dropped', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'SELECT', id: 'zz' });
      expect(m.context.value).toBe(null);
    });
  });

  describe('FOCUS / BLUR', () => {
    it('FOCUS moves the roving anchor but does NOT select (Tab must not commit)', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'FOCUS', id: 'd' });
      expect(m.context.focusedId).toBe('d');
      // Selection-follows-focus is for arrow keys (NAVIGATE), not Tab/native focus.
      expect(m.context.value).toBe(null);
    });

    it('FOCUS on disabled is a no-op', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'FOCUS', id: 'b' });
      expect(m.context.focusedId).toBe(null);
    });

    it('BLUR clears focusedId but keeps the selected value', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'SELECT', id: 'a' });
      m.send({ type: 'FOCUS', id: 'a' });
      m.send({ type: 'BLUR' });
      expect(m.context.focusedId).toBe(null);
      expect(m.context.value).toBe('apple');
    });

    it('idForValue resolves the roving anchor after blur to the selected item', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'SELECT', id: 'c' });
      m.send({ type: 'BLUR' });
      expect(idForValue(m.context.items, m.context.value)).toBe('c');
    });
  });

  describe('NAVIGATE (arrow keys)', () => {
    it('first navigation lands on first enabled item', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'NAVIGATE', direction: 'next' });
      expect(m.context.focusedId).toBe('a');
      expect(m.context.value).toBe('apple');
    });

    it('skips disabled items', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'FOCUS', id: 'a' });
      m.send({ type: 'NAVIGATE', direction: 'next' });
      expect(m.context.focusedId).toBe('c'); // skipped 'b'
    });

    it('wraps end → start (wrap mode default)', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'FOCUS', id: 'd' });
      m.send({ type: 'NAVIGATE', direction: 'next' });
      expect(m.context.focusedId).toBe('a');
    });

    it('clamp mode stays at end', () => {
      const m = createRadioGroupMachine({ items, navigation: 'clamp' });
      m.send({ type: 'FOCUS', id: 'd' });
      m.send({ type: 'NAVIGATE', direction: 'next' });
      expect(m.context.focusedId).toBe('d');
    });

    it('navigation also selects the focused item', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'NAVIGATE', direction: 'first' });
      m.send({ type: 'NAVIGATE', direction: 'next' });
      m.send({ type: 'NAVIGATE', direction: 'next' });
      expect(m.context.value).toBe('date'); // a → c → d
    });

    it('navigation from existing value when no focus', () => {
      const m = createRadioGroupMachine({ items, defaultValue: 'cherry' });
      m.send({ type: 'NAVIGATE', direction: 'next' });
      expect(m.context.focusedId).toBe('d');
      expect(m.context.value).toBe('date');
    });
  });

  describe('SET.VALUE (programmatic)', () => {
    it('sets value without changing focus', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'SET.VALUE', value: 'cherry' });
      expect(m.context.value).toBe('cherry');
      expect(m.context.focusedId).toBe(null);
    });

    it('clearing with null', () => {
      const m = createRadioGroupMachine({ items, defaultValue: 'apple' });
      m.send({ type: 'SET.VALUE', value: null });
      expect(m.context.value).toBe(null);
    });

    it('matches object values by shape (Svelte 5 $bindable proxy safe)', () => {
      type Plan = { tier: string };
      const objectItems: RadioItem<Plan>[] = [
        { id: 'free', value: { tier: 'free' } },
        { id: 'pro', value: { tier: 'pro' } },
      ];
      const m = createRadioGroupMachine<Plan>({ items: objectItems });
      // Different reference, same shape — must still resolve to `free`.
      m.send({ type: 'SET.VALUE', value: { tier: 'free' } });
      expect(m.context.value).toEqual({ tier: 'free' });
    });
  });

  describe('SET.ITEMS', () => {
    it('preserves value if still present', () => {
      const m = createRadioGroupMachine({ items, defaultValue: 'cherry' });
      const newItems: RadioItem<string>[] = [
        { id: 'x', value: 'cherry', label: 'Cherry' },
        { id: 'y', value: 'fig', label: 'Fig' },
      ];
      m.send({ type: 'SET.ITEMS', items: newItems });
      expect(m.context.items).toEqual(newItems);
      expect(m.context.value).toBe('cherry');
    });

    it('clears value if removed', () => {
      const m = createRadioGroupMachine({ items, defaultValue: 'cherry' });
      m.send({ type: 'SET.ITEMS', items: [{ id: 'x', value: 'fig' }] });
      expect(m.context.value).toBe(null);
    });

    it('clears focus if focused id removed', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'FOCUS', id: 'a' });
      m.send({ type: 'SET.ITEMS', items: [{ id: 'x', value: 'fig' }] });
      expect(m.context.focusedId).toBe(null);
    });
  });

  describe('DISABLE / ENABLE', () => {
    it('DISABLE drops events', () => {
      const m = createRadioGroupMachine({ items });
      m.send({ type: 'DISABLE' });
      m.send({ type: 'SELECT', id: 'a' });
      expect(m.state).toBe('disabled');
      expect(m.context.value).toBe(null);
    });

    it('ENABLE restores idle', () => {
      const m = createRadioGroupMachine({ items, disabled: true });
      m.send({ type: 'ENABLE' });
      expect(m.state).toBe('idle');
    });
  });
});
