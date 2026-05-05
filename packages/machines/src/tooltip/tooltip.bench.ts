import { bench, describe } from 'vitest';
import { createTooltipMachine, type TooltipMachine } from './index.ts';

describe('machines/tooltip / construction', () => {
  bench('createTooltipMachine() default', () => {
    createTooltipMachine();
  });
});

let m: TooltipMachine;

describe('machines/tooltip / send (dispatch)', () => {
  bench(
    'OPEN / CLOSE round trip',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'CLOSE' });
    },
    { setup: () => void (m = createTooltipMachine()) },
  );

  bench(
    'ESCAPE while open',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'ESCAPE' });
    },
    { setup: () => void (m = createTooltipMachine()) },
  );

  bench(
    'TOGGLE × 2',
    () => {
      m.send({ type: 'TOGGLE' });
      m.send({ type: 'TOGGLE' });
    },
    { setup: () => void (m = createTooltipMachine()) },
  );
});
