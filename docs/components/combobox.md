# Combobox

> A single-input field with a popup listbox of suggestions. Supports filtering, async option loading, multi-select, and virtualization via composition.

| Field                     | Value                                                          |
| ------------------------- | -------------------------------------------------------------- |
| **APG pattern**           | [Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) |
| **Bundle (Layer 4 gzip)** | TBD / **4500 B**                                               |
| **Status**                | `unreleased` (target: Phase 0b)                                |
| **Phase**                 | 0b — design validation; v1.0 includes                          |
| **Layer 5 preview**       | `none` at v1.0 (Toggle and Dialog only)                        |

## Anatomy

```
Combobox.Root
  ├── Combobox.Input              (the text input)
  ├── Combobox.Trigger            (optional toggle button next to the input)
  ├── Combobox.Listbox            (the popover containing options)
  │   ├── Combobox.Item           (each suggestion, repeated)
  │   ├── Combobox.Empty          (rendered when no results)
  │   └── Combobox.Loading        (rendered during async fetch)
  └── Combobox.ClearButton        (optional clear button, role=button)
```

| Part                | Responsibility                                                       |
| ------------------- | -------------------------------------------------------------------- |
| `Root`              | Owns the machine, provides context, handles `bind:value`.            |
| `Input`             | The `<input role="combobox">` element.                               |
| `Trigger`           | Toggle button (icon-only by convention); shows/hides listbox.        |
| `Listbox`           | The popover element with `role="listbox"`. Anchored via Floating UI. |
| `Item`              | An `<li role="option">` with `aria-selected`.                        |
| `Empty` / `Loading` | Conditional content slots; rendered based on state.                  |
| `ClearButton`       | Optional reset button.                                               |

## Keyboard

Source: [APG Combobox keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#keyboardinteraction).

| Key             | Focus on | When                     | Effect                                                            |
| --------------- | -------- | ------------------------ | ----------------------------------------------------------------- |
| `ArrowDown`     | Input    | closed                   | Opens listbox; focuses **first** option (or last selected if any) |
| `ArrowDown`     | Input    | open                     | Focuses next option                                               |
| `ArrowUp`       | Input    | closed                   | Opens listbox; focuses **last** option                            |
| `ArrowUp`       | Input    | open                     | Focuses previous option                                           |
| `Home`          | Input    | open                     | Focuses first option                                              |
| `End`           | Input    | open                     | Focuses last option                                               |
| `PageDown`      | Input    | open                     | Focuses option +10 (or last)                                      |
| `PageUp`        | Input    | open                     | Focuses option −10 (or first)                                     |
| `Enter`         | Input    | open && hasFocusedOption | Selects focused option, closes                                    |
| `Tab`           | Input    | open && hasFocusedOption | Selects focused option, closes; focus moves to next focusable     |
| `Escape`        | Input    | open                     | Closes listbox; keeps input focus; preserves typed value          |
| `Escape`        | Input    | closed && hasValue       | Clears input                                                      |
| `Alt+ArrowDown` | Input    | closed                   | Opens listbox without changing focus to an option                 |
| `Alt+ArrowUp`   | Input    | open                     | Closes listbox; keeps input focus                                 |
| Printable char  | Input    | (any)                    | Updates query; transitions machine to `editing`                   |

In **RTL** (`dir="rtl"`), `ArrowLeft` and `ArrowRight` are handled when the component is presented horizontally — but Combobox's vertical listbox semantics make this less relevant than for Tabs / Slider. Tested per [`apps/docs/tests/combobox.kb.test.ts`](../../apps/docs/tests/) (Phase 0b).

## ARIA

| Element       | Role       | Attributes (open / closed states)                                                                                                                         |
| ------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Root`        | —          | `data-state` (`open` / `closed` / `loading`), `data-direction`                                                                                            |
| `Input`       | `combobox` | `aria-expanded` (`true`/`false`), `aria-controls` (id of Listbox), `aria-activedescendant` (id of focused option), `aria-autocomplete` (`list` or `both`) |
| `Trigger`     | `button`   | `tabindex="-1"` (handled by parent input), `aria-label` (e.g., "Show options"), `aria-controls`                                                           |
| `Listbox`     | `listbox`  | `id`, `aria-label` (or `aria-labelledby` if a `<label>` is present)                                                                                       |
| `Item`        | `option`   | `aria-selected` (`true`/`false`), `id`                                                                                                                    |
| `ClearButton` | `button`   | `aria-label` ("Clear input")                                                                                                                              |

## State machine

```
combobox
├── closed                               // initial; input not focused
├── open
│   ├── filtering                        // sync filter against `options` prop
│   ├── async-loading                    // fetcher in flight
│   ├── empty                            // no results
│   └── populated                        // listbox has items
└── selected                             // value committed; input shows label
```

Visualizer: drop `createComboboxMachine().toJSON()` into [stately.ai/viz](https://stately.ai/viz). The JSON will be embedded inline in the docs site at v1.0 time.

### Events

| Event            | Payload                                                                              |
| ---------------- | ------------------------------------------------------------------------------------ |
| `INPUT.FOCUS`    | —                                                                                    |
| `INPUT.BLUR`     | —                                                                                    |
| `INPUT.CHANGE`   | `{ value: string }`                                                                  |
| `INPUT.ESCAPE`   | —                                                                                    |
| `INPUT.ENTER`    | —                                                                                    |
| `INPUT.NAVIGATE` | `{ direction: 'next' \| 'prev' \| 'first' \| 'last' \| 'page-next' \| 'page-prev' }` |
| `OPTION.HOVER`   | `{ id: string }`                                                                     |
| `OPTION.CLICK`   | `{ option: T }`                                                                      |
| `TRIGGER.CLICK`  | —                                                                                    |
| `FETCH.RESOLVE`  | `{ options: T[]; token: number }`                                                    |
| `FETCH.REJECT`   | `{ error: Error; token: number }`                                                    |
| `RESET`          | —                                                                                    |

## API

### `Combobox.Root`

```ts
import type { Snippet } from 'svelte';
import type { StandardSchemaV1 } from '@kumiki/types';

type Props<T> = {
  /**
   * @when-to-use Required. The full set of options to filter against (sync mode), or the initial
   *              empty set when composed with `withAsyncSearch`.
   */
  options: T[];

  /** Bindable. Currently selected option, or `null` if none. */
  value?: T | null;

  /** Callback fired when value changes. Use as an alternative to `bind:value`. */
  onValueChange?: (value: T | null) => void;

  /** Function returning the display label for an option. Default: `String(option)`. */
  getLabel?: (option: T) => string;

  /** Function returning a stable id for an option. Default: `String(getLabel(option))`. */
  getId?: (option: T) => string;

  /**
   * Standard Schema validator. When supplied, the component composes `withValidation` internally.
   * @see https://standardschema.dev/
   */
  validator?: StandardSchemaV1<T>;

  /** Async fetcher. When supplied, composes `withAsyncSearch` internally. */
  async?: (query: string, signal: AbortSignal) => Promise<T[]>;

  /** Multi-select shorthand. Composes `withMultiSelect`. */
  multi?: boolean;

  /** Virtualization shorthand. Composes `withVirtualization`. */
  virtualize?: boolean | { itemHeight: number; overscan?: number };

  /** Disabled state. */
  disabled?: boolean;

  children: Snippet;
};
```

### `Combobox.Input`

```ts
type Props = {
  placeholder?: string;
  /** Render delegation. */
  child?: Snippet<[payload: { props: InputProps }]>;
  children?: Snippet;
};
```

### `Combobox.Listbox`

```ts
type Props = {
  /** Snippet receiving each option for rendering an Item. */
  item?: Snippet<[option: T, index: number]>;
  /** Snippet rendered when no results. */
  empty?: Snippet;
  /** Snippet rendered while async fetch in flight. */
  loading?: Snippet;
  children?: Snippet;
};
```

### `Combobox.Item`

```ts
type Props<T> = {
  value: T;
  disabled?: boolean;
  child?: Snippet<[payload: { props: ItemProps; state: { selected: boolean; focused: boolean } }]>;
  children: Snippet;
};
```

## Examples

### Basic (sync filter)

```svelte
<script lang="ts">
  import { Combobox } from '@kumiki/components/combobox';

  type User = { id: string; name: string };
  const users: User[] = [/* ... */];
  let selected = $state<User | null>(null);
</script>

<Combobox.Root<User> options={users} bind:value={selected} getLabel={(u) => u.name}>
  <Combobox.Input placeholder="Search users…" />
  <Combobox.Listbox>
    {#snippet item(user)}
      <Combobox.Item value={user}>{user.name}</Combobox.Item>
    {/snippet}
    {#snippet empty()}
      <li>No users found.</li>
    {/snippet}
  </Combobox.Listbox>
</Combobox.Root>
```

### With Standard Schema validation

```svelte
<script lang="ts">
  import { Combobox } from '@kumiki/components/combobox';
  import { z } from 'zod';

  const schema = z.object({ id: z.string() }).strict();
</script>

<Combobox.Root options={users} validator={schema}>...</Combobox.Root>
```

### With async fetcher

```svelte
<script lang="ts">
  import { Combobox } from '@kumiki/components/combobox';

  async function fetchUsers(query: string, signal: AbortSignal) {
    const res = await fetch(`/api/users?q=${encodeURIComponent(query)}`, { signal });
    return res.ok ? res.json() : [];
  }
</script>

<Combobox.Root options={[]} async={fetchUsers}>
  <Combobox.Input placeholder="Search…" />
  <Combobox.Listbox>
    {#snippet item(u)}
      <Combobox.Item value={u}>{u.name}</Combobox.Item>
    {/snippet}
    {#snippet loading()}
      <li>Searching…</li>
    {/snippet}
    {#snippet empty()}
      <li>No matches.</li>
    {/snippet}
  </Combobox.Listbox>
</Combobox.Root>
```

### With virtualization (large lists)

```svelte
<Combobox.Root options={hugeOptionList} virtualize={{ itemHeight: 32 }}>...</Combobox.Root>
```

### With multi-select

```svelte
<script lang="ts">
  let selected = $state<User[]>([]);
</script>

<Combobox.Root multi options={users} bind:value={selected}>...</Combobox.Root>
```

### Render delegation (custom input element)

```svelte
<Combobox.Input>
  {#snippet child({ props })}
    <input {...props} class="my-input" />
  {/snippet}
</Combobox.Input>
```

### RTL

```svelte
<LocaleProvider locale="ar" dir="rtl" messages={arMessages}>
  <Combobox.Root options={users} ...>...</Combobox.Root>
</LocaleProvider>
```

## Accessibility checklist

- [ ] APG link: ✅ — present at top of this doc.
- [ ] Keyboard table fully implemented per APG.
- [ ] `aria-expanded`, `aria-controls`, `aria-activedescendant`, `aria-autocomplete` correct in every state.
- [ ] axe-core passes for `closed`, `open`, `open.empty`, `open.loading`, `disabled`, `error` × LTR + RTL.
- [ ] Tested with macOS-VoiceOver, Windows-NVDA via Guidepup smoke.
- [ ] Listbox has `aria-label` (sourced from `@kumiki/locale/<lang>.combobox.listboxLabel`).
- [ ] `prefers-reduced-motion` honored — when option list autoscrolls, motion is suppressed.

## Anti-patterns

- **Don't put a Combobox inside a Tooltip's content.** Tooltips can't host interactive widgets per APG. Use a Popover instead.
- **Don't compose `withAsyncSearch` and `withVirtualization` blindly with massive option counts** — virtualization is fine, but the async response shape needs care to avoid memory churn.
- **Don't supply both `options` and `async={fetcher}` and expect `options` to act as fallback.** When `async` is set, `options` is the _initial empty set_ (or pre-loaded set); the fetcher is authoritative.
- **Don't manually write `aria-*` on `Combobox.Input`** — those are computed and will be overwritten.

## Disabled axe rules (sandbox)

| Rule     | Why                                                                                          |
| -------- | -------------------------------------------------------------------------------------------- |
| `region` | Sandbox fixture pages don't have landmarks; full-page tests cover landmark rules separately. |

## Composition

Optional features layered on top of the base controller. Each is its own
subpath import and tree-shakes when not used. See
[combobox-composition.md](combobox-composition.md) for full usage examples
and bundle costs.

Shipped (Phase 0b):

- [`withValidation(base, schema)`](combobox-composition.md#withvalidationbase-schema) — Standard Schema validation, race-token guarded
- [`withAsyncSearch(base, fetcher, opts?)`](combobox-composition.md#withasyncsearchbase-fetcher-options) — abort-aware fetcher
- [`withMultiSelect(base, initial?)`](combobox-composition.md#withmultiselectbase-initial) — `selected: T[]` semantics
- [`withVirtualization(base, opts)`](combobox-composition.md#withvirtualizationbase-itemheight-overscan) — fixed-row windowing

Roadmap (not yet shipped):

- `withAsyncOptions(base, loader)` — lazy initial option set (open → fetch)
- `withTypeahead(base, opts)` — character-jump
- `withControlledOpen(base, opts)` / `withControlledValue(base, opts)` — externally controlled

## Related

- [Select](select.md) — single-select with no free text input.
- [Listbox](listbox.md) (Phase 2) — the popup-only primitive used by Combobox and Select.
- [Field](form-field.md) — wraps Combobox in a form-validation-aware container.
