# 11 — Composition Patterns

## 11.1 The thesis

Most users want the default Combobox. Some want async option fetching. Some want virtualization. Some want multi-select. Adding all of those to the base API would balloon the bundle and complicate the type signatures.

**Composition via `with*` functions** is how Kumiki layers optional features on top of a base. Each `with*` is a separate subpath export and tree-shakes when not used.

## 11.2 The pattern

```ts
// Base usage:
const cb = createCombobox({ options });

// Compose features:
const cb2 = withAsyncSearch(cb, fetcher);
const cb3 = withVirtualization(cb2, { itemHeight: 32 });
const cb4 = withMultiSelect(cb3);
const cb5 = withValidation(cb4, schema);

// Or all at once:
const cb = withValidation(
  withMultiSelect(
    withVirtualization(withAsyncSearch(createCombobox({ options }), fetcher), { itemHeight: 32 }),
  ),
  schema,
);
```

Each `with*`:

- Takes the base controller as the first argument.
- Returns a new controller with extended state.
- Lives in its own subpath: `@kumiki/attachment-combobox/with-async-search`, `@kumiki/attachment-combobox/with-virtualization`, etc.
- Is independently typed; the result is a type intersection of the base + the feature.

## 11.3 Subpath layout for composition functions

For a Layer 3 package with composition variants:

```json
"exports": {
  ".":                       { "types": "./dist/index.d.ts",                       "import": "./dist/index.js" },
  "./with-validation":       { "types": "./dist/with-validation/index.d.ts",       "import": "./dist/with-validation/index.js" },
  "./with-async-search":     { "types": "./dist/with-async-search/index.d.ts",     "import": "./dist/with-async-search/index.js" },
  "./with-async-options":    { "types": "./dist/with-async-options/index.d.ts",    "import": "./dist/with-async-options/index.js" },
  "./with-virtualization":   { "types": "./dist/with-virtualization/index.d.ts",   "import": "./dist/with-virtualization/index.js" },
  "./with-multi-select":     { "types": "./dist/with-multi-select/index.d.ts",     "import": "./dist/with-multi-select/index.js" },
  "./with-typeahead":        { "types": "./dist/with-typeahead/index.d.ts",        "import": "./dist/with-typeahead/index.js" },
  "./with-controlled-open":  { "types": "./dist/with-controlled-open/index.d.ts",  "import": "./dist/with-controlled-open/index.js" },
  "./with-controlled-value": { "types": "./dist/with-controlled-value/index.d.ts", "import": "./dist/with-controlled-value/index.js" }
}
```

A user that imports only `from '@kumiki/attachment-combobox'` does not pull in `with-virtualization` or anything else.

## 11.4 The Phase 1 priority list

The brief Section 7.2 specifies the priority list. Reproduced here, with brief design notes.

### `withValidation(base, schema)`

Wraps any base controller with a Standard Schema validator. Adds `errors`, `isValid`, `state.validation` to the controller. Implementation calls `schema['~standard'].validate(currentValue)` on `INPUT` (debounced) and `BLUR`. Race-token guarded ([07-form-validation.md §7.8](07-form-validation.md#78-async-validation-correctness)).

### `withAsyncSearch(base, fetcher)`

For Combobox / Select. Replaces sync filtering with an async fetcher:

```ts
const fetcher = async (query: string, signal: AbortSignal) =>
  await fetch(`/api/search?q=${query}`, { signal }).then((r) => r.json());

const cb = withAsyncSearch(createCombobox({ options: [] }), fetcher);
```

Adds `state: 'idle' | 'loading' | 'error'`. The fetcher receives an `AbortSignal` for cancellation. Each new query aborts the previous.

### `withAsyncOptions(base, loader)`

Like `withAsyncSearch` but loads the _initial_ option set lazily (e.g., open trigger → fetch). Distinct because the timing differs (open vs change).

### `withVirtualization(base, { itemHeight, overscan })`

For Combobox / Select / Listbox with large option sets. Adds a `visibleItems`, `scrollOffset`, and `getItemStyle()` API. Internally uses an off-the-shelf virtualizer (TBD: `@tanstack/virtual-core` framework-agnostic). Counts toward the budget only when used.

### `withMultiSelect(base)`

Replaces single-value with array-value semantics. Adds `selected: T[]` and `toggle(item)` / `selectAll()` / `clear()`. `Combobox.Item` becomes a checkbox-role-equivalent.

### `withTypeahead(base, { matchOn })`

For Listbox / Menu / Tree where rapid keypresses jump to matching items. Wraps `@kumiki/primitives/collection`'s typeahead.

### `withControlledOpen(base, { open, onOpenChange })`

Lets the user fully control open/close state externally. Useful for Dialog/Popover/Combobox in test harnesses or when tied to URL state.

### `withControlledValue(base, { value, onValueChange })`

Same for value. The base controller defaults to internal state; `withControlledValue` makes the base ignore internal updates and trust the caller.

## 11.5 Type composition

Each `with*` is typed precisely so users get autocomplete after composing:

```ts
// @kumiki/attachment-combobox/with-validation
import type { ComboboxController, StandardSchemaV1 } from '@kumiki/types';

export interface ValidatedCombobox<T> extends ComboboxController<T> {
  errors: ReadonlyArray<{ message: string; path?: ReadonlyArray<PropertyKey> }>;
  isValid: boolean;
  validation: { state: 'pristine' | 'validating' | 'valid' | 'invalid' };
}

export function withValidation<T>(
  base: ComboboxController<T>,
  schema: StandardSchemaV1<T>,
): ValidatedCombobox<T>;
```

Because `ValidatedCombobox<T> extends ComboboxController<T>`, all of the base's methods and state are still available.

## 11.6 When to compose vs to subclass

`with*` is the only sanctioned extension mechanism. Subclassing the controller class is supported (the controllers are plain Svelte 5 classes) but **not part of the public API surface** — internal field names may change between minor versions. Users who subclass do so at their own risk.

## 11.7 Anti-patterns

- **Don't ship a `withAll(base)` mega-helper.** That's just the base in disguise; we'd lose the tree-shake benefit.
- **Don't make `with*` mutate the base.** Each returns a new controller. The base remains usable in parallel.
- **Don't compose `with*` outside the controller's lifecycle.** Compose once, on construction. Re-composing every render thrashes subscribers.

## 11.8 Layer 4 vs Layer 3 composition

Layer 3 controllers compose via `with*`. Layer 4 components do _not_ — they expose composition via props:

```svelte
<Combobox.Root validator={schema} async={fetcher} multi virtualize>...</Combobox.Root>
```

The Layer 4 implementation reads these props and applies the corresponding `with*` internally:

```ts
// Inside Combobox.Root.svelte
let cb = createCombobox({ options });
if ($props().validator) cb = withValidation(cb, $props().validator);
if ($props().async) cb = withAsyncSearch(cb, $props().async);
if ($props().multi) cb = withMultiSelect(cb);
if ($props().virtualize) cb = withVirtualization(cb, { itemHeight: 32 });
```

**This is the only place in Kumiki where conditional `import` would help with bundle size.** We measure: if "the Combobox base + all features" beats "lazy-load each feature when its prop is set", we ship the simpler version. Phase 0b will determine whether dynamic-import for unused features is worth the complexity.

## 11.9 Open questions

- **TBD:** Does composition order matter for correctness? E.g., `withMultiSelect(withVirtualization(...))` vs the reverse. Tests in `packages/attachment-combobox/composition.test.ts` (Phase 0b) will pin this down.
- **TBD:** Whether `withValidation` should be Layer 4-only. Current design: works at Layer 3 too, since the form story is mature there. Re-evaluate based on real usage.
- **TBD:** Whether to expose a `compose(...)` helper that's just function composition. Lean: no — explicit `withX(withY(...))` is clearer.
