# 08 — TypeScript Design

## 8.1 Settings

`tsconfig.json` is the same across every package, extending the root:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "useDefineForClassFields": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

Notes:

- `noUncheckedIndexedAccess` is on. Forces `arr[i] | undefined` discipline.
- `verbatimModuleSyntax` is on. `import type { X }` is required for type-only imports.
- `skipLibCheck` is on, but our own `.d.ts` are checked via `arethetypeswrong` in CI.

## 8.2 The generic propagation problem

Svelte 5 supports `<script lang="ts" generics="...">` but inference of generics through deeply nested compound components is fragile. Reference: [sveltejs/svelte#11356](https://github.com/sveltejs/svelte/issues/11356), [language-tools#273](https://github.com/sveltejs/language-tools/issues/273).

Our boundary: **the outermost user-facing component holds the generic; children consume it via context.** This is the only pattern that types reliably end-to-end on Svelte 5 today.

```svelte
<!-- Combobox.Root.svelte -->
<script lang="ts" generics="T extends { id: string; label: string }">
  import { setContext } from 'svelte';
  import type { Snippet } from 'svelte';

  type Props = {
    options: T[];
    value?: T | null;
    onValueChange?: (value: T | null) => void;
    children: Snippet;
  };

  let { options, value = $bindable(null), onValueChange, children }: Props = $props();

  // Setting context with the generic preserves the type for descendants.
  setContext<ComboboxContext<T>>('kumiki.combobox', { options, value /* ... */ });
</script>

{@render children()}
```

```svelte
<!-- Combobox.Item.svelte -->
<script lang="ts" generics="T extends { id: string }">
  import { getContext } from 'svelte';

  type Props = {
    value: T;
    children: Snippet;
  };

  let { value, children }: Props = $props();

  // The cast here lives at exactly one place in the library. Users never see it.
  const ctx = getContext<ComboboxContext<T>>('kumiki.combobox');
</script>

<li role="option" aria-selected={ctx.value?.id === value.id}>{@render children()}</li>
```

The user writes:

```svelte
<Combobox.Root<User> options={users} bind:value={selectedUser}>
  ...
  {#snippet item(u)}                  <!-- u is inferred as User -->
    <Combobox.Item value={u}>{u.name}</Combobox.Item>
  {/snippet}
</Combobox.Root>
```

## 8.3 Typed snippets

Svelte 5 gives snippets first-class types via `Snippet<[ArgTypes]>`:

```ts
import type { Snippet } from 'svelte';

type ComboboxRootProps<T> = {
  options: T[];
  // The user's `item` snippet receives a typed argument.
  item?: Snippet<[option: T]>;
  // Alternatively, an `empty` snippet for the no-results case (no args).
  empty?: Snippet;
  children: Snippet;
};
```

When the user writes `{#snippet item(opt)}`, `opt` is inferred to `T`.

## 8.4 The `child` snippet pattern (replacing `asChild`)

Render delegation via the `child` snippet ([16-decisions/0007-aschild-svelte-alternative.md](16-decisions/0007-aschild-svelte-alternative.md)). Bits UI v2 set the precedent; we follow.

```svelte
<!-- Combobox.Trigger.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type TriggerChildPayload = {
    props: {
      // Every prop the trigger needs spread on its element.
      role: 'combobox';
      'aria-expanded': boolean;
      'aria-controls': string;
      onclick: (event: MouseEvent) => void;
      onkeydown: (event: KeyboardEvent) => void;
    };
  };

  type Props = {
    /** Default rendering as a <button>. Provide `child` to render your own element instead. */
    children?: Snippet;
    child?: Snippet<[payload: TriggerChildPayload]>;
  };

  let { children, child }: Props = $props();

  const props: TriggerChildPayload['props'] = {
    role: 'combobox',
    'aria-expanded': /* … */,
    'aria-controls': /* … */,
    onclick: handleClick,
    onkeydown: handleKeydown,
  };
</script>

{#if child}
  {@render child({ props })}
{:else}
  <button {...props}>{@render children?.()}</button>
{/if}
```

Usage:

```svelte
<Combobox.Trigger>
  {#snippet child({ props })}
    <MyButton {...props} class="brand-btn">Open</MyButton>
  {/snippet}
</Combobox.Trigger>
```

This is type-safe: the user gets autocomplete on `props.role`, `props.onclick`, etc.

## 8.5 Required accessible names enforced by types

Where ARIA requires a name and we can detect its absence at the type level, we make the type require it:

```ts
// @kumiki/component-dialog
export type DialogRootProps =
  | { title: string; children: Snippet }
  | { 'aria-label': string; children: Snippet }
  | { 'aria-labelledby': string; children: Snippet };
```

Calling `<Dialog.Root>` without any of those is a TS error. Same pattern for `IconButton` (Phase 2).

For Tooltip, the trigger must have an accessible name _itself_ — we cannot detect snippet contents at the type level. We add a development-only warning instead (tree-shaken in production).

## 8.6 Bindable with generics

`$bindable<T>()` is required for two-way binding. Strict-bindings (Svelte 5) requires the binding side type to be assignable. We therefore type bindable values precisely:

```svelte
<script lang="ts" generics="T extends { id: string }">
  type Props = {
    value?: T | null;
    options: T[];
  };

  let { value = $bindable(null), options }: Props = $props();
</script>
```

Known gotcha: generic + bindable in **deeply** nested components forces explicit type arguments. We avoid the problem by keeping generic `bind:value` only on the outermost `Root`. Children read from context, never bind.

## 8.7 Cross-module reactivity in `.svelte.ts`

Layer 3 controllers live in `*.svelte.ts` files. The Svelte compiler preprocesses runes here. Pattern:

```ts
// @kumiki/attachment-combobox/src/controller.svelte.ts
export class ComboboxController<T> {
  state = $state<'closed' | 'open'>('closed');
  filtered = $state.raw<T[]>([]);
  // ...
}
```

`$state.raw` is used for collections we re-assign whole; this avoids per-item proxying. Documented in `04-state-machines.md`.

Cross-file: an exported `$state` cannot be reassigned from another file. We export classes and functions, not bare reactive variables. The exception is `LocaleProvider` context, which sets context once per app.

## 8.8 The TypeScript surface we publish

Users see, per package, a small set of:

- `createX(input): XController` — Layer 3 entry.
- `XController` — class type with public state, methods, attachment factories.
- `<X.Root>`, `<X.Trigger>`, `<X.Item>`, … — Layer 4 components.
- `XEvent`, `XContext` — Layer 2 machine events / context types.

Internal types (e.g. `XStateNode`) are not exported. We use `./private/*: null` in `package.json` `exports` (per React Aria's pattern) once we have any private subpaths to seal off.

## 8.9 API report and breaking-change detection

`@microsoft/api-extractor` runs per package in CI ([12-testing.md](12-testing.md)):

```jsonc
// packages/component-combobox/api-extractor.json
{
  "$schema": "https://developer.microsoft.com/json-schemas/api-extractor/v7/api-extractor.schema.json",
  "mainEntryPointFilePath": "<projectFolder>/dist/index.d.ts",
  "apiReport": { "enabled": true, "reportFolder": "./api/" },
  "docModel": { "enabled": false },
  "tsdocMetadata": { "enabled": false },
}
```

Each PR that changes a public type updates the corresponding `api/<pkg>.api.md` file. Reviewers see a line-level diff of the public surface — no surprise type changes.

**Caveat:** api-extractor's d.ts rollup is per-entry-point, and Svelte's namespace-component re-exports have edge cases ([sveltejs/svelte#12785](https://github.com/sveltejs/svelte/issues/12785)). We work around by exporting each `Combobox.Root`, `Combobox.Item` as an additional named export for api-extractor's benefit.

## 8.10 JSDoc conventions for LLM friendliness

Every exported type has JSDoc with three sections (per the brief Section 2.F):

```ts
/**
 * Compound combobox root. Owns the machine instance and exposes context to children.
 *
 * @when-to-use Use when you want a single-select combobox with both filtering and async option fetching.
 *              For multi-select, compose `withMultiSelect`.
 *
 * @anti-pattern Don't put `Combobox.Root` inside a `Form.Root`'s submit handler if you want validation.
 *               Wrap with `Field.Root` instead and validate via Standard Schema.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
export interface ComboboxRootProps<T> {
  /* … */
}
```

This convention is also the basis for `llms-full.txt` ([13-docs-strategy.md](13-docs-strategy.md)).

## 8.11 Alternatives we considered

| Alternative                                                         | Verdict                                                                             |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Generic at every level**, propagated through `bind:` (no context) | ❌ Doesn't infer reliably; user has to write `<Combobox.Item<User> ...>` everywhere |
| **No generics; use `unknown`**                                      | ❌ Bad DX; users want autocomplete on `option.label`                                |
| **Generic at Root + context** (chosen)                              | ✅ Inference works on the outer call site; context cast is internal                 |
| **Class-based controller passed as prop**                           | ❌ Forces explicit instantiation; loses Svelte's auto-snippet typing                |

## 8.12 Open questions

- **TBD:** Whether to ship a Svelte plugin (LSP companion) that auto-completes Kumiki components without explicit `import * as Combobox`. Out of scope for v1.0.
- **TBD:** Strict tsconfig flags `exactOptionalPropertyTypes` — currently off because Svelte 5 prop typing collides with it. Re-evaluate per Svelte 5 minor.
- **TBD:** Whether to publish `.d.ts.map` for source navigation. Adds size; helpful for contributors. Likely yes.
