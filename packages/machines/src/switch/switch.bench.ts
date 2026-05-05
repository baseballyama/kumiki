import { bench, describe } from 'vitest';
import { createSwitchMachine, type SwitchMachine } from './index.ts';

describe('machines/switch / construction', () => {
  bench('createSwitchMachine() default', () => {
    createSwitchMachine();
  });
});

let m: SwitchMachine;

describe('machines/switch / send (dispatch)', () => {
  bench(
    'TOGGLE × 2 round trip',
    () => {
      m.send({ type: 'TOGGLE' });
      m.send({ type: 'TOGGLE' });
    },
    { setup: () => void (m = createSwitchMachine()) },
  );

  bench(
    'SET no-change guard',
    () => {
      m.send({ type: 'SET', checked: false });
    },
    { setup: () => void (m = createSwitchMachine()) },
  );
});
