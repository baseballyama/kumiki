import { describe, it, expect } from 'vitest';
import { createFormFieldMachine, type FieldIssue } from './index.ts';

describe('form-field machine', () => {
  describe('initial state', () => {
    it('starts pristine with the initial value', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      expect(m.state).toBe('pristine');
      expect(m.context.value).toBe('');
      expect(m.context.touched).toBe(false);
      expect(m.context.dirty).toBe(false);
      expect(m.context.errors).toEqual([]);
      expect(m.context.validationToken).toBe(0);
    });
  });

  describe('FOCUS / INPUT / BLUR', () => {
    it('FOCUS from pristine is a no-op (no validation until INPUT)', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      m.send({ type: 'FOCUS' });
      expect(m.state).toBe('pristine');
    });

    it('INPUT updates value and marks dirty', () => {
      const m = createFormFieldMachine({ initialValue: 'foo' });
      m.send({ type: 'INPUT', value: 'bar' });
      expect(m.state).toBe('editing');
      expect(m.context.value).toBe('bar');
      expect(m.context.dirty).toBe(true);
    });

    it('INPUT back to initial value clears dirty', () => {
      const m = createFormFieldMachine({ initialValue: 'foo' });
      m.send({ type: 'INPUT', value: 'bar' });
      m.send({ type: 'INPUT', value: 'foo' });
      expect(m.context.dirty).toBe(false);
    });

    it('BLUR from pristine touches without leaving pristine', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      m.send({ type: 'BLUR' });
      expect(m.state).toBe('pristine');
      expect(m.context.touched).toBe(true);
    });

    it('BLUR from editing transitions to validating + touches', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      m.send({ type: 'INPUT', value: 'a' });
      m.send({ type: 'BLUR' });
      expect(m.state).toBe('validating');
      expect(m.context.touched).toBe(true);
    });
  });

  describe('SUBMIT_REQUEST', () => {
    it('runs validation regardless of starting state', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      m.send({ type: 'SUBMIT_REQUEST' });
      expect(m.state).toBe('validating');
    });
  });

  describe('VALIDATION_RESOLVE', () => {
    it('resolves to valid when issues empty', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      m.send({ type: 'INPUT', value: 'a' });
      m.send({ type: 'BLUR' });
      const token = m.context.validationToken;
      m.send({ type: 'VALIDATION_RESOLVE', token, issues: [] });
      expect(m.state).toBe('valid');
      expect(m.context.errors).toEqual([]);
    });

    it('resolves to invalid when issues present', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      m.send({ type: 'INPUT', value: 'x' });
      m.send({ type: 'BLUR' });
      const token = m.context.validationToken;
      const issues: FieldIssue[] = [{ message: 'too short' }];
      m.send({ type: 'VALIDATION_RESOLVE', token, issues });
      expect(m.state).toBe('invalid');
      expect(m.context.errors).toEqual(issues);
    });

    it('drops stale tokens', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      m.send({ type: 'INPUT', value: 'a' });
      m.send({ type: 'BLUR' });
      const stale = m.context.validationToken;
      // User keeps typing while validator is still in flight.
      m.send({ type: 'INPUT', value: 'ab' });
      // Stale resolution arrives — dropped.
      m.send({ type: 'VALIDATION_RESOLVE', token: stale, issues: [{ message: 'bad' }] });
      expect(m.state).toBe('editing');
      expect(m.context.errors).toEqual([]);
    });
  });

  describe('VALIDATION_REJECT', () => {
    it('puts the field into invalid with a generic message', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      m.send({ type: 'INPUT', value: 'a' });
      m.send({ type: 'BLUR' });
      const token = m.context.validationToken;
      m.send({ type: 'VALIDATION_REJECT', token, reason: new Error('network') });
      expect(m.state).toBe('invalid');
      expect(m.context.errors[0]?.message).toMatch(/unexpected/i);
    });

    it('drops stale rejection tokens', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      m.send({ type: 'INPUT', value: 'a' });
      m.send({ type: 'BLUR' });
      const stale = m.context.validationToken;
      m.send({ type: 'INPUT', value: 'ab' });
      m.send({ type: 'VALIDATION_REJECT', token: stale, reason: new Error() });
      expect(m.state).toBe('editing');
    });
  });

  describe('SET.VALUE (programmatic)', () => {
    it('updates value, clears errors, bumps token', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      m.send({ type: 'INPUT', value: 'x' });
      m.send({ type: 'BLUR' });
      m.send({
        type: 'VALIDATION_RESOLVE',
        token: m.context.validationToken,
        issues: [{ message: 'too short' }],
      });
      expect(m.state).toBe('invalid');
      m.send({ type: 'SET.VALUE', value: 'longer' });
      expect(m.state).toBe('editing');
      expect(m.context.value).toBe('longer');
      expect(m.context.errors).toEqual([]);
    });
  });

  describe('RESET', () => {
    it('returns to pristine + restores initial value', () => {
      const m = createFormFieldMachine({ initialValue: 'init' });
      m.send({ type: 'INPUT', value: 'changed' });
      m.send({ type: 'BLUR' });
      m.send({ type: 'RESET' });
      expect(m.state).toBe('pristine');
      expect(m.context.value).toBe('init');
      expect(m.context.dirty).toBe(false);
      expect(m.context.touched).toBe(false);
      expect(m.context.errors).toEqual([]);
      expect(m.context.validationToken).toBe(0);
    });

    it('RESET works from validating', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      m.send({ type: 'INPUT', value: 'a' });
      m.send({ type: 'BLUR' });
      m.send({ type: 'RESET' });
      expect(m.state).toBe('pristine');
    });
  });

  describe('INPUT in validating cancels and goes back to editing', () => {
    it('cancels in-flight validation by bumping token', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      m.send({ type: 'INPUT', value: 'a' });
      m.send({ type: 'BLUR' });
      const beforeToken = m.context.validationToken;
      m.send({ type: 'INPUT', value: 'ab' });
      expect(m.state).toBe('editing');
      expect(m.context.validationToken).toBeGreaterThan(beforeToken);
    });
  });

  describe('subscribe', () => {
    it('emits initial + every transition', () => {
      const m = createFormFieldMachine({ initialValue: '' });
      const seen: string[] = [];
      m.subscribe(({ state }) => seen.push(state));
      m.send({ type: 'INPUT', value: 'x' });
      m.send({ type: 'BLUR' });
      m.send({ type: 'VALIDATION_RESOLVE', token: m.context.validationToken, issues: [] });
      expect(seen).toEqual(['pristine', 'editing', 'validating', 'valid']);
    });
  });
});
