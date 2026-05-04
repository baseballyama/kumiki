// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createFormField, type StandardSchemaV1 } from './index.ts';

function makeNonEmptyValidator(): StandardSchemaV1<string, string> {
  return {
    '~standard': {
      version: 1,
      vendor: 'kumiki-test',
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.length === 0) {
          return { issues: [{ message: 'Required' }] };
        }
        return { value };
      },
    },
  };
}

function makeAsyncValidator(latencyMs = 50): StandardSchemaV1<string, string> {
  return {
    '~standard': {
      version: 1,
      vendor: 'kumiki-test-async',
      validate: (value: unknown) =>
        new Promise((resolve) => {
          setTimeout(() => {
            if (typeof value === 'string' && value.includes('@')) {
              resolve({ value });
            } else {
              resolve({ issues: [{ message: 'Must include @' }] });
            }
          }, latencyMs);
        }),
    },
  };
}

describe('createFormField attachment', () => {
  let label: HTMLLabelElement;
  let input: HTMLInputElement;
  let errors: HTMLDivElement;
  let teardowns: Array<() => void>;

  beforeEach(() => {
    vi.useFakeTimers();
    label = document.createElement('label');
    label.textContent = 'Email';
    document.body.appendChild(label);
    input = document.createElement('input');
    document.body.appendChild(input);
    errors = document.createElement('div');
    document.body.appendChild(errors);
    teardowns = [];
  });

  afterEach(() => {
    for (const t of teardowns) t();
    label.remove();
    input.remove();
    errors.remove();
    vi.useRealTimers();
  });

  function attachAll(f: ReturnType<typeof createFormField<string>>): void {
    teardowns.push(f.label(label) || (() => {}));
    teardowns.push(f.input(input) || (() => {}));
    teardowns.push(f.errors(errors) || (() => {}));
  }

  it('initializes ARIA on input + ties label via for/id', () => {
    const f = createFormField<string>({ initialValue: '' });
    attachAll(f);
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.getAttribute('id')).toBe(f.inputId);
    expect(label.getAttribute('for')).toBe(f.inputId);
  });

  it('typing in input dispatches INPUT and updates value', () => {
    const f = createFormField<string>({ initialValue: '' });
    attachAll(f);
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    expect(f.value).toBe('hello');
    expect(f.dirty).toBe(true);
    expect(input.hasAttribute('data-dirty')).toBe(true);
  });

  it('blur from pristine touches without leaving pristine', () => {
    const f = createFormField<string>({ initialValue: '' });
    attachAll(f);
    input.dispatchEvent(new Event('blur'));
    expect(f.touched).toBe(true);
    expect(f.state).toBe('pristine');
  });

  it('blur after typing with no validator resolves to valid', async () => {
    const f = createFormField<string>({ initialValue: '' });
    attachAll(f);
    input.value = 'a';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await vi.runAllTimersAsync();
    expect(f.state).toBe('valid');
  });

  it('sync validator: blur after typing empty value → invalid + aria-invalid=true', async () => {
    const f = createFormField<string>({
      initialValue: '',
      validator: makeNonEmptyValidator(),
    });
    attachAll(f);
    // Touch the field then blur with empty value.
    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));
    await vi.runAllTimersAsync();
    expect(f.state).toBe('invalid');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(f.context.errors[0]?.message).toBe('Required');
  });

  it('errors element renders message text + aria-live=polite + role=alert', async () => {
    const f = createFormField<string>({
      initialValue: '',
      validator: makeNonEmptyValidator(),
    });
    attachAll(f);
    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));
    await vi.runAllTimersAsync();
    expect(errors.textContent).toBe('Required');
    expect(errors.getAttribute('role')).toBe('alert');
    expect(errors.getAttribute('aria-live')).toBe('polite');
    expect(errors.hasAttribute('hidden')).toBe(false);
  });

  it('aria-describedby points at errors when invalid', async () => {
    const f = createFormField<string>({
      initialValue: '',
      validator: makeNonEmptyValidator(),
    });
    attachAll(f);
    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));
    await vi.runAllTimersAsync();
    const desc = input.getAttribute('aria-describedby');
    expect(desc).toContain(f.errorsId);
  });

  it('typing again clears errors via INPUT', async () => {
    const f = createFormField<string>({
      initialValue: '',
      validator: makeNonEmptyValidator(),
    });
    attachAll(f);
    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));
    await vi.runAllTimersAsync();
    expect(f.state).toBe('invalid');
    input.value = 'a';
    input.dispatchEvent(new Event('input'));
    expect(f.state).toBe('editing');
    expect(f.context.errors).toEqual([]);
  });

  it('async validator: stale resolve is dropped when user keeps typing', async () => {
    const f = createFormField<string>({
      initialValue: '',
      validator: makeAsyncValidator(50),
    });
    attachAll(f);
    input.value = 'oops';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    // While the async validator's 50 ms timer is running, the user keeps typing.
    vi.advanceTimersByTime(20);
    input.value = 'oops@example.com';
    input.dispatchEvent(new Event('input'));
    // Now let the original (stale) promise resolve.
    await vi.advanceTimersByTimeAsync(40);
    // Stale token → resolution dropped → state stays editing.
    expect(f.state).toBe('editing');
    expect(f.context.errors).toEqual([]);
  });

  it('async validator: fresh resolve transitions to valid', async () => {
    const f = createFormField<string>({
      initialValue: 'a@b.com',
      validator: makeAsyncValidator(20),
    });
    attachAll(f);
    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));
    expect(f.state).toBe('validating');
    await vi.advanceTimersByTimeAsync(25);
    expect(f.state).toBe('valid');
  });

  it('controller.validate() runs validation regardless of state', async () => {
    const f = createFormField<string>({
      initialValue: '',
      validator: makeNonEmptyValidator(),
    });
    attachAll(f);
    await f.validate();
    expect(f.state).toBe('invalid');
  });

  it('reset restores initialValue + clears errors + writes DOM', async () => {
    const f = createFormField<string>({
      initialValue: 'hello',
      validator: makeNonEmptyValidator(),
    });
    attachAll(f);
    input.dispatchEvent(new Event('focus'));
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await vi.runAllTimersAsync();
    expect(f.state).toBe('invalid');
    f.reset();
    expect(f.state).toBe('pristine');
    expect(input.value).toBe('hello');
  });

  it('validateOn: change → INPUT triggers validation', async () => {
    const f = createFormField<string>({
      initialValue: '',
      validator: makeNonEmptyValidator(),
      validateOn: 'change',
    });
    attachAll(f);
    input.value = '';
    input.dispatchEvent(new Event('input'));
    await vi.runAllTimersAsync();
    // input value is empty → invalid
    expect(f.state).toBe('invalid');
  });

  it('teardown removes listeners and unsub paint', () => {
    const f = createFormField<string>({ initialValue: '' });
    attachAll(f);
    for (const t of teardowns) t();
    teardowns = [];
    input.value = 'after';
    input.dispatchEvent(new Event('input'));
    expect(f.value).toBe(''); // listener detached
  });
});
