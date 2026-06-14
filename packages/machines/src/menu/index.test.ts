import { describe, expect, it } from 'vitest';
import { createMenuMachine, type MenuItem } from './index.js';

const ITEMS: MenuItem[] = [
  { id: 'new', label: 'New file' },
  { id: 'open', label: 'Open' },
  { id: 'sep1', label: '', kind: 'separator' },
  { id: 'save', label: 'Save', disabled: true },
  { id: 'export', label: 'Export' },
  { id: 'quit', label: 'Quit' },
];

describe('createMenuMachine', () => {
  it('starts closed by default', () => {
    const m = createMenuMachine({ items: ITEMS });
    expect(m.state).toBe('closed');
    expect(m.context.highlightedId).toBeNull();
    expect(m.context.typeahead).toBe('');
    expect(m.context.activatedId).toBeNull();
  });

  it('honors defaultOpen and highlights the first enabled item', () => {
    const m = createMenuMachine({ items: ITEMS, defaultOpen: true });
    expect(m.state).toBe('open');
    // Safe now that Layer 3 puts aria-activedescendant on the role=menu
    // element (APG menu-button focus model), not the trigger button.
    expect(m.context.highlightedId).toBe('new');
  });

  it('OPEN highlights first enabled non-separator item', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    expect(m.state).toBe('open');
    expect(m.context.highlightedId).toBe('new');
  });

  it('TOGGLE flips state', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'TOGGLE' });
    expect(m.state).toBe('open');
    m.send({ type: 'TOGGLE' });
    expect(m.state).toBe('closed');
    expect(m.context.highlightedId).toBeNull();
  });

  it('CLOSE clears highlight + typeahead + activatedId', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    m.send({ type: 'TYPEAHEAD', char: 'q' });
    m.send({ type: 'CLOSE' });
    expect(m.state).toBe('closed');
    expect(m.context.highlightedId).toBeNull();
    expect(m.context.typeahead).toBe('');
  });

  it('ESCAPE closes the menu', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    m.send({ type: 'ESCAPE' });
    expect(m.state).toBe('closed');
  });

  it('NAVIGATE next moves through enabled items, skipping separator + disabled', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' }); // highlight = 'new'
    m.send({ type: 'NAVIGATE', direction: 'next' });
    expect(m.context.highlightedId).toBe('open');
    m.send({ type: 'NAVIGATE', direction: 'next' });
    // sep1 is separator (filtered), save is disabled (skipped)
    expect(m.context.highlightedId).toBe('export');
    m.send({ type: 'NAVIGATE', direction: 'next' });
    expect(m.context.highlightedId).toBe('quit');
  });

  it('NAVIGATE wraps from last → first', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    m.send({ type: 'NAVIGATE', direction: 'last' });
    expect(m.context.highlightedId).toBe('quit');
    m.send({ type: 'NAVIGATE', direction: 'next' });
    expect(m.context.highlightedId).toBe('new');
  });

  it('NAVIGATE clamp does not wrap', () => {
    const m = createMenuMachine({ items: ITEMS, navigation: 'clamp' });
    m.send({ type: 'OPEN' });
    m.send({ type: 'NAVIGATE', direction: 'last' });
    expect(m.context.highlightedId).toBe('quit');
    m.send({ type: 'NAVIGATE', direction: 'next' });
    expect(m.context.highlightedId).toBe('quit');
  });

  it('NAVIGATE first / last jump', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    m.send({ type: 'NAVIGATE', direction: 'last' });
    expect(m.context.highlightedId).toBe('quit');
    m.send({ type: 'NAVIGATE', direction: 'first' });
    expect(m.context.highlightedId).toBe('new');
  });

  it('HIGHLIGHT sets the cursor when item is enabled', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    m.send({ type: 'HIGHLIGHT', id: 'export' });
    expect(m.context.highlightedId).toBe('export');
  });

  it('HIGHLIGHT is ignored for disabled / unknown ids', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    m.send({ type: 'HIGHLIGHT', id: 'save' });
    expect(m.context.highlightedId).not.toBe('save');
    m.send({ type: 'HIGHLIGHT', id: 'unknown' });
    expect(m.context.highlightedId).not.toBe('unknown');
  });

  it('TYPEAHEAD jumps to the matching item', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    m.send({ type: 'TYPEAHEAD', char: 'q' });
    expect(m.context.highlightedId).toBe('quit');
    expect(m.context.typeahead).toBe('q');
  });

  it('TYPEAHEAD.RESET clears the buffer', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    m.send({ type: 'TYPEAHEAD', char: 'q' });
    m.send({ type: 'TYPEAHEAD.RESET' });
    expect(m.context.typeahead).toBe('');
  });

  it('ACTIVATE bumps activatedId and closes', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    m.send({ type: 'ACTIVATE', id: 'export' });
    expect(m.state).toBe('closed');
    expect(m.context.activatedId).toBe('export');
  });

  it('ACTIVATE on disabled item closes WITHOUT bumping activatedId', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    m.send({ type: 'ACTIVATE', id: 'save' });
    expect(m.state).toBe('closed');
    expect(m.context.activatedId).toBeNull();
  });

  it('ACTIVATE on separator is a no-op activation (still closes)', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    m.send({ type: 'ACTIVATE', id: 'sep1' });
    expect(m.state).toBe('closed');
    expect(m.context.activatedId).toBeNull();
  });

  it('ACTIVATE on unknown id closes silently', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    m.send({ type: 'ACTIVATE', id: 'nope' });
    expect(m.state).toBe('closed');
    expect(m.context.activatedId).toBeNull();
  });

  it('SET.ITEMS while closed updates the list', () => {
    const m = createMenuMachine({ items: ITEMS });
    const next: MenuItem[] = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ];
    m.send({ type: 'SET.ITEMS', items: next });
    expect(m.context.items.map((it) => it.id)).toEqual(['a', 'b']);
  });

  it('SET.ITEMS while open keeps highlight when id still present', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' });
    m.send({ type: 'NAVIGATE', direction: 'next' }); // highlight = 'open'
    const next: MenuItem[] = [
      { id: 'open', label: 'Open' },
      { id: 'export', label: 'Export' },
    ];
    m.send({ type: 'SET.ITEMS', items: next });
    expect(m.context.highlightedId).toBe('open');
  });

  it('SET.ITEMS while open falls back to first enabled when prev highlight is gone', () => {
    const m = createMenuMachine({ items: ITEMS });
    m.send({ type: 'OPEN' }); // highlight = 'new'
    const next: MenuItem[] = [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
    ];
    m.send({ type: 'SET.ITEMS', items: next });
    expect(m.context.highlightedId).toBe('a');
  });

  it('toJSON serializes XState-compatible config', () => {
    const m = createMenuMachine({ items: ITEMS });
    const json = m.toJSON();
    expect(json.id).toBe('menu');
    expect(json.initial).toBe('closed');
    expect(json.states.closed.on).toHaveProperty('OPEN');
    expect(json.states.open.on).toHaveProperty('ACTIVATE');
  });
});
