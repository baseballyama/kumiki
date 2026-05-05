import { bench, describe } from 'vitest';
import { createSliderMachine, type SliderMachine } from './index.ts';

describe('machines/slider / construction', () => {
  bench('createSliderMachine() default (0-100)', () => {
    createSliderMachine();
  });
});

let m: SliderMachine;

describe('machines/slider / send (dispatch)', () => {
  bench(
    'INCREMENT × 5',
    () => {
      for (let i = 0; i < 5; i++) m.send({ type: 'INCREMENT' });
    },
    { setup: () => void (m = createSliderMachine({ defaultValue: 50 })) },
  );

  bench(
    'PAGE_INCREMENT × 5',
    () => {
      for (let i = 0; i < 5; i++) m.send({ type: 'PAGE_INCREMENT' });
    },
    { setup: () => void (m = createSliderMachine({ defaultValue: 50 })) },
  );

  bench(
    'TO_MIN / TO_MAX',
    () => {
      m.send({ type: 'TO_MAX' });
      m.send({ type: 'TO_MIN' });
    },
    { setup: () => void (m = createSliderMachine()) },
  );

  bench(
    'SET.VALUE',
    () => {
      m.send({ type: 'SET.VALUE', value: 73 });
    },
    { setup: () => void (m = createSliderMachine()) },
  );
});
