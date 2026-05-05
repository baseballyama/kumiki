import { describe, expect, it } from 'vitest';
import { createNumberFieldMachine } from './index.js';

describe('createNumberFieldMachine', () => {
  it('starts with null value when no defaultValue', () => {
    const m = createNumberFieldMachine();
    expect(m.context.value).toBeNull();
    expect(m.state).toBe('idle');
  });

  it('seeds default value clamped + snapped to step grid', () => {
    const m = createNumberFieldMachine({ defaultValue: 4.7, min: 0, max: 10, step: 1 });
    expect(m.context.value).toBe(5);
  });

  it('treats explicit null defaultValue as empty', () => {
    const m = createNumberFieldMachine({ defaultValue: null, min: 0, max: 10 });
    expect(m.context.value).toBeNull();
  });

  it('starts disabled when input.disabled', () => {
    const m = createNumberFieldMachine({ disabled: true });
    expect(m.state).toBe('disabled');
  });

  it('INCREMENT seeds from min when value is null', () => {
    const m = createNumberFieldMachine({ min: 5, max: 10, step: 1 });
    m.send({ type: 'INCREMENT' });
    expect(m.context.value).toBe(6);
  });

  it('INCREMENT clamps at max', () => {
    const m = createNumberFieldMachine({ defaultValue: 9, min: 0, max: 10, step: 1 });
    m.send({ type: 'INCREMENT' });
    m.send({ type: 'INCREMENT' });
    m.send({ type: 'INCREMENT' });
    expect(m.context.value).toBe(10);
  });

  it('DECREMENT clamps at min', () => {
    const m = createNumberFieldMachine({ defaultValue: 1, min: 0, max: 10, step: 1 });
    m.send({ type: 'DECREMENT' });
    m.send({ type: 'DECREMENT' });
    m.send({ type: 'DECREMENT' });
    expect(m.context.value).toBe(0);
  });

  it('PAGE_INCREMENT uses pageStep', () => {
    const m = createNumberFieldMachine({
      defaultValue: 10,
      min: 0,
      max: 100,
      step: 1,
      pageStep: 10,
    });
    m.send({ type: 'PAGE_INCREMENT' });
    expect(m.context.value).toBe(20);
  });

  it('PAGE_DECREMENT uses pageStep', () => {
    const m = createNumberFieldMachine({
      defaultValue: 50,
      min: 0,
      max: 100,
      step: 1,
      pageStep: 25,
    });
    m.send({ type: 'PAGE_DECREMENT' });
    expect(m.context.value).toBe(25);
  });

  it('TO_MIN jumps to min when bounded', () => {
    const m = createNumberFieldMachine({ defaultValue: 50, min: 0, max: 100 });
    m.send({ type: 'TO_MIN' });
    expect(m.context.value).toBe(0);
  });

  it('TO_MAX jumps to max when bounded', () => {
    const m = createNumberFieldMachine({ defaultValue: 50, min: 0, max: 100 });
    m.send({ type: 'TO_MAX' });
    expect(m.context.value).toBe(100);
  });

  it('TO_MIN is a no-op when min is unbounded', () => {
    const m = createNumberFieldMachine({ defaultValue: 5, max: 100 });
    m.send({ type: 'TO_MIN' });
    expect(m.context.value).toBe(5);
  });

  it('TO_MAX is a no-op when max is unbounded', () => {
    const m = createNumberFieldMachine({ defaultValue: 5, min: 0 });
    m.send({ type: 'TO_MAX' });
    expect(m.context.value).toBe(5);
  });

  it('CLEAR sets value to null', () => {
    const m = createNumberFieldMachine({ defaultValue: 50 });
    m.send({ type: 'CLEAR' });
    expect(m.context.value).toBeNull();
  });

  it('SET.VALUE sets and snaps + clamps', () => {
    const m = createNumberFieldMachine({ min: 0, max: 10, step: 1 });
    m.send({ type: 'SET.VALUE', value: 7.4 });
    expect(m.context.value).toBe(7);
    m.send({ type: 'SET.VALUE', value: 25 });
    expect(m.context.value).toBe(10);
    m.send({ type: 'SET.VALUE', value: -3 });
    expect(m.context.value).toBe(0);
  });

  it('SET.VALUE accepts null to clear', () => {
    const m = createNumberFieldMachine({ defaultValue: 5 });
    m.send({ type: 'SET.VALUE', value: null });
    expect(m.context.value).toBeNull();
  });

  it('SET.MIN re-clamps existing value', () => {
    const m = createNumberFieldMachine({ defaultValue: 5, min: 0, max: 10 });
    m.send({ type: 'SET.MIN', value: 7 });
    expect(m.context.min).toBe(7);
    expect(m.context.value).toBe(7);
  });

  it('SET.MAX re-clamps existing value', () => {
    const m = createNumberFieldMachine({ defaultValue: 5, min: 0, max: 10 });
    m.send({ type: 'SET.MAX', value: 3 });
    expect(m.context.max).toBe(3);
    expect(m.context.value).toBe(3);
  });

  it('SET.STEP re-snaps existing value', () => {
    const m = createNumberFieldMachine({ defaultValue: 5, min: 0, max: 100, step: 1 });
    m.send({ type: 'SET.STEP', value: 5 });
    expect(m.context.step).toBe(5);
    expect(m.context.value).toBe(5);
  });

  it('SET.PAGE_STEP overrides pageStep without snapping', () => {
    const m = createNumberFieldMachine({ defaultValue: 5, min: 0, max: 100 });
    m.send({ type: 'SET.PAGE_STEP', value: 7 });
    expect(m.context.pageStep).toBe(7);
    expect(m.context.value).toBe(5);
  });

  it('DISABLE → ENABLE round trip', () => {
    const m = createNumberFieldMachine({ defaultValue: 5 });
    m.send({ type: 'DISABLE' });
    expect(m.state).toBe('disabled');
    m.send({ type: 'INCREMENT' });
    expect(m.context.value).toBe(5);
    m.send({ type: 'ENABLE' });
    expect(m.state).toBe('idle');
    m.send({ type: 'INCREMENT' });
    expect(m.context.value).toBe(6);
  });

  it('decimal step does not drift', () => {
    const m = createNumberFieldMachine({ defaultValue: 0, min: 0, max: 1, step: 0.1 });
    for (let i = 0; i < 10; i++) m.send({ type: 'INCREMENT' });
    expect(m.context.value).toBe(1);
  });

  it('snaps to step grid anchored at min', () => {
    const m = createNumberFieldMachine({ defaultValue: 4, min: 1, max: 10, step: 3 });
    expect(m.context.value).toBe(4);
    m.send({ type: 'INCREMENT' });
    expect(m.context.value).toBe(7);
  });

  it('toJSON serializes XState-compatible config', () => {
    const m = createNumberFieldMachine({ defaultValue: 5 });
    const json = m.toJSON();
    expect(json.id).toBe('numberField');
    expect(json.initial).toBe('idle');
    expect(json.states.idle.on).toHaveProperty('INCREMENT');
  });

  it('subscribe fires on transition', () => {
    const m = createNumberFieldMachine({ defaultValue: 5 });
    let calls = 0;
    const unsub = m.subscribe(() => calls++);
    m.send({ type: 'INCREMENT' });
    m.send({ type: 'DECREMENT' });
    expect(calls).toBeGreaterThanOrEqual(2);
    unsub();
  });
});
