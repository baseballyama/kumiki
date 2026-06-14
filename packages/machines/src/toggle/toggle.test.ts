import { describe, it, expect } from 'vitest';
import { createToggleMachine } from './index.ts';

describe('toggle machine', () => {
  describe('initial state', () => {
    it('defaults to unpressed', () => {
      const m = createToggleMachine();
      expect(m.state).toBe('unpressed');
      expect(m.context.pressed).toBe(false);
      expect(m.context.toggles).toBe(0);
    });

    it('respects initial=true', () => {
      const m = createToggleMachine({ initial: true });
      expect(m.state).toBe('pressed');
      expect(m.context.pressed).toBe(true);
    });

    it('respects disabled=true (overrides initial)', () => {
      const m = createToggleMachine({ initial: true, disabled: true });
      expect(m.state).toBe('disabled');
      // pressed is preserved in context but visually irrelevant while disabled
      expect(m.context.pressed).toBe(true);
    });
  });

  describe('TOGGLE', () => {
    it('flips unpressed → pressed', () => {
      const m = createToggleMachine();
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('pressed');
      expect(m.context.pressed).toBe(true);
      expect(m.context.toggles).toBe(1);
    });

    it('flips pressed → unpressed', () => {
      const m = createToggleMachine({ initial: true });
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('unpressed');
      expect(m.context.pressed).toBe(false);
      expect(m.context.toggles).toBe(1);
    });

    it('round-trips', () => {
      const m = createToggleMachine();
      m.send({ type: 'TOGGLE' });
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('unpressed');
      expect(m.context.toggles).toBe(2);
    });

    it('is a no-op when disabled', () => {
      const m = createToggleMachine({ disabled: true });
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('disabled');
      expect(m.context.toggles).toBe(0);
    });
  });

  describe('SET (controlled mode)', () => {
    it('SET pressed=true on unpressed → pressed', () => {
      const m = createToggleMachine();
      m.send({ type: 'SET', pressed: true });
      expect(m.state).toBe('pressed');
      // controlled actions don't bump the toggles counter
      expect(m.context.toggles).toBe(0);
    });

    it('SET pressed=false on pressed → unpressed', () => {
      const m = createToggleMachine({ initial: true });
      m.send({ type: 'SET', pressed: false });
      expect(m.state).toBe('unpressed');
      expect(m.context.toggles).toBe(0);
    });

    it('SET to current value is a no-op (idempotent)', () => {
      const m = createToggleMachine();
      // pressed is already false
      m.send({ type: 'SET', pressed: false });
      expect(m.state).toBe('unpressed');
      expect(m.context.toggles).toBe(0);
    });

    it('is a no-op when disabled', () => {
      const m = createToggleMachine({ disabled: true });
      m.send({ type: 'SET', pressed: true });
      expect(m.state).toBe('disabled');
    });
  });

  describe('DISABLE / ENABLE', () => {
    it('DISABLE from unpressed → disabled', () => {
      const m = createToggleMachine();
      m.send({ type: 'DISABLE' });
      expect(m.state).toBe('disabled');
    });

    it('DISABLE from pressed → disabled (preserves pressed in context)', () => {
      const m = createToggleMachine({ initial: true });
      m.send({ type: 'DISABLE' });
      expect(m.state).toBe('disabled');
      expect(m.context.pressed).toBe(true);
    });

    it('ENABLE restores pressed when the toggle was pressed before disabling', () => {
      const m = createToggleMachine({ initial: true, disabled: true });
      m.send({ type: 'ENABLE' });
      expect(m.state).toBe('pressed');
      expect(m.context.pressed).toBe(true);
    });

    it('ENABLE returns to unpressed when the toggle was not pressed', () => {
      const m = createToggleMachine({ disabled: true });
      m.send({ type: 'ENABLE' });
      expect(m.state).toBe('unpressed');
      expect(m.context.pressed).toBe(false);
    });

    it('DISABLE → ENABLE round-trips without changing the value', () => {
      const m = createToggleMachine({ initial: true });
      m.send({ type: 'DISABLE' });
      m.send({ type: 'ENABLE' });
      expect(m.state).toBe('pressed');
      expect(m.context.pressed).toBe(true);
    });
  });

  describe('XState JSON export', () => {
    it('exports a stately.ai-compatible config', () => {
      const m = createToggleMachine();
      const json = m.toJSON();
      expect(json.id).toBe('toggle');
      expect(Object.keys(json.states).sort()).toEqual(['disabled', 'pressed', 'unpressed']);
      expect(json.states.unpressed?.on?.TOGGLE).toEqual({
        target: 'pressed',
        actions: ['press'],
      });
      expect(json.states.pressed?.on?.TOGGLE).toEqual({
        target: 'unpressed',
        actions: ['release'],
      });
      // ENABLE is a guarded multi-transition; toJSON serializes the first
      // candidate (target `pressed`) — guards themselves are not serialized.
      expect(json.states.disabled?.on?.ENABLE).toEqual({
        target: 'pressed',
      });
    });
  });
});
