import { describe, it, expect } from 'vitest';
import { createSliderMachine } from './index.ts';

describe('slider machine', () => {
  describe('initial state', () => {
    it('defaults: 0..100 step=1, value=0', () => {
      const m = createSliderMachine();
      expect(m.state).toBe('idle');
      expect(m.context).toMatchObject({
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        pageStep: 10,
        orientation: 'horizontal',
      });
    });

    it('honors overrides', () => {
      const m = createSliderMachine({
        min: -10,
        max: 10,
        step: 0.5,
        pageStep: 2,
        defaultValue: 3,
        orientation: 'vertical',
      });
      expect(m.context.value).toBe(3);
      expect(m.context.orientation).toBe('vertical');
    });

    it('clamps + snaps initial value to grid', () => {
      const m = createSliderMachine({ min: 0, max: 10, step: 2, defaultValue: 7 });
      expect(m.context.value).toBe(8); // 7 snaps to 8
    });

    it('starts disabled when disabled=true', () => {
      const m = createSliderMachine({ disabled: true });
      expect(m.state).toBe('disabled');
    });
  });

  describe('INCREMENT / DECREMENT', () => {
    it('INCREMENT advances by step', () => {
      const m = createSliderMachine({ defaultValue: 4, step: 2 });
      m.send({ type: 'INCREMENT' });
      expect(m.context.value).toBe(6);
    });

    it('DECREMENT retreats by step', () => {
      const m = createSliderMachine({ defaultValue: 5 });
      m.send({ type: 'DECREMENT' });
      expect(m.context.value).toBe(4);
    });

    it('INCREMENT clamps at max', () => {
      const m = createSliderMachine({ defaultValue: 99, max: 100 });
      m.send({ type: 'INCREMENT' });
      m.send({ type: 'INCREMENT' });
      expect(m.context.value).toBe(100);
    });

    it('DECREMENT clamps at min', () => {
      const m = createSliderMachine({ defaultValue: 1, min: 0 });
      m.send({ type: 'DECREMENT' });
      m.send({ type: 'DECREMENT' });
      expect(m.context.value).toBe(0);
    });
  });

  describe('NAVIGATE physical arrow resolution (RTL inversion in the machine)', () => {
    it('horizontal LTR: ArrowRight increments, ArrowLeft decrements', () => {
      const m = createSliderMachine({ defaultValue: 50 });
      m.send({ type: 'NAVIGATE', key: 'ArrowRight' });
      expect(m.context.value).toBe(51);
      m.send({ type: 'NAVIGATE', key: 'ArrowLeft' });
      expect(m.context.value).toBe(50);
    });

    it('horizontal RTL: ArrowLeft increments, ArrowRight decrements (inverted in the machine)', () => {
      const m = createSliderMachine({ defaultValue: 50, direction: 'rtl' });
      m.send({ type: 'NAVIGATE', key: 'ArrowLeft' });
      expect(m.context.value).toBe(51); // RTL: Left = increment
      m.send({ type: 'NAVIGATE', key: 'ArrowRight' });
      expect(m.context.value).toBe(50);
    });

    it('SET.DIRECTION flips the inversion at runtime', () => {
      const m = createSliderMachine({ defaultValue: 50 });
      m.send({ type: 'SET.DIRECTION', value: 'rtl' });
      expect(m.context.direction).toBe('rtl');
      m.send({ type: 'NAVIGATE', key: 'ArrowLeft' });
      expect(m.context.value).toBe(51); // now RTL → Left = increment
    });

    it('vertical: ArrowUp increments, ArrowDown decrements; horizontal arrows are no-ops', () => {
      const m = createSliderMachine({ defaultValue: 50, orientation: 'vertical' });
      m.send({ type: 'NAVIGATE', key: 'ArrowUp' });
      expect(m.context.value).toBe(51);
      m.send({ type: 'NAVIGATE', key: 'ArrowRight' }); // off-axis → ignored
      expect(m.context.value).toBe(51);
      m.send({ type: 'NAVIGATE', key: 'ArrowDown' });
      expect(m.context.value).toBe(50);
    });

    it('exposes the navigate action + SET.DIRECTION in toJSON (config is machine-side)', () => {
      const json = createSliderMachine().toJSON();
      expect(json.context).toMatchObject({ direction: 'ltr', orientation: 'horizontal' });
      expect(json.states.idle!.on!['NAVIGATE']).toBeDefined();
      expect(json.states.idle!.on!['SET.DIRECTION']).toBeDefined();
    });
  });

  describe('PAGE_INCREMENT / PAGE_DECREMENT', () => {
    it('uses pageStep multiplier', () => {
      const m = createSliderMachine({ defaultValue: 50 });
      m.send({ type: 'PAGE_INCREMENT' });
      expect(m.context.value).toBe(60);
      m.send({ type: 'PAGE_DECREMENT' });
      expect(m.context.value).toBe(50);
    });
  });

  describe('TO_MIN / TO_MAX', () => {
    it('TO_MIN snaps to min', () => {
      const m = createSliderMachine({ defaultValue: 50 });
      m.send({ type: 'TO_MIN' });
      expect(m.context.value).toBe(0);
    });

    it('TO_MAX snaps to max', () => {
      const m = createSliderMachine({ defaultValue: 50 });
      m.send({ type: 'TO_MAX' });
      expect(m.context.value).toBe(100);
    });
  });

  describe('SET.VALUE', () => {
    it('clamps + snaps', () => {
      const m = createSliderMachine({ step: 5 });
      m.send({ type: 'SET.VALUE', value: 13 });
      expect(m.context.value).toBe(15); // snaps to 15
      m.send({ type: 'SET.VALUE', value: 200 });
      expect(m.context.value).toBe(100); // clamps to max
    });
  });

  describe('SET.MIN / SET.MAX / SET.STEP', () => {
    it('SET.MIN re-clamps current value', () => {
      const m = createSliderMachine({ defaultValue: 5 });
      m.send({ type: 'SET.MIN', value: 10 });
      expect(m.context.min).toBe(10);
      expect(m.context.value).toBe(10);
    });

    it('SET.MAX re-clamps', () => {
      const m = createSliderMachine({ defaultValue: 80 });
      m.send({ type: 'SET.MAX', value: 50 });
      expect(m.context.value).toBe(50);
    });

    it('SET.STEP re-snaps', () => {
      const m = createSliderMachine({ defaultValue: 7 });
      m.send({ type: 'SET.STEP', value: 5 });
      expect(m.context.value).toBe(5);
    });
  });

  describe('SET.ORIENTATION (metadata only)', () => {
    it('flips at runtime without changing value', () => {
      const m = createSliderMachine({ defaultValue: 50 });
      m.send({ type: 'SET.ORIENTATION', value: 'vertical' });
      expect(m.context.orientation).toBe('vertical');
      expect(m.context.value).toBe(50);
    });
  });

  describe('SET.PAGE_STEP', () => {
    it('updates without affecting current value', () => {
      const m = createSliderMachine();
      m.send({ type: 'SET.PAGE_STEP', value: 25 });
      m.send({ type: 'PAGE_INCREMENT' });
      expect(m.context.value).toBe(25);
    });
  });

  describe('DISABLE / ENABLE', () => {
    it('DISABLE drops events', () => {
      const m = createSliderMachine();
      m.send({ type: 'DISABLE' });
      m.send({ type: 'INCREMENT' });
      expect(m.state).toBe('disabled');
      expect(m.context.value).toBe(0);
    });

    it('ENABLE restores idle', () => {
      const m = createSliderMachine({ disabled: true });
      m.send({ type: 'ENABLE' });
      expect(m.state).toBe('idle');
    });
  });

  describe('decimal step stability', () => {
    it('avoids floating-point drift at step=0.1', () => {
      const m = createSliderMachine({ min: 0, max: 1, step: 0.1, defaultValue: 0 });
      for (let i = 0; i < 10; i++) m.send({ type: 'INCREMENT' });
      // Naïve floats give 0.9999999… ; we expect 1.0.
      expect(m.context.value).toBe(1);
    });
  });
});
