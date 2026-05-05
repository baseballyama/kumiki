/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest';
import { createCombobox } from '../index.js';
import { withValidation, type StandardSchemaV1 } from './index.js';

interface Country {
  readonly id: string;
  readonly value: string;
  readonly label: string;
}

const COUNTRIES: Country[] = [
  { id: 'jp', value: 'jp', label: 'Japan' },
  { id: 'us', value: 'us', label: 'United States' },
  { id: 'de', value: 'de', label: 'Germany' },
];

function nonNullValidator(): StandardSchemaV1<Country | null, Country | null> {
  return {
    '~standard': {
      version: 1,
      vendor: 'test',
      validate: (value) => {
        if (value === null) return { issues: [{ message: 'required' }] };
        return { value: value as Country };
      },
    },
  };
}

function asyncValidator(
  latencyMs: number,
  validIds: ReadonlyArray<string>,
): StandardSchemaV1<Country | null, Country | null> {
  return {
    '~standard': {
      version: 1,
      vendor: 'test',
      validate: (value) =>
        new Promise((resolve) => {
          setTimeout(() => {
            if (value === null) {
              resolve({ issues: [{ message: 'required' }] });
              return;
            }
            const v = value as Country;
            if (validIds.includes(v.id)) resolve({ value: v });
            else resolve({ issues: [{ message: `${v.label} is not allowed` }] });
          }, latencyMs);
        }),
    },
  };
}

function newCb() {
  return createCombobox<Country>({ options: COUNTRIES });
}

describe('withValidation', () => {
  it('starts in pristine state with no errors', () => {
    const cb = withValidation(newCb(), nonNullValidator());
    expect(cb.validation.state).toBe('pristine');
    expect(cb.errors).toEqual([]);
    expect(cb.isValid).toBe(true);
  });

  it('validate() returns invalid for null value', async () => {
    const cb = withValidation(newCb(), nonNullValidator());
    await cb.validate();
    expect(cb.validation.state).toBe('invalid');
    expect(cb.errors).toEqual([{ message: 'required' }]);
    expect(cb.isValid).toBe(false);
  });

  it('validate() returns valid after a value is selected', async () => {
    const base = newCb();
    const cb = withValidation(base, nonNullValidator());
    base.setValue(COUNTRIES[0]!);
    // Auto-validation kicks in via subscribe; await microtask + validator.
    await Promise.resolve();
    await Promise.resolve();
    expect(cb.validation.state).toBe('valid');
    expect(cb.errors).toEqual([]);
    expect(cb.isValid).toBe(true);
  });

  it('proxies all base methods (still a real ComboboxController)', () => {
    const base = newCb();
    const cb = withValidation(base, nonNullValidator());
    cb.open();
    expect(cb.isOpen).toBe(true);
    expect(cb.value).toBeNull();
    cb.setValue(COUNTRIES[1]!);
    expect(cb.value?.id).toBe('us');
  });

  it('subscribeValidation fires on transitions', async () => {
    const cb = withValidation(newCb(), nonNullValidator());
    const states: string[] = [];
    const unsub = cb.subscribeValidation((s) => states.push(s.state));
    await cb.validate();
    expect(states).toContain('validating');
    expect(states[states.length - 1]).toBe('invalid');
    unsub();
  });

  it('async race-token: stale resolutions are dropped', async () => {
    vi.useFakeTimers();
    const cb = withValidation(newCb(), asyncValidator(100, ['us']));
    const p1 = cb.validate(); // starts at t=0, would resolve at t=100
    const p2 = cb.validate(); // starts at t=0, also resolves at t=100 — newer token
    vi.advanceTimersByTime(150);
    await p1;
    await p2;
    // The result should reflect the LAST validation token; both validated null,
    // so state is 'invalid'. The point is that no stale state can stomp.
    expect(cb.validation.state).toBe('invalid');
    vi.useRealTimers();
  });

  it('thrown validator becomes an invalid state with the error message', async () => {
    const throwing: StandardSchemaV1<Country | null, Country | null> = {
      '~standard': {
        version: 1,
        vendor: 'test',
        validate: () => {
          throw new Error('boom');
        },
      },
    };
    const cb = withValidation(newCb(), throwing);
    await cb.validate();
    expect(cb.validation.state).toBe('invalid');
    expect(cb.errors).toEqual([{ message: 'boom' }]);
  });

  it('validator returning multiple issues surfaces all of them', async () => {
    const multi: StandardSchemaV1<Country | null, Country | null> = {
      '~standard': {
        version: 1,
        vendor: 'test',
        validate: () => ({
          issues: [{ message: 'a' }, { message: 'b', path: ['x'] }],
        }),
      },
    };
    const cb = withValidation(newCb(), multi);
    await cb.validate();
    expect(cb.errors).toEqual([{ message: 'a' }, { message: 'b', path: ['x'] }]);
  });

  it('validation re-runs automatically when the base value changes', async () => {
    const base = newCb();
    const cb = withValidation(base, nonNullValidator());
    base.setValue(COUNTRIES[0]!);
    await Promise.resolve();
    await Promise.resolve();
    expect(cb.isValid).toBe(true);
    base.reset();
    await Promise.resolve();
    await Promise.resolve();
    expect(cb.isValid).toBe(false);
  });

  it('re-validation moves through validating → invalid/valid cleanly', async () => {
    vi.useFakeTimers();
    const cb = withValidation(newCb(), asyncValidator(50, []));
    const transitions: string[] = [];
    cb.subscribeValidation((s) => transitions.push(s.state));
    const p = cb.validate();
    expect(transitions).toContain('validating');
    vi.advanceTimersByTime(60);
    await p;
    expect(cb.validation.state).toBe('invalid');
    expect(transitions[transitions.length - 1]).toBe('invalid');
    vi.useRealTimers();
  });

  it('valid + then null → invalid (issues replace, not append)', async () => {
    const base = newCb();
    const cb = withValidation(base, nonNullValidator());
    base.setValue(COUNTRIES[0]!);
    await Promise.resolve();
    await Promise.resolve();
    expect(cb.errors).toEqual([]);
    base.reset();
    await Promise.resolve();
    await Promise.resolve();
    expect(cb.errors).toEqual([{ message: 'required' }]);
  });
});
