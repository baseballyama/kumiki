import { bench, describe } from 'vitest';
import { createToastMachine, type ToastItem, type ToastMachine } from './index.ts';

describe('machines/toast / construction', () => {
  bench('createToastMachine() default', () => {
    createToastMachine();
  });
});

let m: ToastMachine;

function toast(id: string): ToastItem {
  return { id, title: `Toast ${id}` };
}

describe('machines/toast / send (dispatch)', () => {
  bench(
    'ADD × 5 (within max=5)',
    () => {
      for (let i = 0; i < 5; i++) m.send({ type: 'ADD', toast: toast(`t${i}`) });
    },
    { setup: () => void (m = createToastMachine({ max: 5 })) },
  );

  bench(
    'ADD × 8 (overflow trim)',
    () => {
      for (let i = 0; i < 8; i++) m.send({ type: 'ADD', toast: toast(`t${i}`) });
    },
    { setup: () => void (m = createToastMachine({ max: 5 })) },
  );

  bench(
    'REMOVE',
    () => {
      m.send({ type: 'REMOVE', id: 't0' });
    },
    {
      setup: () => {
        m = createToastMachine();
        m.send({ type: 'ADD', toast: toast('t0') });
      },
    },
  );

  bench(
    'CLEAR (5 toasts)',
    () => {
      m.send({ type: 'CLEAR' });
    },
    {
      setup: () => {
        m = createToastMachine();
        for (let i = 0; i < 5; i++) m.send({ type: 'ADD', toast: toast(`t${i}`) });
      },
    },
  );
});
