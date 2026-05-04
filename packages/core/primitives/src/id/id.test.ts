import { describe, it, expect } from 'vitest';
import { uid, createIdScope } from './index.ts';

describe('uid', () => {
  it('generates a unique id', () => {
    const a = uid();
    const b = uid();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^kumiki-/);
  });

  it('respects a custom scope (always prefixed with `kumiki-`)', () => {
    const id = uid('test');
    expect(id).toMatch(/^kumiki-test-/);
  });
});

describe('createIdScope', () => {
  it('produces sequential ids', () => {
    const scope = createIdScope('dialog');
    expect(scope.next()).toBe('kumiki-dialog-1');
    expect(scope.next()).toBe('kumiki-dialog-2');
    expect(scope.next('title')).toBe('kumiki-dialog-3-title');
  });

  it('separate scopes are independent', () => {
    const a = createIdScope('a');
    const b = createIdScope('b');
    a.next();
    a.next();
    expect(b.next()).toBe('kumiki-b-1');
  });
});
