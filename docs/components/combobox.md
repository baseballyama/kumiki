# Combobox

> A single-input field with a popup listbox of suggestions. Supports filtering, async option loading, multi-select, and virtualization via composition.

| Field                               | Value                                                          |
| ----------------------------------- | -------------------------------------------------------------- |
| **APG pattern**                     | [Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) |
| **Bundle (Layer 4 target, brotli)** | `4.5 kB` brotli (informational)                                |
| **Status**                          | `preview` (Phase 0b shipped — base + 4 with-\* compositions)   |
| **Layer 5 preview**                 | `none` at v1.0 (Toggle and Dialog only)                        |

## Anatomy

```
Combobox.Root
  ├── Combobox.Input         (the text input)
  ├── Combobox.Trigger       (optional toggle button next to the input)
  └── Combobox.Listbox       (the popover containing options)
      └── Combobox.Item      (each suggestion, repeated)
```

| Part      | Responsibility                                                       |
| --------- | -------------------------------------------------------------------- |
| `Root`    | Owns the machine, provides context, handles `bind:value`.            |
| `Input`   | The `<input role="combobox">` element.                               |
| `Trigger` | Toggle button (icon-only by convention); shows/hides listbox.        |
| `Listbox` | The popover element with `role="listbox"`. Anchored via Floating UI. |
| `Item`    | An `<li role="option">` with `aria-selected`.                        |

> Empty-state and loading-state UI are caller-provided through the `Listbox` snippet — the controller exposes `status: 'idle' | 'loading' | 'error'` and a derived `filtered: ReadonlyArray<T>`, so the consumer's `{#snippet item(...)}` block + a sibling `{#if controller.status === 'loading'}` covers both. There are no dedicated `Loading`/`Empty`/`ClearButton` subcomponents — keeps the bundle smaller.

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

| Element   | Role       | Attributes (open / closed states)                                                                                                                         |
| --------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Root`    | —          | `data-state` (`open` / `closed` / `loading`), `data-direction`                                                                                            |
| `Input`   | `combobox` | `aria-expanded` (`true`/`false`), `aria-controls` (id of Listbox), `aria-activedescendant` (id of focused option), `aria-autocomplete` (`list` or `both`) |
| `Trigger` | `button`   | `aria-controls` (id of Listbox), `aria-haspopup="listbox"`, `aria-expanded`, `aria-label` (e.g., "Show options")                                          |
| `Listbox` | `listbox`  | `id`, `aria-label` (or `aria-labelledby` if a `<label>` is present)                                                                                       |
| `Item`    | `option`   | `aria-selected` (`true`/`false`), `id`, `aria-disabled` when option is disabled                                                                           |

## State machine

`ComboboxState`:

```
combobox
├── idle                                 // input not focused; default
├── open                                 // listbox visible
└── disabled                             // not interactive
```

Loading / empty / populated are reflected through **context**, not states:
the `status: 'idle' | 'loading' | 'error'` field flips while an async
fetcher is in flight, and `filtered: ReadonlyArray<T>` derives from the
current query. Consumers render UI off these.

Visualizer: drop `createComboboxMachine().toJSON()` into [stately.ai/viz](https://stately.ai/viz). The JSON is XState-compatible.

### Events

| Event                | Payload                                                                              |
| -------------------- | ------------------------------------------------------------------------------------ |
| `INPUT.FOCUS`        | —                                                                                    |
| `INPUT.BLUR`         | —                                                                                    |
| `INPUT.CHANGE`       | `{ value: string }`                                                                  |
| `INPUT.ESCAPE`       | —                                                                                    |
| `INPUT.ENTER`        | —                                                                                    |
| `INPUT.NAVIGATE`     | `{ direction: 'next' \| 'prev' \| 'first' \| 'last' \| 'page-next' \| 'page-prev' }` |
| `OPTION.HIGHLIGHT`   | `{ id: string }`                                                                     |
| `OPTION.SELECT`      | `{ option: T }`                                                                      |
| `TRIGGER.CLICK`      | —                                                                                    |
| `OPEN` / `CLOSE`     | —                                                                                    |
| `FETCH.LOADING`      | `{ token: number }`                                                                  |
| `FETCH.RESOLVE`      | `{ options: T[]; token: number }`                                                    |
| `FETCH.REJECT`       | `{ error: Error; token: number }`                                                    |
| `SET.VALUE`          | `{ value: T \| null }`                                                               |
| `RESET`              | —                                                                                    |
| `DISABLE` / `ENABLE` | —                                                                                    |

## API

### `Combobox.Root`

The Root keeps a tight surface — async / validation / multi-select /
virtualization are **not** prop flags here; they're separate
composition subpaths under `@kumiki/headless/combobox/with-*` that
wrap the bare controller. See [combobox-composition.md](combobox-composition.md).

```ts
import type { Snippet } from 'svelte';
import type { ComboboxOption } from '@kumiki/machines/combobox';

type Props<T extends ComboboxOption> = {
  /** Source list of options. Empty array is fine for async-only mode. */
  options?: ReadonlyArray<T>;
  /** Bindable selected value. Pass `null` for "no selection". */
  value?: T | null;
  /** Initial selection for uncontrolled mode. */
  defaultValue?: T | null;
  /** Initial query for uncontrolled mode. */
  defaultQuery?: string;
  /** Disabled state. */
  disabled?: boolean;
  /** Page step for PageUp / PageDown navigation. Default: 10. */
  pageSize?: number;
  /** Custom sync filter. Default: case-insensitive label substring match. */
  filter?: (options: ReadonlyArray<T>, query: string) => ReadonlyArray<T>;

  onValueChange?: (value: T | null) => void;
  onOpenChange?: (open: boolean) => void;
  onQueryChange?: (query: string) => void;

  /** Stable id override. Auto-generated if omitted. */
  id?: string;

  children: Snippet;
};
```

`ComboboxOption` requires `id: string` (and optionally `disabled?: boolean`,
`label?: string`) — that's how the controller tracks selection across
filter results. Use a custom `filter` for cases the default substring
match doesn't cover (fuzzy match, secondary fields, etc).

### `Combobox.Input`

```ts
type Props = {
  placeholder?: string;
  /** Spread onto the underlying <input>. Useful for class, style, etc. */
  [key: string]: unknown;
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
  /** Default content; rendered if `item` snippet not provided. */
  children?: Snippet;
};
```

### `Combobox.Item`

```ts
type Props<T> = {
  /** The option this item represents. Spread on `data-value`. */
  value: T;
  children: Snippet;
};
```

`disabled` is read from the option's `disabled` field, not from a
prop; the controller paints `aria-disabled` automatically.

## Examples

### Basic (sync filter)

```svelte
<script lang="ts">
  import { Combobox } from '@kumiki/components';

  type User = { id: string; label: string };
  const users: User[] = [/* ... */];
  let selected = $state<User | null>(null);
</script>

<Combobox.Root<User> options={users} bind:value={selected}>
  <Combobox.Input placeholder="Search users…" />
  <Combobox.Listbox>
    {#snippet item(user)}
      <Combobox.Item value={user}>{user.label}</Combobox.Item>
    {/snippet}
    {#snippet empty()}
      <li>No users found.</li>
    {/snippet}
  </Combobox.Listbox>
</Combobox.Root>
```

`ComboboxOption` requires `id` + `label` (the default substring filter
matches against `label`). For richer types pass a custom `filter` prop.

### With Standard Schema validation

```svelte
<script lang="ts">
  import { Combobox } from '@kumiki/components';
  import { z } from 'zod';

  const schema = z.object({ id: z.string() }).strict();
</script>

<Combobox.Root options={users} validator={schema}>...</Combobox.Root>
```

### With async fetcher

```svelte
<script lang="ts">
  import { Combobox } from '@kumiki/components';

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
