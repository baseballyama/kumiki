import { describe, expect, it } from 'vitest';
import { createPopoverMachine } from './index.js';

describe('createPopoverMachine', () => {
  it('starts closed by default', () => {
    const m = createPopoverMachine();
    expect(m.state).toBe('closed');
    expect(m.context.closeOnEscape).toBe(true);
    expect(m.context.closeOnOutsideClick).toBe(true);
  });

  it('honors defaultOpen', () => {
    const m = createPopoverMachine({ defaultOpen: true });
    expect(m.state).toBe('open');
  });

  it('OPEN transitions closed → open', () => {
    const m = createPopoverMachine();
    m.send({ type: 'OPEN' });
    expect(m.state).toBe('open');
  });

  it('CLOSE transitions open → closed', () => {
    const m = createPopoverMachine({ defaultOpen: true });
    m.send({ type: 'CLOSE' });
    expect(m.state).toBe('closed');
  });

  it('TOGGLE flips state', () => {
    const m = createPopoverMachine();
    m.send({ type: 'TOGGLE' });
    expect(m.state).toBe('open');
    m.send({ type: 'TOGGLE' });
    expect(m.state).toBe('closed');
  });

  it('SET.OPEN true opens from closed', () => {
    const m = createPopoverMachine();
    m.send({ type: 'SET.OPEN', open: true });
    expect(m.state).toBe('open');
  });

  it('SET.OPEN false closes from open', () => {
    const m = createPopoverMachine({ defaultOpen: true });
    m.send({ type: 'SET.OPEN', open: false });
    expect(m.state).toBe('closed');
  });

  it('SET.OPEN true is a no-op when already open', () => {
    const m = createPopoverMachine({ defaultOpen: true });
    m.send({ type: 'SET.OPEN', open: true });
    expect(m.state).toBe('open');
  });

  it('SET.OPEN false is a no-op when already closed', () => {
    const m = createPopoverMachine();
    m.send({ type: 'SET.OPEN', open: false });
    expect(m.state).toBe('closed');
  });

  it('ESCAPE closes when closeOnEscape is true', () => {
    const m = createPopoverMachine({ defaultOpen: true });
    m.send({ type: 'ESCAPE' });
    expect(m.state).toBe('closed');
  });

  it('ESCAPE is ignored when closeOnEscape is false', () => {
    const m = createPopoverMachine({ defaultOpen: true, closeOnEscape: false });
    m.send({ type: 'ESCAPE' });
    expect(m.state).toBe('open');
  });

  it('OUTSIDE_CLICK closes when closeOnOutsideClick is true', () => {
    const m = createPopoverMachine({ defaultOpen: true });
    m.send({ type: 'OUTSIDE_CLICK' });
    expect(m.state).toBe('closed');
  });

  it('OUTSIDE_CLICK is ignored when closeOnOutsideClick is false', () => {
    const m = createPopoverMachine({ defaultOpen: true, closeOnOutsideClick: false });
    m.send({ type: 'OUTSIDE_CLICK' });
    expect(m.state).toBe('open');
  });

  it('ESCAPE / OUTSIDE_CLICK in closed state are no-ops', () => {
    const m = createPopoverMachine();
    m.send({ type: 'ESCAPE' });
    m.send({ type: 'OUTSIDE_CLICK' });
    expect(m.state).toBe('closed');
  });

  it('SET.CLOSE_ON_ESCAPE updates context in either state', () => {
    const m = createPopoverMachine();
    m.send({ type: 'SET.CLOSE_ON_ESCAPE', value: false });
    expect(m.context.closeOnEscape).toBe(false);
    m.send({ type: 'OPEN' });
    m.send({ type: 'SET.CLOSE_ON_ESCAPE', value: true });
    expect(m.context.closeOnEscape).toBe(true);
  });

  it('SET.CLOSE_ON_OUTSIDE_CLICK updates context in either state', () => {
    const m = createPopoverMachine({ defaultOpen: true });
    m.send({ type: 'SET.CLOSE_ON_OUTSIDE_CLICK', value: false });
    expect(m.context.closeOnOutsideClick).toBe(false);
    m.send({ type: 'CLOSE' });
    m.send({ type: 'SET.CLOSE_ON_OUTSIDE_CLICK', value: true });
    expect(m.context.closeOnOutsideClick).toBe(true);
  });

  it('subscribe fires on transition', () => {
    const m = createPopoverMachine();
    let calls = 0;
    const unsub = m.subscribe(() => calls++);
    m.send({ type: 'OPEN' });
    m.send({ type: 'CLOSE' });
    expect(calls).toBeGreaterThanOrEqual(2);
    unsub();
  });

  it('toJSON serializes XState-compatible config', () => {
    const m = createPopoverMachine();
    const json = m.toJSON();
    expect(json.id).toBe('popover');
    expect(json.initial).toBe('closed');
    expect(json.states.closed.on).toHaveProperty('OPEN');
    expect(json.states.open.on).toHaveProperty('CLOSE');
  });
});
