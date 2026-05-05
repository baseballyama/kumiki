import { describe, it, expect } from 'vitest';
import { createComboboxMachine, type ComboboxOption } from './index.ts';

interface User extends ComboboxOption {
  id: string;
  label: string;
  age: number;
}

const users: User[] = [
  { id: '1', label: 'Alice', age: 30 },
  { id: '2', label: 'Bob', age: 25 },
  { id: '3', label: 'Carol', age: 40 },
  { id: '4', label: 'Dan', age: 35 },
  { id: '5', label: 'Eve', age: 28 },
];

describe('combobox machine', () => {
  describe('initial state', () => {
    it('starts idle with default context', () => {
      const m = createComboboxMachine<User>({ options: users });
      expect(m.state).toBe('idle');
      expect(m.context.query).toBe('');
      expect(m.context.options).toEqual(users);
      expect(m.context.filtered).toEqual(users);
      expect(m.context.highlightedId).toBe(null);
      expect(m.context.value).toBe(null);
      expect(m.context.status).toBe('idle');
      expect(m.context.token).toBe(0);
    });

    it('respects defaultQuery', () => {
      const m = createComboboxMachine<User>({ options: users, defaultQuery: 'al' });
      expect(m.context.query).toBe('al');
      expect(m.context.filtered).toEqual([users[0]]);
    });

    it('respects defaultValue', () => {
      const m = createComboboxMachine<User>({ options: users, defaultValue: users[2]! });
      expect(m.context.value).toBe(users[2]);
    });

    it('starts disabled when disabled=true', () => {
      const m = createComboboxMachine<User>({ options: users, disabled: true });
      expect(m.state).toBe('disabled');
    });
  });

  describe('opening / closing', () => {
    it('INPUT.FOCUS opens', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.FOCUS' });
      expect(m.state).toBe('open');
    });

    it('INPUT.BLUR closes', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.FOCUS' });
      m.send({ type: 'INPUT.BLUR' });
      expect(m.state).toBe('idle');
    });

    it('TRIGGER.CLICK toggles open/closed', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'TRIGGER.CLICK' });
      expect(m.state).toBe('open');
      m.send({ type: 'TRIGGER.CLICK' });
      expect(m.state).toBe('idle');
    });

    it('OPEN / CLOSE explicit transitions', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'OPEN' });
      expect(m.state).toBe('open');
      m.send({ type: 'CLOSE' });
      expect(m.state).toBe('idle');
    });
  });

  describe('filtering', () => {
    it('INPUT.CHANGE opens and filters', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.CHANGE', value: 'al' });
      expect(m.state).toBe('open');
      expect(m.context.query).toBe('al');
      expect(m.context.filtered).toEqual([users[0]]);
    });

    it('case-insensitive substring by default', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.CHANGE', value: 'A' });
      // Alice, Carol (contains 'a'), Dan (contains 'a')
      const ids = m.context.filtered.map((o) => o.id);
      expect(ids).toEqual(['1', '3', '4']);
    });

    it('empty query restores full list', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.CHANGE', value: 'al' });
      m.send({ type: 'INPUT.CHANGE', value: '' });
      expect(m.context.filtered).toEqual(users);
    });

    it('custom filter is honored', () => {
      const m = createComboboxMachine<User>({
        options: users,
        filter: (opts, q) => (q === 'old' ? opts.filter((o) => o.age >= 30) : opts),
      });
      m.send({ type: 'INPUT.CHANGE', value: 'old' });
      const ids = m.context.filtered.map((o) => o.id);
      expect(ids).toEqual(['1', '3', '4']);
    });

    it('token increments on every INPUT.CHANGE', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.CHANGE', value: 'a' });
      const t1 = m.context.token;
      m.send({ type: 'INPUT.CHANGE', value: 'al' });
      expect(m.context.token).toBe(t1 + 1);
    });

    it('clears highlight on filter change', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.FOCUS' });
      m.send({ type: 'INPUT.NAVIGATE', direction: 'first' });
      expect(m.context.highlightedId).toBe('1');
      m.send({ type: 'INPUT.CHANGE', value: 'X' });
      expect(m.context.highlightedId).toBe(null);
    });
  });

  describe('keyboard navigation', () => {
    it('first / last', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.FOCUS' });
      m.send({ type: 'INPUT.NAVIGATE', direction: 'first' });
      expect(m.context.highlightedId).toBe('1');
      m.send({ type: 'INPUT.NAVIGATE', direction: 'last' });
      expect(m.context.highlightedId).toBe('5');
    });

    it('next / prev with wrap', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.FOCUS' });
      m.send({ type: 'INPUT.NAVIGATE', direction: 'next' });
      expect(m.context.highlightedId).toBe('1');
      m.send({ type: 'INPUT.NAVIGATE', direction: 'next' });
      expect(m.context.highlightedId).toBe('2');
      m.send({ type: 'INPUT.NAVIGATE', direction: 'prev' });
      expect(m.context.highlightedId).toBe('1');
      m.send({ type: 'INPUT.NAVIGATE', direction: 'prev' });
      // wraps to last
      expect(m.context.highlightedId).toBe('5');
    });

    it('page-next / page-prev clamp (no wrap)', () => {
      const m = createComboboxMachine<User>({ options: users, pageSize: 3 });
      m.send({ type: 'INPUT.FOCUS' });
      m.send({ type: 'INPUT.NAVIGATE', direction: 'first' });
      m.send({ type: 'INPUT.NAVIGATE', direction: 'page-next' });
      expect(m.context.highlightedId).toBe('4');
      m.send({ type: 'INPUT.NAVIGATE', direction: 'page-next' });
      // clamps to last (index 4)
      expect(m.context.highlightedId).toBe('5');
      m.send({ type: 'INPUT.NAVIGATE', direction: 'page-prev' });
      // clamps backwards
      expect(m.context.highlightedId).toBe('2');
    });

    it('opens on first NAVIGATE from idle', () => {
      const m = createComboboxMachine<User>({ options: users });
      expect(m.state).toBe('idle');
      m.send({ type: 'INPUT.NAVIGATE', direction: 'first' });
      expect(m.state).toBe('open');
      expect(m.context.highlightedId).toBe('1');
    });

    it('skips disabled options during arrow navigation', () => {
      const opts: User[] = [
        { id: '1', label: 'A', age: 1 },
        { id: '2', label: 'B', age: 2, disabled: true },
        { id: '3', label: 'C', age: 3 },
      ];
      const m = createComboboxMachine<User>({ options: opts });
      m.send({ type: 'INPUT.FOCUS' });
      m.send({ type: 'INPUT.NAVIGATE', direction: 'next' });
      expect(m.context.highlightedId).toBe('1');
      m.send({ type: 'INPUT.NAVIGATE', direction: 'next' });
      expect(m.context.highlightedId).toBe('3');
    });

    it('highlight is null when filtered is empty', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.CHANGE', value: 'zzz' });
      m.send({ type: 'INPUT.NAVIGATE', direction: 'first' });
      expect(m.context.highlightedId).toBe(null);
    });
  });

  describe('selection', () => {
    it('OPTION.SELECT commits and closes', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.FOCUS' });
      m.send({ type: 'OPTION.SELECT', option: users[2]! });
      expect(m.state).toBe('idle');
      expect(m.context.value).toEqual(users[2]);
      expect(m.context.query).toBe('Carol');
    });

    it('INPUT.ENTER commits highlighted option', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.FOCUS' });
      m.send({ type: 'INPUT.NAVIGATE', direction: 'first' });
      m.send({ type: 'INPUT.NAVIGATE', direction: 'next' });
      m.send({ type: 'INPUT.ENTER' });
      expect(m.state).toBe('idle');
      expect(m.context.value).toEqual(users[1]);
      expect(m.context.query).toBe('Bob');
    });

    it('INPUT.ENTER without highlight is no-op', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.FOCUS' });
      m.send({ type: 'INPUT.ENTER' });
      // Stays open because the guard rejects the transition.
      expect(m.state).toBe('open');
      expect(m.context.value).toBe(null);
    });

    it('OPTION.HIGHLIGHT updates highlightedId without closing', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.FOCUS' });
      m.send({ type: 'OPTION.HIGHLIGHT', id: '4' });
      expect(m.state).toBe('open');
      expect(m.context.highlightedId).toBe('4');
    });
  });

  describe('escape behaviour', () => {
    it('INPUT.ESCAPE from open closes and clears highlight', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.FOCUS' });
      m.send({ type: 'INPUT.NAVIGATE', direction: 'first' });
      m.send({ type: 'INPUT.ESCAPE' });
      expect(m.state).toBe('idle');
      expect(m.context.highlightedId).toBe(null);
    });
  });

  describe('async race tokens', () => {
    it('FETCH.LOADING sets status to loading when token matches', () => {
      const m = createComboboxMachine<User>({ options: [] });
      m.send({ type: 'INPUT.CHANGE', value: 'al' });
      const t = m.context.token;
      m.send({ type: 'FETCH.LOADING', token: t });
      expect(m.context.status).toBe('loading');
    });

    it('FETCH.RESOLVE with matching token updates options', () => {
      const m = createComboboxMachine<User>({ options: [] });
      m.send({ type: 'INPUT.CHANGE', value: 'al' });
      const t = m.context.token;
      m.send({ type: 'FETCH.RESOLVE', options: [users[0]!], token: t });
      expect(m.context.options).toEqual([users[0]]);
      expect(m.context.filtered).toEqual([users[0]]);
      expect(m.context.status).toBe('idle');
    });

    it('FETCH.RESOLVE with stale token is dropped', () => {
      const m = createComboboxMachine<User>({ options: [] });
      m.send({ type: 'INPUT.CHANGE', value: 'al' });
      const stale = m.context.token;
      m.send({ type: 'INPUT.CHANGE', value: 'ali' }); // bump token
      m.send({ type: 'FETCH.RESOLVE', options: [users[0]!], token: stale });
      // Stale resolution does not populate options.
      expect(m.context.options).toEqual([]);
    });

    it('FETCH.REJECT with matching token sets error', () => {
      const m = createComboboxMachine<User>({ options: [] });
      m.send({ type: 'INPUT.CHANGE', value: 'al' });
      const t = m.context.token;
      const err = new Error('boom');
      m.send({ type: 'FETCH.REJECT', error: err, token: t });
      expect(m.context.status).toBe('error');
      expect(m.context.error).toBe(err);
    });

    it('FETCH.REJECT with stale token is dropped', () => {
      const m = createComboboxMachine<User>({ options: [] });
      m.send({ type: 'INPUT.CHANGE', value: 'al' });
      const stale = m.context.token;
      m.send({ type: 'INPUT.CHANGE', value: 'ali' });
      m.send({ type: 'FETCH.REJECT', error: new Error('stale'), token: stale });
      expect(m.context.status).toBe('idle');
      expect(m.context.error).toBe(null);
    });
  });

  describe('reset / disable', () => {
    it('RESET clears state', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'INPUT.CHANGE', value: 'al' });
      m.send({ type: 'OPTION.SELECT', option: users[0]! });
      m.send({ type: 'RESET' });
      expect(m.context.query).toBe('');
      expect(m.context.value).toBe(null);
      expect(m.context.filtered).toEqual(users);
    });

    it('DISABLE / ENABLE', () => {
      const m = createComboboxMachine<User>({ options: users });
      m.send({ type: 'DISABLE' });
      expect(m.state).toBe('disabled');
      // disabled drops events
      m.send({ type: 'INPUT.FOCUS' });
      expect(m.state).toBe('disabled');
      m.send({ type: 'ENABLE' });
      expect(m.state).toBe('idle');
    });
  });

  describe('XState JSON export', () => {
    it('exports a stately.ai-compatible config', () => {
      const m = createComboboxMachine<User>({ options: users });
      const json = m.toJSON();
      expect(json.id).toBe('combobox');
      expect(Object.keys(json.states).sort()).toEqual(['disabled', 'idle', 'open']);
      expect(json.states.idle?.on?.['INPUT.FOCUS']).toEqual({ target: 'open' });
    });
  });
});
