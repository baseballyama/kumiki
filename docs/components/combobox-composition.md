# Combobox composition (`with*` API)

> Optional features layered on top of the base `@kumiki/attachment-combobox`. Each is its own subpath — they tree-shake when not imported, so the base bundle never pays for features the consumer didn't ask for.

| Subpath                                           |      Brotli | Adds                                                                              |
| ------------------------------------------------- | ----------: | --------------------------------------------------------------------------------- |
| `@kumiki/attachment-combobox/with-validation`     |       378 B | Standard Schema validator + `errors / isValid / validation.state`                 |
| `@kumiki/attachment-combobox/with-async-search`   |       476 B | Abort-aware fetcher reusing the machine's FETCH.\* token protocol                 |
| `@kumiki/attachment-combobox/with-multi-select`   |       365 B | `selected: T[]` + `toggle / selectAll / clear` + listbox stays open between picks |
| `@kumiki/attachment-combobox/with-virtualization` |       548 B | Fixed-row windowing (`visibleItems / totalHeight / getItemStyle`) for huge lists  |
| **Total optional surface**                        | **1.77 KB** | Importing one does not pull in any other.                                         |

See [`docs/design/11-composition.md`](../design/11-composition.md) for the architecture rationale.

## `withValidation(base, schema)`

Wraps a Combobox controller with [Standard Schema](https://standardschema.dev) validation. Auto-validates whenever the base value changes; async validators are race-token guarded.

```ts
import { createCombobox } from '@kumiki/attachment-combobox';
import { withValidation } from '@kumiki/attachment-combobox/with-validation';
import { z } from 'zod';

const schema = z.object({ id: z.string(), value: z.string(), label: z.string() });

const cb = withValidation(
  createCombobox({ options: countries }),
  // zod >=4 implements Standard Schema natively
  schema['~standard']
    ? schema
    : {
        '~standard': {
          /* … */
        },
      },
);

// Surfaced API
cb.errors; // ReadonlyArray<{ message, path? }>
cb.isValid; // boolean
cb.validation.state; // 'pristine' | 'validating' | 'valid' | 'invalid'
await cb.validate(); // manual run for parent-form submit flows

const unsub = cb.subscribeValidation((snap) => {
  console.log(snap.state, snap.errors);
});
```

**When to use:** combobox values constrained by an external schema (must belong to an active set, must be present, etc.). For free-text validation, use `@kumiki/component-form-field` instead.

## `withAsyncSearch(base, fetcher, options?)`

Replaces sync filtering with an async fetcher. Aborts the in-flight request on every new query; the machine's reducers drop stale results via the existing `ctx.token`.

```ts
import { createCombobox } from '@kumiki/attachment-combobox';
import { withAsyncSearch } from '@kumiki/attachment-combobox/with-async-search';

const cb = withAsyncSearch(
  createCombobox({ options: [] }),
  async (query, signal) =>
    (await fetch(`/api/cities?q=${encodeURIComponent(query)}`, { signal })).json(),
  { debounceMs: 200 }, // optional
);

cb.status; // 'idle' | 'loading' | 'error'
cb.error; // Error | null
```

**Options:**

| Option         | Default | Effect                                                                         |
| -------------- | ------: | ------------------------------------------------------------------------------ |
| `debounceMs`   |     `0` | Coalesce rapid keystrokes; only the last query reaches the fetcher.            |
| `fetchOnEmpty` | `false` | When false, an empty query short-circuits to `[]` without calling the fetcher. |

**When to use:** large or remote option sets where filtering happens server-side. Aborts surface as `AbortError` and never flip `status` to `'error'` — only genuine rejections do.

## `withMultiSelect(base, initial?)`

Replaces single-value semantics with array-value semantics. The base controller still owns highlight + filter + open state; this wrapper redirects every committed value into a parallel `selected: T[]` array and re-opens the listbox so picks chain naturally.

```ts
import { createCombobox } from '@kumiki/attachment-combobox';
import { withMultiSelect } from '@kumiki/attachment-combobox/with-multi-select';

const cb = withMultiSelect(createCombobox({ options: tags }), /* initial */ []);

cb.selected; // ReadonlyArray<T>
cb.isSelected(tag); // boolean (compared by id)
cb.toggle(tag); // add if absent, remove if present
cb.selectAll(); // adds every currently-filtered option, no duplicates
cb.clear(); // empties the selection

cb.subscribeMultiSelect(({ selected }) => render(selected));
```

**When to use:** tag pickers, recipient lists, multi-filter UIs.

**Anti-pattern:** don't compose with `withValidation` expecting a single value — the schema needs to validate `T[]`. A `withMultiValidation` follow-up is on the roadmap.

## `withVirtualization(base, { itemHeight, overscan? })`

Fixed-row-height windowing for large lists. Pure inline math — no `@tanstack/virtual-core` dep.

```ts
import { createCombobox } from '@kumiki/attachment-combobox';
import { withVirtualization } from '@kumiki/attachment-combobox/with-virtualization';

const cb = withVirtualization(createCombobox({ options: thousands }), {
  itemHeight: 32,
  overscan: 4,
});

cb.visibleItems; // ReadonlyArray<{ index, option }>
cb.totalHeight; // pixels — set on the inner <ul>
cb.getItemStyle(index); // absolute-positioned top + height
cb.setScrollTop(scrollTop);
cb.setViewportHeight(viewportHeight);

cb.subscribeVirtualization(({ visibleItems, totalHeight }) => render(visibleItems));
```

The consumer wires the scroll container themselves: listen for `scroll` and call `setScrollTop`; observe size changes and call `setViewportHeight`. Re-windows automatically whenever the base's filtered list changes.

**When to use:** lists with hundreds-to-thousands of options. Don't compose this for short lists — the windowing math costs more than just rendering everything.

**Out of scope:** variable row heights. A follow-up `withDynamicVirtualization` would ADR an off-the-shelf measurer.

## Composing multiple

Compose once on construction, never per-render:

```ts
const cb = withVirtualization(
  withMultiSelect(withAsyncSearch(createCombobox({ options: [] }), fetchTags)),
  { itemHeight: 32 },
);
```

Each layer wraps the prior; the result is a `ComboboxController & ValidatedCombobox & AsyncSearchCombobox & MultiSelectCombobox & VirtualizedCombobox` with all the methods of each.

The order matters for two pairs:

- `withMultiSelect` should come **before** `withVirtualization` — the windowing layer reads from `base.filtered`, and multi-select doesn't touch that, so either order works for filter; but if the inner layer keeps the listbox open after a pick, the outer windowing will see the new filter immediately.
- `withValidation` typically goes **outermost** so it sees the final committed value (single or multi) regardless of what the inner layers did.

## Source

- Implementations: [`packages/components/combobox/attachment/src/with-*`](../../packages/components/combobox/attachment/src)
- Architecture rationale: [`docs/design/11-composition.md`](../design/11-composition.md)
- Standard Schema: <https://standardschema.dev>
