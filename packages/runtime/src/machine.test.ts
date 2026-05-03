import { describe, it, expect, vi } from 'vitest';
import { defineMachine } from './machine.ts';
import type { Snapshot } from './types.ts';

type ToggleEvent = { type: 'TOGGLE' } | { type: 'SET'; pressed: boolean };
type ToggleContext = { pressed: boolean; toggles: number };
type ToggleState = 'unpressed' | 'pressed';

const createToggle = defineMachine<ToggleContext, ToggleEvent, ToggleState>({
  id: 'toggle',
  initial: 'unpressed',
  context: { pressed: false, toggles: 0 },
  states: {
    unpressed: {
      on: {
        TOGGLE: {
          target: 'pressed',
          actions: [
            { type: 'press', exec: (ctx) => ({ pressed: true, toggles: ctx.toggles + 1 }) },
          ],
        },
        SET: {
          target: 'pressed',
          cond: (_, e) => e.type === 'SET' && e.pressed === true,
          actions: [{ type: 'press', exec: () => ({ pressed: true }) }],
        },
      },
    },
    pressed: {
      on: {
        TOGGLE: {
          target: 'unpressed',
          actions: [
            { type: 'release', exec: (ctx) => ({ pressed: false, toggles: ctx.toggles + 1 }) },
          ],
        },
        SET: {
          target: 'unpressed',
          cond: (_, e) => e.type === 'SET' && e.pressed === false,
          actions: [{ type: 'release', exec: () => ({ pressed: false }) }],
        },
      },
    },
  },
});

describe('defineMachine', () => {
  it('starts in initial state with initial context', () => {
    const m = createToggle();
    expect(m.state).toBe('unpressed');
    expect(m.context).toEqual({ pressed: false, toggles: 0 });
  });

  it('overrides context via initial input', () => {
    const m = createToggle({ context: { pressed: true, toggles: 5 } });
    expect(m.context).toEqual({ pressed: true, toggles: 5 });
  });

  it('overrides state via initial input', () => {
    const m = createToggle({ state: 'pressed' });
    expect(m.state).toBe('pressed');
  });

  it('TOGGLE transitions and runs the action', () => {
    const m = createToggle();
    m.send({ type: 'TOGGLE' });
    expect(m.state).toBe('pressed');
    expect(m.context.pressed).toBe(true);
    expect(m.context.toggles).toBe(1);
  });

  it('TOGGLE round-trips', () => {
    const m = createToggle();
    m.send({ type: 'TOGGLE' });
    m.send({ type: 'TOGGLE' });
    expect(m.state).toBe('unpressed');
    expect(m.context.pressed).toBe(false);
    expect(m.context.toggles).toBe(2);
  });

  it('respects guards: SET with non-matching predicate is dropped', () => {
    const m = createToggle();
    // already unpressed; SET pressed:false would target 'unpressed' from 'pressed'
    // but we are unpressed and the unpressed handler only fires SET if pressed===true.
    m.send({ type: 'SET', pressed: false });
    expect(m.state).toBe('unpressed');
    expect(m.context.pressed).toBe(false);
  });

  it('respects guards: SET with matching predicate transitions', () => {
    const m = createToggle();
    m.send({ type: 'SET', pressed: true });
    expect(m.state).toBe('pressed');
    expect(m.context.pressed).toBe(true);
  });

  it('subscribe fires immediately and on transitions', () => {
    const m = createToggle();
    const fn = vi.fn();
    m.subscribe(fn);
    expect(fn).toHaveBeenCalledTimes(1); // immediate snapshot
    m.send({ type: 'TOGGLE' });
    expect(fn).toHaveBeenCalledTimes(2);
    m.send({ type: 'TOGGLE' });
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('unsubscribe stops receiving updates', () => {
    const m = createToggle();
    const fn = vi.fn();
    const unsub = m.subscribe(fn);
    fn.mockClear();
    unsub();
    m.send({ type: 'TOGGLE' });
    expect(fn).not.toHaveBeenCalled();
  });

  it('unknown events are no-ops', () => {
    const m = createToggle();
    const fn = vi.fn();
    m.subscribe(fn);
    fn.mockClear();
    // @ts-expect-error — testing runtime behavior on bad event
    m.send({ type: 'UNKNOWN' });
    expect(m.state).toBe('unpressed');
    expect(fn).not.toHaveBeenCalled();
  });

  it('toJSON produces an XState-compatible config', () => {
    const m = createToggle();
    const json = m.toJSON();
    expect(json.id).toBe('toggle');
    expect(json.initial).toBe('unpressed');
    expect(Object.keys(json.states).sort()).toEqual(['pressed', 'unpressed']);
    expect(json.states.unpressed?.on?.TOGGLE).toEqual({
      target: 'pressed',
      actions: ['press'],
    });
    expect(json.states.pressed?.on?.TOGGLE).toEqual({
      target: 'unpressed',
      actions: ['release'],
    });
  });

  it('throws on a transition targeting an unknown state', () => {
    expect(() =>
      defineMachine<{ x: number }, { type: 'GO' }, 'a'>({
        id: 'broken',
        initial: 'a',
        context: { x: 0 },
        states: {
          // @ts-expect-error — testing runtime check on bad target
          a: { on: { GO: { target: 'nowhere' } } },
        },
      }),
    ).toThrow(/unknown state "nowhere"/);
  });

  it('runs entry actions on transition', () => {
    const machine = defineMachine<{ count: number }, { type: 'GO' }, 'a' | 'b'>({
      id: 'entry',
      initial: 'a',
      context: { count: 0 },
      states: {
        a: { on: { GO: { target: 'b' } } },
        b: { entry: [{ type: 'inc', exec: (ctx) => ({ count: ctx.count + 10 }) }] },
      },
    })();
    machine.send({ type: 'GO' });
    expect(machine.state).toBe('b');
    expect(machine.context.count).toBe(10);
  });

  it('runs exit actions on transition', () => {
    const machine = defineMachine<{ count: number }, { type: 'GO' }, 'a' | 'b'>({
      id: 'exit',
      initial: 'a',
      context: { count: 0 },
      states: {
        a: {
          exit: [{ type: 'inc', exec: (ctx) => ({ count: ctx.count + 5 }) }],
          on: { GO: { target: 'b' } },
        },
        b: {},
      },
    })();
    machine.send({ type: 'GO' });
    expect(machine.context.count).toBe(5);
  });

  it('subscribe receives a fresh snapshot reference each emit', () => {
    const m = createToggle();
    const snapshots: Snapshot<ToggleContext, ToggleState>[] = [];
    m.subscribe((s) => snapshots.push(s));
    m.send({ type: 'TOGGLE' });
    expect(snapshots).toHaveLength(2);
    expect(snapshots[0]?.state).toBe('unpressed');
    expect(snapshots[1]?.state).toBe('pressed');
  });
});
