import { bench, describe } from 'vitest';
import { createNumberFieldMachine, type NumberFieldMachine } from './index.ts';

describe('machines/number-field / construction', () => {
  bench('createNumberFieldMachine() default', () => {
    createNumberFieldMachine();
  });

  bench('createNumberFieldMachine({ min, max, step })', () => {
    createNumberFieldMachine({ min: 0, max: 100, step: 5 });
  });
});

let m: NumberFieldMachine;

describe('machines/number-field / send (dispatch)', () => {
  bench(
    'INCREMENT × 5',
    () => {
      for (let i = 0; i < 5; i++) m.send({ type: 'INCREMENT' });
    },
    { setup: () => void (m = createNumberFieldMachine({ defaultValue: 0, step: 1 })) },
  );

  bench(
    'PAGE_INCREMENT / PAGE_DECREMENT round trip',
    () => {
      m.send({ type: 'PAGE_INCREMENT' });
      m.send({ type: 'PAGE_DECREMENT' });
    },
    { setup: () => void (m = createNumberFieldMachine({ defaultValue: 50 })) },
  );

  bench(
    'CLEAR',
    () => {
      m.send({ type: 'CLEAR' });
    },
    { setup: () => void (m = createNumberFieldMachine({ defaultValue: 42 })) },
  );
});
