import { describe, it, expect } from 'vitest';
import { createSwitchMachine } from './index.ts';

describe('switch machine', () => {
  describe('initial state', () => {
    it('defaults to off', () => {
      const m = createSwitchMachine();
      expect(m.state).toBe('off');
      expect(m.context.checked).toBe(false);
      expect(m.context.toggles).toBe(0);
    });

    it('respects initial=true', () => {
      const m = createSwitchMachine({ initial: true });
      expect(m.state).toBe('on');
      expect(m.context.checked).toBe(true);
    });

    it('disabled overrides initial', () => {
      const m = createSwitchMachine({ initial: true, disabled: true });
      expect(m.state).toBe('disabled');
      expect(m.context.checked).toBe(true);
    });
  });

  describe('TOGGLE', () => {
    it('flips off → on', () => {
      const m = createSwitchMachine();
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('on');
      expect(m.context.checked).toBe(true);
      expect(m.context.toggles).toBe(1);
    });

    it('flips on → off', () => {
      const m = createSwitchMachine({ initial: true });
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('off');
      expect(m.context.checked).toBe(false);
    });

    it('round-trips', () => {
      const m = createSwitchMachine();
      m.send({ type: 'TOGGLE' });
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('off');
      expect(m.context.toggles).toBe(2);
    });

    it('is a no-op when disabled', () => {
      const m = createSwitchMachine({ disabled: true });
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('disabled');
      expect(m.context.toggles).toBe(0);
    });
  });

  describe('SET (controlled mode)', () => {
    it('SET checked=true on off → on', () => {
      const m = createSwitchMachine();
      m.send({ type: 'SET', checked: true });
      expect(m.state).toBe('on');
      expect(m.context.toggles).toBe(0);
    });

    it('SET checked=false on on → off', () => {
      const m = createSwitchMachine({ initial: true });
      m.send({ type: 'SET', checked: false });
      expect(m.state).toBe('off');
    });

    it('idempotent SET is no-op', () => {
      const m = createSwitchMachine();
      m.send({ type: 'SET', checked: false });
      expect(m.state).toBe('off');
      expect(m.context.toggles).toBe(0);
    });

    it('disabled SET is no-op', () => {
      const m = createSwitchMachine({ disabled: true });
      m.send({ type: 'SET', checked: true });
      expect(m.state).toBe('disabled');
    });
  });

  describe('DISABLE / ENABLE', () => {
    it('DISABLE from off → disabled', () => {
      const m = createSwitchMachine();
      m.send({ type: 'DISABLE' });
      expect(m.state).toBe('disabled');
    });

    it('DISABLE from on → disabled (preserves checked in context)', () => {
      const m = createSwitchMachine({ initial: true });
      m.send({ type: 'DISABLE' });
      expect(m.state).toBe('disabled');
      expect(m.context.checked).toBe(true);
    });

    it('ENABLE from disabled → off', () => {
      const m = createSwitchMachine({ initial: true, disabled: true });
      m.send({ type: 'ENABLE' });
      expect(m.state).toBe('off');
    });
  });

  it('exports an XState-compatible JSON config', () => {
    const m = createSwitchMachine();
    const json = m.toJSON();
    expect(json.id).toBe('switch');
    expect(Object.keys(json.states).sort()).toEqual(['disabled', 'off', 'on']);
    expect(json.states.off?.on?.TOGGLE).toEqual({ target: 'on', actions: ['check'] });
  });
});
