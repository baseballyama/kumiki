import { describe, expect, it } from 'vitest';
import { createToastMachine } from './index.js';

describe('createToastMachine', () => {
  it('starts with empty queue', () => {
    const m = createToastMachine();
    expect(m.context.toasts).toEqual([]);
    expect(m.context.max).toBe(5);
    expect(m.context.defaultDuration).toBe(5000);
    expect(m.state).toBe('idle');
  });

  it('honors custom max and defaultDuration', () => {
    const m = createToastMachine({ max: 3, defaultDuration: 2000 });
    expect(m.context.max).toBe(3);
    expect(m.context.defaultDuration).toBe(2000);
  });

  it('seeds initial toasts up to max', () => {
    const initial = [
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B' },
      { id: 'c', title: 'C' },
    ];
    const m = createToastMachine({ max: 2, initial });
    expect(m.context.toasts.map((t) => t.id)).toEqual(['b', 'c']);
  });

  it('ADD appends a toast with default duration applied', () => {
    const m = createToastMachine({ defaultDuration: 3000 });
    m.send({ type: 'ADD', toast: { id: 'x', title: 'Saved' } });
    expect(m.context.toasts).toHaveLength(1);
    const t = m.context.toasts[0];
    expect(t?.id).toBe('x');
    expect(t?.duration).toBe(3000);
  });

  it('ADD respects an explicit duration on the incoming toast', () => {
    const m = createToastMachine();
    m.send({ type: 'ADD', toast: { id: 'sticky', title: 'Update', duration: -1 } });
    expect(m.context.toasts[0]?.duration).toBe(-1);
  });

  it('ADD with an existing id replaces the prior toast (idempotent)', () => {
    const m = createToastMachine();
    m.send({ type: 'ADD', toast: { id: 'x', title: 'A' } });
    m.send({ type: 'ADD', toast: { id: 'x', title: 'A2' } });
    expect(m.context.toasts).toHaveLength(1);
    expect(m.context.toasts[0]?.title).toBe('A2');
  });

  it('ADD trims the front when exceeding max', () => {
    const m = createToastMachine({ max: 2 });
    m.send({ type: 'ADD', toast: { id: 'a', title: 'A' } });
    m.send({ type: 'ADD', toast: { id: 'b', title: 'B' } });
    m.send({ type: 'ADD', toast: { id: 'c', title: 'C' } });
    expect(m.context.toasts.map((t) => t.id)).toEqual(['b', 'c']);
  });

  it('REMOVE drops by id', () => {
    const m = createToastMachine();
    m.send({ type: 'ADD', toast: { id: 'a', title: 'A' } });
    m.send({ type: 'ADD', toast: { id: 'b', title: 'B' } });
    m.send({ type: 'REMOVE', id: 'a' });
    expect(m.context.toasts.map((t) => t.id)).toEqual(['b']);
  });

  it('REMOVE with unknown id is a no-op', () => {
    const m = createToastMachine();
    m.send({ type: 'ADD', toast: { id: 'a', title: 'A' } });
    m.send({ type: 'REMOVE', id: 'nope' });
    expect(m.context.toasts.map((t) => t.id)).toEqual(['a']);
  });

  it('UPDATE patches fields without changing id', () => {
    const m = createToastMachine();
    m.send({ type: 'ADD', toast: { id: 'a', title: 'A' } });
    m.send({ type: 'UPDATE', id: 'a', patch: { title: 'A2', duration: 1000 } });
    expect(m.context.toasts[0]).toMatchObject({ id: 'a', title: 'A2', duration: 1000 });
  });

  it('UPDATE with unknown id is a no-op', () => {
    const m = createToastMachine();
    m.send({ type: 'ADD', toast: { id: 'a', title: 'A' } });
    m.send({ type: 'UPDATE', id: 'nope', patch: { title: '!' } });
    expect(m.context.toasts[0]?.title).toBe('A');
  });

  it('CLEAR empties the queue', () => {
    const m = createToastMachine();
    m.send({ type: 'ADD', toast: { id: 'a', title: 'A' } });
    m.send({ type: 'ADD', toast: { id: 'b', title: 'B' } });
    m.send({ type: 'CLEAR' });
    expect(m.context.toasts).toEqual([]);
  });

  it('CLEAR on empty queue leaves toasts empty', () => {
    const m = createToastMachine();
    m.send({ type: 'CLEAR' });
    expect(m.context.toasts).toEqual([]);
  });

  it('SET.MAX trims existing toasts to the new size', () => {
    const m = createToastMachine();
    m.send({ type: 'ADD', toast: { id: 'a', title: 'A' } });
    m.send({ type: 'ADD', toast: { id: 'b', title: 'B' } });
    m.send({ type: 'ADD', toast: { id: 'c', title: 'C' } });
    m.send({ type: 'SET.MAX', value: 2 });
    expect(m.context.max).toBe(2);
    expect(m.context.toasts.map((t) => t.id)).toEqual(['b', 'c']);
  });

  it('Infinity max disables trim', () => {
    const m = createToastMachine({ max: Number.POSITIVE_INFINITY });
    for (let i = 0; i < 50; i++) {
      m.send({ type: 'ADD', toast: { id: String(i), title: '' } });
    }
    expect(m.context.toasts).toHaveLength(50);
  });

  it('preserves item meta untouched', () => {
    const m = createToastMachine();
    m.send({
      type: 'ADD',
      toast: { id: 'x', title: 't', meta: { actionLabel: 'Undo' } },
    });
    expect(m.context.toasts[0]?.meta?.actionLabel).toBe('Undo');
  });

  it('preserves type and politeness fields', () => {
    const m = createToastMachine();
    m.send({
      type: 'ADD',
      toast: { id: 'e', title: 'Failed', type: 'error', politeness: 'assertive' },
    });
    expect(m.context.toasts[0]?.type).toBe('error');
    expect(m.context.toasts[0]?.politeness).toBe('assertive');
  });

  it('subscribe fires on every queue mutation', () => {
    const m = createToastMachine();
    let calls = 0;
    const unsub = m.subscribe(() => calls++);
    m.send({ type: 'ADD', toast: { id: 'a', title: 'A' } });
    m.send({ type: 'UPDATE', id: 'a', patch: { title: 'A2' } });
    m.send({ type: 'REMOVE', id: 'a' });
    expect(calls).toBeGreaterThanOrEqual(3);
    unsub();
  });

  it('toJSON serializes XState-compatible config', () => {
    const m = createToastMachine();
    const json = m.toJSON();
    expect(json.id).toBe('toast');
    expect(json.initial).toBe('idle');
    expect(json.states.idle.on).toHaveProperty('ADD');
    expect(json.states.idle.on).toHaveProperty('REMOVE');
  });
});
