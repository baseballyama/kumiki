import { describe, it, expect } from 'vitest';
import { createTabsMachine, type TabItem } from './index.ts';

const items: TabItem[] = [
  { id: 't-a', value: 'account', label: 'Account' },
  { id: 't-b', value: 'billing', label: 'Billing', disabled: true },
  { id: 't-c', value: 'team', label: 'Team' },
  { id: 't-d', value: 'security', label: 'Security' },
];

describe('tabs machine', () => {
  describe('initial state', () => {
    it('defaults to first enabled item', () => {
      const m = createTabsMachine({ items });
      expect(m.state).toBe('idle');
      expect(m.context.value).toBe('account');
      expect(m.context.focusedId).toBe(null);
      expect(m.context.activation).toBe('automatic');
    });

    it('respects defaultValue', () => {
      const m = createTabsMachine({ items, defaultValue: 'team' });
      expect(m.context.value).toBe('team');
    });

    it('explicit null defaultValue keeps null', () => {
      const m = createTabsMachine({ items, defaultValue: null });
      expect(m.context.value).toBe(null);
    });

    it('starts disabled when disabled=true', () => {
      const m = createTabsMachine({ items, disabled: true });
      expect(m.state).toBe('disabled');
    });

    it('honors manual activation', () => {
      const m = createTabsMachine({ items, activation: 'manual' });
      expect(m.context.activation).toBe('manual');
    });
  });

  describe('SELECT', () => {
    it('selects an item directly', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'SELECT', id: 't-c' });
      expect(m.context.value).toBe('team');
      expect(m.context.focusedId).toBe('t-c');
    });

    it('disabled item cannot be selected', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'SELECT', id: 't-b' });
      expect(m.context.value).toBe('account');
    });

    it('unknown id is dropped', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'SELECT', id: 'zz' });
      expect(m.context.value).toBe('account');
    });
  });

  describe('FOCUS / BLUR — automatic activation', () => {
    it('FOCUS moves focus AND activates the tab', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'FOCUS', id: 't-d' });
      expect(m.context.focusedId).toBe('t-d');
      expect(m.context.value).toBe('security');
    });

    it('FOCUS on disabled is a no-op', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'FOCUS', id: 't-b' });
      expect(m.context.focusedId).toBe(null);
      expect(m.context.value).toBe('account');
    });

    it('BLUR clears focusedId but keeps value', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'FOCUS', id: 't-c' });
      m.send({ type: 'BLUR' });
      expect(m.context.focusedId).toBe(null);
      expect(m.context.value).toBe('team');
    });
  });

  describe('FOCUS / BLUR — manual activation', () => {
    it('FOCUS moves focus but does NOT activate', () => {
      const m = createTabsMachine({ items, activation: 'manual', defaultValue: 'account' });
      m.send({ type: 'FOCUS', id: 't-d' });
      expect(m.context.focusedId).toBe('t-d');
      expect(m.context.value).toBe('account'); // unchanged
    });

    it('ACTIVATE_FOCUSED commits the focused tab', () => {
      const m = createTabsMachine({ items, activation: 'manual', defaultValue: 'account' });
      m.send({ type: 'FOCUS', id: 't-d' });
      m.send({ type: 'ACTIVATE_FOCUSED' });
      expect(m.context.value).toBe('security');
    });

    it('ACTIVATE_FOCUSED with no focus is a no-op', () => {
      const m = createTabsMachine({ items, activation: 'manual', defaultValue: 'account' });
      m.send({ type: 'ACTIVATE_FOCUSED' });
      expect(m.context.value).toBe('account');
    });

    it('ACTIVATE_FOCUSED on focused-but-disabled is a no-op', () => {
      // Manually FOCUS a disabled — guarded; but if focusedId somehow points to one, no-op.
      const m = createTabsMachine({ items, activation: 'manual', defaultValue: 'account' });
      m.send({ type: 'FOCUS', id: 't-b' }); // dropped (disabled)
      m.send({ type: 'ACTIVATE_FOCUSED' });
      expect(m.context.value).toBe('account');
    });
  });

  describe('NAVIGATE (arrow keys) — automatic', () => {
    it('first NAVIGATE next from default-value lands on next enabled', () => {
      const m = createTabsMachine({ items }); // value=account (id=t-a) but focusedId=null
      m.send({ type: 'NAVIGATE', direction: 'next' });
      expect(m.context.focusedId).toBe('t-c'); // skips disabled t-b
      expect(m.context.value).toBe('team');
    });

    it('skips disabled items in both directions', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'FOCUS', id: 't-c' });
      m.send({ type: 'NAVIGATE', direction: 'prev' });
      expect(m.context.focusedId).toBe('t-a'); // skips t-b
    });

    it('wraps end → start (wrap mode default)', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'FOCUS', id: 't-d' });
      m.send({ type: 'NAVIGATE', direction: 'next' });
      expect(m.context.focusedId).toBe('t-a');
    });

    it('clamp mode stays at end', () => {
      const m = createTabsMachine({ items, navigation: 'clamp' });
      m.send({ type: 'FOCUS', id: 't-d' });
      m.send({ type: 'NAVIGATE', direction: 'next' });
      expect(m.context.focusedId).toBe('t-d');
    });

    it('first/last jump', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'NAVIGATE', direction: 'last' });
      expect(m.context.focusedId).toBe('t-d');
      m.send({ type: 'NAVIGATE', direction: 'first' });
      expect(m.context.focusedId).toBe('t-a');
    });
  });

  describe('NAVIGATE (arrow keys) — manual', () => {
    it('moves focus but not value', () => {
      const m = createTabsMachine({ items, activation: 'manual', defaultValue: 'account' });
      m.send({ type: 'FOCUS', id: 't-a' });
      m.send({ type: 'NAVIGATE', direction: 'next' });
      expect(m.context.focusedId).toBe('t-c');
      expect(m.context.value).toBe('account'); // unchanged until ACTIVATE_FOCUSED
    });
  });

  describe('SET.VALUE (programmatic)', () => {
    it('changes value without changing focus', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'SET.VALUE', value: 'team' });
      expect(m.context.value).toBe('team');
      expect(m.context.focusedId).toBe(null);
    });

    it('disabled value is dropped', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'SET.VALUE', value: 'billing' });
      expect(m.context.value).toBe('account'); // unchanged
    });

    it('null clears', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'SET.VALUE', value: null });
      expect(m.context.value).toBe(null);
    });
  });

  describe('SET.ITEMS', () => {
    it('preserves value if still present and enabled', () => {
      const m = createTabsMachine({ items, defaultValue: 'team' });
      const newItems: TabItem[] = [
        { id: 'n-a', value: 'team', label: 'Team' },
        { id: 'n-b', value: 'logs', label: 'Logs' },
      ];
      m.send({ type: 'SET.ITEMS', items: newItems });
      expect(m.context.items).toEqual(newItems);
      expect(m.context.value).toBe('team');
    });

    it('falls back to first enabled if value removed', () => {
      const m = createTabsMachine({ items, defaultValue: 'team' });
      m.send({
        type: 'SET.ITEMS',
        items: [
          { id: 'x', value: 'logs' },
          { id: 'y', value: 'metrics' },
        ],
      });
      expect(m.context.value).toBe('logs');
    });

    it('falls back if value is now disabled', () => {
      const m = createTabsMachine({ items, defaultValue: 'team' });
      m.send({
        type: 'SET.ITEMS',
        items: [
          { id: 'a', value: 'team', disabled: true },
          { id: 'b', value: 'logs' },
        ],
      });
      expect(m.context.value).toBe('logs');
    });

    it('clears focus if focused id removed', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'FOCUS', id: 't-a' });
      m.send({ type: 'SET.ITEMS', items: [{ id: 'x', value: 'logs' }] });
      expect(m.context.focusedId).toBe(null);
    });
  });

  describe('SET.ACTIVATION', () => {
    it('toggles activation mode at runtime', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'SET.ACTIVATION', activation: 'manual' });
      expect(m.context.activation).toBe('manual');
      m.send({ type: 'FOCUS', id: 't-d' });
      expect(m.context.value).toBe('account'); // manual now → no auto-activate
    });
  });

  describe('DISABLE / ENABLE', () => {
    it('DISABLE drops events', () => {
      const m = createTabsMachine({ items });
      m.send({ type: 'DISABLE' });
      m.send({ type: 'SELECT', id: 't-c' });
      expect(m.state).toBe('disabled');
      expect(m.context.value).toBe('account');
    });

    it('ENABLE restores idle', () => {
      const m = createTabsMachine({ items, disabled: true });
      m.send({ type: 'ENABLE' });
      expect(m.state).toBe('idle');
    });
  });
});
