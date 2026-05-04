import { describe, it, expect } from 'vitest';
import { createCheckboxMachine } from './index.ts';

describe('checkbox machine', () => {
  describe('initial state', () => {
    it('defaults to unchecked', () => {
      const m = createCheckboxMachine();
      expect(m.state).toBe('unchecked');
      expect(m.context.value).toBe('unchecked');
      expect(m.context.toggles).toBe(0);
    });

    it('respects initial=checked', () => {
      const m = createCheckboxMachine({ initial: 'checked' });
      expect(m.state).toBe('checked');
      expect(m.context.value).toBe('checked');
    });

    it('respects initial=mixed', () => {
      const m = createCheckboxMachine({ initial: 'mixed' });
      expect(m.state).toBe('mixed');
      expect(m.context.value).toBe('mixed');
    });

    it('disabled overrides initial state but keeps value', () => {
      const m = createCheckboxMachine({ initial: 'checked', disabled: true });
      expect(m.state).toBe('disabled');
      expect(m.context.value).toBe('checked');
    });
  });

  describe('TOGGLE', () => {
    it('flips unchecked → checked', () => {
      const m = createCheckboxMachine();
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('checked');
      expect(m.context.value).toBe('checked');
      expect(m.context.toggles).toBe(1);
    });

    it('flips checked → unchecked', () => {
      const m = createCheckboxMachine({ initial: 'checked' });
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('unchecked');
      expect(m.context.value).toBe('unchecked');
    });

    it('flips mixed → checked (APG tristate guidance)', () => {
      const m = createCheckboxMachine({ initial: 'mixed' });
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('checked');
      expect(m.context.value).toBe('checked');
    });

    it('round-trips unchecked / checked', () => {
      const m = createCheckboxMachine();
      m.send({ type: 'TOGGLE' });
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('unchecked');
      expect(m.context.toggles).toBe(2);
    });

    it('disabled is a no-op', () => {
      const m = createCheckboxMachine({ disabled: true });
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('disabled');
      expect(m.context.toggles).toBe(0);
    });
  });

  describe('SET (controlled mode)', () => {
    it('SET checked from unchecked', () => {
      const m = createCheckboxMachine();
      m.send({ type: 'SET', value: 'checked' });
      expect(m.state).toBe('checked');
      expect(m.context.toggles).toBe(0);
    });

    it('SET unchecked from checked', () => {
      const m = createCheckboxMachine({ initial: 'checked' });
      m.send({ type: 'SET', value: 'unchecked' });
      expect(m.state).toBe('unchecked');
    });

    it('SET mixed from unchecked', () => {
      const m = createCheckboxMachine();
      m.send({ type: 'SET', value: 'mixed' });
      expect(m.state).toBe('mixed');
      expect(m.context.value).toBe('mixed');
    });

    it('SET mixed from checked', () => {
      const m = createCheckboxMachine({ initial: 'checked' });
      m.send({ type: 'SET', value: 'mixed' });
      expect(m.state).toBe('mixed');
    });

    it('SET checked from mixed', () => {
      const m = createCheckboxMachine({ initial: 'mixed' });
      m.send({ type: 'SET', value: 'checked' });
      expect(m.state).toBe('checked');
    });

    it('SET unchecked from mixed', () => {
      const m = createCheckboxMachine({ initial: 'mixed' });
      m.send({ type: 'SET', value: 'unchecked' });
      expect(m.state).toBe('unchecked');
    });

    it('idempotent SET to current value is no-op', () => {
      const m = createCheckboxMachine();
      m.send({ type: 'SET', value: 'unchecked' });
      expect(m.state).toBe('unchecked');
      expect(m.context.toggles).toBe(0);
    });

    it('disabled SET is dropped', () => {
      const m = createCheckboxMachine({ disabled: true });
      m.send({ type: 'SET', value: 'checked' });
      expect(m.state).toBe('disabled');
    });
  });

  describe('DISABLE / ENABLE', () => {
    it('DISABLE from any state → disabled (preserves value)', () => {
      const m = createCheckboxMachine({ initial: 'mixed' });
      m.send({ type: 'DISABLE' });
      expect(m.state).toBe('disabled');
      expect(m.context.value).toBe('mixed');
    });

    it('ENABLE returns to unchecked (matches browser default)', () => {
      const m = createCheckboxMachine({ initial: 'checked', disabled: true });
      m.send({ type: 'ENABLE' });
      expect(m.state).toBe('unchecked');
    });
  });

  describe('XState JSON export', () => {
    it('exports a stately.ai-compatible config', () => {
      const m = createCheckboxMachine();
      const json = m.toJSON();
      expect(json.id).toBe('checkbox');
      expect(Object.keys(json.states).sort()).toEqual([
        'checked',
        'disabled',
        'mixed',
        'unchecked',
      ]);
      expect(json.states.unchecked?.on?.TOGGLE).toEqual({
        target: 'checked',
        actions: ['check'],
      });
      expect(json.states.mixed?.on?.TOGGLE).toEqual({
        target: 'checked',
        actions: ['check'],
      });
    });
  });
});
