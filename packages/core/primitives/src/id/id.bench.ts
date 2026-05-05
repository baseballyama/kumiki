/**
 * Performance benchmarks for `@kumiki/primitives/id`.
 *
 * `uid()` is called whenever a component constructs and needs a stable
 * `aria-controls` / `aria-labelledby` / `aria-describedby` id. A
 * Combobox emits ~5 ids on mount; a Dialog emits 3-4. The cost is not
 * a hot path on its own but it shows up at every component mount.
 */

import { bench, describe } from 'vitest';
import { createIdScope, uid } from './index.ts';

describe('primitives/id / uid', () => {
  bench('uid() — no scope', () => {
    uid();
  });

  bench('uid("toggle") — with scope', () => {
    uid('toggle');
  });

  bench('uid("combobox-listbox") — long scope', () => {
    uid('combobox-listbox');
  });
});

describe('primitives/id / createIdScope', () => {
  bench('createIdScope construction', () => {
    createIdScope('dialog');
  });

  bench(
    'scope.next() (counter increment)',
    () => {
      scope.next();
    },
    {
      setup: () => {
        scope = createIdScope('dialog');
      },
    },
  );

  bench(
    'scope.next("title") (counter + suffix)',
    () => {
      scope.next('title');
    },
    {
      setup: () => {
        scope = createIdScope('dialog');
      },
    },
  );
});

let scope: ReturnType<typeof createIdScope>;
