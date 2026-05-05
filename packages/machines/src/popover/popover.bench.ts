import { bench, describe } from 'vitest';
import { createPopoverMachine, type PopoverMachine } from './index.ts';

describe('machines/popover / construction', () => {
  bench('createPopoverMachine() default', () => {
    createPopoverMachine();
  });
});

let m: PopoverMachine;

describe('machines/popover / send (dispatch)', () => {
  bench(
    'OPEN / CLOSE round trip',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'CLOSE' });
    },
    { setup: () => void (m = createPopoverMachine()) },
  );

  bench(
    'ESCAPE close (closeOnEscape: true)',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'ESCAPE' });
    },
    { setup: () => void (m = createPopoverMachine()) },
  );

  bench(
    'OUTSIDE_CLICK close',
    () => {
      m.send({ type: 'OPEN' });
      m.send({ type: 'OUTSIDE_CLICK' });
    },
    { setup: () => void (m = createPopoverMachine()) },
  );
});
