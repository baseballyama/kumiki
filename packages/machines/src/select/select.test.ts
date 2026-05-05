import { describe, it, expect } from 'vitest';
import { createSelectMachine, type SelectItem } from './index.ts';

const items: SelectItem<string>[] = [
  { id: 's-a', value: 'apple', label: 'Apple' },
  { id: 's-b', value: 'banana', label: 'Banana', disabled: true },
  { id: 's-c', value: 'cherry', label: 'Cherry' },
  { id: 's-d', value: 'date', label: 'Date' },
];

describe('select machine', () => {
  describe('initial state', () => {
    it('starts closed with no value', () => {
      const m = createSelectMachine({ items });
      expect(m.state).toBe('closed');
      expect(m.context.value).toBe(null);
      expect(m.context.highlightedId).toBe(null);
      expect(m.context.typeahead).toBe('');
    });

    it('honors defaultValue', () => {
      const m = createSelectMachine({ items, defaultValue: 'cherry' });
      expect(m.context.value).toBe('cherry');
    });

    it('honors defaultOpen', () => {
      const m = createSelectMachine({ items, defaultOpen: true });
      expect(m.state).toBe('open');
    });
  });

  describe('OPEN / CLOSE', () => {
    it('OPEN highlights selected if any', () => {
      const m = createSelectMachine({ items, defaultValue: 'cherry' });
      m.send({ type: 'OPEN' });
      expect(m.state).toBe('open');
      expect(m.context.highlightedId).toBe('s-c');
    });

    it('OPEN highlights first enabled if no selection', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'OPEN' });
      expect(m.context.highlightedId).toBe('s-a'); // 's-a' enabled
    });

    it('CLOSE clears highlight + typeahead', () => {
      const m = createSelectMachine({ items, defaultValue: 'cherry' });
      m.send({ type: 'OPEN' });
      m.send({ type: 'TYPEAHEAD', char: 'a' });
      m.send({ type: 'CLOSE' });
      expect(m.state).toBe('closed');
      expect(m.context.highlightedId).toBe(null);
      expect(m.context.typeahead).toBe('');
    });
  });

  describe('TOGGLE', () => {
    it('flips closed ↔ open', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('open');
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('closed');
    });
  });

  describe('SELECT', () => {
    it('commits value and closes', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'OPEN' });
      m.send({ type: 'SELECT', id: 's-c' });
      expect(m.state).toBe('closed');
      expect(m.context.value).toBe('cherry');
    });

    it('disabled item cannot be selected (still closes)', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'OPEN' });
      m.send({ type: 'SELECT', id: 's-b' });
      expect(m.state).toBe('closed');
      expect(m.context.value).toBe(null);
    });

    it('SELECT in closed state is a no-op', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'SELECT', id: 's-c' });
      expect(m.state).toBe('closed');
      expect(m.context.value).toBe(null);
    });
  });

  describe('NAVIGATE', () => {
    it('arrow next from highlighted item, skipping disabled', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'OPEN' });
      m.send({ type: 'NAVIGATE', direction: 'next' });
      // s-a → skip s-b (disabled) → s-c
      expect(m.context.highlightedId).toBe('s-c');
    });

    it('first / last jump', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'OPEN' });
      m.send({ type: 'NAVIGATE', direction: 'last' });
      expect(m.context.highlightedId).toBe('s-d');
      m.send({ type: 'NAVIGATE', direction: 'first' });
      expect(m.context.highlightedId).toBe('s-a');
    });

    it('clamp mode stays at end', () => {
      const m = createSelectMachine({ items, navigation: 'clamp' });
      m.send({ type: 'OPEN' });
      m.send({ type: 'NAVIGATE', direction: 'last' });
      m.send({ type: 'NAVIGATE', direction: 'next' });
      expect(m.context.highlightedId).toBe('s-d');
    });

    it('NAVIGATE in closed state is a no-op', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'NAVIGATE', direction: 'first' });
      expect(m.context.highlightedId).toBe(null);
    });
  });

  describe('HIGHLIGHT', () => {
    it('points to a specific id (e.g. mouse hover)', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'OPEN' });
      m.send({ type: 'HIGHLIGHT', id: 's-d' });
      expect(m.context.highlightedId).toBe('s-d');
    });

    it('disabled items are ignored', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'OPEN' });
      m.send({ type: 'HIGHLIGHT', id: 's-b' });
      expect(m.context.highlightedId).toBe('s-a'); // unchanged from OPEN
    });

    it('null clears the highlight', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'OPEN' });
      m.send({ type: 'HIGHLIGHT', id: null });
      expect(m.context.highlightedId).toBe(null);
    });
  });

  describe('TYPEAHEAD', () => {
    it('jumps to the first enabled match', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'OPEN' });
      m.send({ type: 'TYPEAHEAD', char: 'c' });
      expect(m.context.highlightedId).toBe('s-c');
      expect(m.context.typeahead).toBe('c');
    });

    it('repeated single char cycles', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'OPEN' });
      m.send({ type: 'TYPEAHEAD', char: 'a' });
      // 'a' matches Apple → s-a
      expect(m.context.highlightedId).toBe('s-a');
      // No further "a" match — typeahead just records buffer.
      m.send({ type: 'TYPEAHEAD', char: 'a' });
      expect(m.context.typeahead).toBe('aa');
    });

    it('extends buffer for multi-char queries', () => {
      const items2: SelectItem<string>[] = [
        { id: '1', value: 'cat', label: 'Cat' },
        { id: '2', value: 'cape', label: 'Cape' },
        { id: '3', value: 'car', label: 'Car' },
      ];
      const m = createSelectMachine({ items: items2 });
      m.send({ type: 'OPEN' });
      m.send({ type: 'TYPEAHEAD', char: 'c' });
      expect(m.context.highlightedId).toBe('1');
      m.send({ type: 'TYPEAHEAD', char: 'a' });
      m.send({ type: 'TYPEAHEAD', char: 'r' });
      expect(m.context.highlightedId).toBe('3');
    });

    it('TYPEAHEAD.RESET clears buffer', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'OPEN' });
      m.send({ type: 'TYPEAHEAD', char: 'c' });
      m.send({ type: 'TYPEAHEAD.RESET' });
      expect(m.context.typeahead).toBe('');
    });
  });

  describe('SET.VALUE / SET.ITEMS', () => {
    it('SET.VALUE updates without opening', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'SET.VALUE', value: 'cherry' });
      expect(m.context.value).toBe('cherry');
      expect(m.state).toBe('closed');
    });

    it('SET.ITEMS preserves value if still present', () => {
      const m = createSelectMachine({ items, defaultValue: 'cherry' });
      m.send({
        type: 'SET.ITEMS',
        items: [
          { id: 'x', value: 'cherry', label: 'Cherry' },
          { id: 'y', value: 'fig', label: 'Fig' },
        ],
      });
      expect(m.context.value).toBe('cherry');
    });

    it('SET.ITEMS clears value if removed', () => {
      const m = createSelectMachine({ items, defaultValue: 'cherry' });
      m.send({ type: 'SET.ITEMS', items: [{ id: 'x', value: 'fig', label: 'Fig' }] });
      expect(m.context.value).toBe(null);
    });

    it('SET.ITEMS rebases highlight if removed', () => {
      const m = createSelectMachine({ items });
      m.send({ type: 'OPEN' });
      m.send({ type: 'NAVIGATE', direction: 'last' }); // highlight s-d
      m.send({ type: 'SET.ITEMS', items: [{ id: 'x', value: 'fig', label: 'Fig' }] });
      expect(m.context.highlightedId).toBe('x');
    });
  });

  describe('subscribe', () => {
    it('emits initial + every transition', () => {
      const m = createSelectMachine({ items });
      const seen: string[] = [];
      m.subscribe(({ state }) => seen.push(state));
      m.send({ type: 'OPEN' });
      m.send({ type: 'CLOSE' });
      expect(seen).toEqual(['closed', 'open', 'closed']);
    });
  });
});
