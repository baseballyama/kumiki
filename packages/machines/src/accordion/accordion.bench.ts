import { bench, describe } from 'vitest';
import { createAccordionMachine, type AccordionItem, type AccordionMachine } from './index.ts';

const ITEMS: ReadonlyArray<AccordionItem<string>> = [
  { id: 'a', value: 'a', label: 'A' },
  { id: 'b', value: 'b', label: 'B' },
  { id: 'c', value: 'c', label: 'C' },
  { id: 'd', value: 'd', label: 'D' },
];

describe('machines/accordion / construction', () => {
  bench('createAccordionMachine() single', () => {
    createAccordionMachine<string>({ items: ITEMS });
  });

  bench('createAccordionMachine() multiple', () => {
    createAccordionMachine<string>({ items: ITEMS, mode: 'multiple' });
  });
});

let m: AccordionMachine<string>;

describe('machines/accordion / send (dispatch)', () => {
  bench(
    'TOGGLE × 4 (single)',
    () => {
      m.send({ type: 'TOGGLE', id: 'a' });
      m.send({ type: 'TOGGLE', id: 'b' });
      m.send({ type: 'TOGGLE', id: 'c' });
      m.send({ type: 'TOGGLE', id: 'd' });
    },
    { setup: () => void (m = createAccordionMachine<string>({ items: ITEMS })) },
  );

  bench(
    'TOGGLE × 4 (multiple)',
    () => {
      m.send({ type: 'TOGGLE', id: 'a' });
      m.send({ type: 'TOGGLE', id: 'b' });
      m.send({ type: 'TOGGLE', id: 'c' });
      m.send({ type: 'TOGGLE', id: 'd' });
    },
    {
      setup: () => void (m = createAccordionMachine<string>({ items: ITEMS, mode: 'multiple' })),
    },
  );

  bench(
    'NAVIGATE next',
    () => {
      m.send({ type: 'NAVIGATE', direction: 'next' });
    },
    { setup: () => void (m = createAccordionMachine<string>({ items: ITEMS })) },
  );
});
