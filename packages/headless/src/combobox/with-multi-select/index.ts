/**
 * `@kumiki/attachment-combobox/with-multi-select` — replaces single
 * value with array-value semantics.
 *
 * The base controller still owns option highlight + filter + open state;
 * this layer redirects "selection" into a parallel `selected: T[]` array.
 * On every commit (`OPTION.SELECT` from the base, click, or
 * `INPUT.ENTER`) the wrapper:
 *
 *   1. Reads the just-committed value from the machine.
 *   2. Toggles it in `selected[]` (add if absent, remove if present).
 *   3. Resets the machine's `value` to `null` so the next commit is
 *      also treated as a toggle.
 *   4. Re-opens the listbox so multi-select keyboard / pointer flows
 *      can keep picking without a re-trigger.
 *
 * Items are compared by `option.id`, the same identifier the listbox
 * paints onto `aria-activedescendant`.
 *
 * @see ../../../../../docs/design/11-composition.md §11.4
 */

import type { ComboboxController } from '../index.js';
import type { ComboboxOption } from '@kumiki/machines/combobox';

export interface MultiSelectSnapshot<T extends ComboboxOption> {
  readonly selected: ReadonlyArray<T>;
}

export interface MultiSelectCombobox<T extends ComboboxOption> extends ComboboxController<T> {
  readonly selected: ReadonlyArray<T>;
  readonly isSelected: (option: T) => boolean;

  /** Add the option if absent, remove it if present. Pure mutator on the wrapper. */
  toggle(option: T): void;
  /** Replace the selection with every currently-filtered option. */
  selectAll(): void;
  /** Empty the selection. */
  clear(): void;

  subscribeMultiSelect(listener: (snapshot: MultiSelectSnapshot<T>) => void): () => void;
}

/**
 * Wrap a Combobox controller with multi-select semantics.
 *
 * @when-to-use Tag pickers, recipient lists, multi-filter pickers — any
 *              place where the user picks several values at once and
 *              the listbox should stay open between picks.
 *
 * @anti-pattern Don't compose with `withValidation` expecting a single
 *               value — schemas need to validate `T[]`. (A separate
 *               `withMultiValidation` helper is on the roadmap.)
 */
export function withMultiSelect<T extends ComboboxOption>(
  base: ComboboxController<T>,
  initial: ReadonlyArray<T> = [],
): MultiSelectCombobox<T> {
  let selected: ReadonlyArray<T> = initial;
  const listeners = new Set<(snap: MultiSelectSnapshot<T>) => void>();

  function notify(): void {
    const snap: MultiSelectSnapshot<T> = { selected };
    for (const listener of listeners) listener(snap);
  }

  function indexOf(option: T): number {
    return selected.findIndex((it) => it.id === option.id);
  }

  function toggle(option: T): void {
    const idx = indexOf(option);
    if (idx >= 0) {
      selected = [...selected.slice(0, idx), ...selected.slice(idx + 1)];
    } else {
      selected = [...selected, option];
    }
    notify();
  }

  function selectAll(): void {
    const seen = new Set(selected.map((it) => it.id));
    const additions = base.filtered.filter((it) => !seen.has(it.id));
    if (additions.length === 0) return;
    selected = [...selected, ...additions];
    notify();
  }

  function clear(): void {
    if (selected.length === 0) return;
    selected = [];
    notify();
  }

  // Watch base.value transitions: every time the user commits an option,
  // mirror it into the toggle and clear the base value. The combobox
  // machine sets value as part of OPTION.SELECT (open → idle). Re-open
  // afterwards so multi-select flows keep the listbox visible.
  let prevValue = base.value;
  base.subscribe(({ context }) => {
    const next = context.value;
    if (next === prevValue) return;
    prevValue = next;
    if (next === null) return;
    toggle(next);
    base.setValue(null);
    base.machine.send({ type: 'OPEN' });
  });

  const wrapped: MultiSelectCombobox<T> = Object.create(base, {
    selected: { get: () => selected, enumerable: true },
    isSelected: {
      value: (option: T) => indexOf(option) >= 0,
      enumerable: true,
    },
    toggle: { value: toggle, enumerable: true },
    selectAll: { value: selectAll, enumerable: true },
    clear: { value: clear, enumerable: true },
    subscribeMultiSelect: {
      value: (listener: (snap: MultiSelectSnapshot<T>) => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      enumerable: true,
    },
  }) as MultiSelectCombobox<T>;

  return wrapped;
}
