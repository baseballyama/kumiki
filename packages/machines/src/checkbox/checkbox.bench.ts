import { bench, describe } from 'vitest';
import { createCheckboxMachine, type CheckboxMachine } from './index.ts';

describe('machines/checkbox / construction', () => {
  bench('createCheckboxMachine() default', () => {
    createCheckboxMachine();
  });

  bench('createCheckboxMachine({ initial: "mixed" })', () => {
    createCheckboxMachine({ initial: 'mixed' });
  });
});

let m: CheckboxMachine;

describe('machines/checkbox / send (dispatch)', () => {
  bench(
    'TOGGLE cycle (unchecked → checked → unchecked)',
    () => {
      m.send({ type: 'TOGGLE' });
      m.send({ type: 'TOGGLE' });
    },
    { setup: () => void (m = createCheckboxMachine()) },
  );

  bench(
    'SET to mixed (tri-state)',
    () => {
      m.send({ type: 'SET', value: 'mixed' });
    },
    { setup: () => void (m = createCheckboxMachine()) },
  );
});
