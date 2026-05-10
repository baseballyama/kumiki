# IconButton

> Single-icon button with type-level accessible-name enforcement.

| Field                               | Value                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| **APG pattern**                     | [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/)                      |
| **Bundle (Layer 4 target, brotli)** | shares `@kumiki/components/button` budget (no separate machine, no separate L3) |
| **Status**                          | `preview` (Phase 1.5)                                                           |
| **Layer 5 preview**                 | `tailwind+vanilla`                                                              |

## Why no machine, no Layer 3

`IconButton` is `Button` with two extra constraints:

1. **The default content is an icon snippet**, not a text label.
2. **An accessible name is required at the type level** — `aria-label` or
   `aria-labelledby` is non-optional, per [ADR 0014](../design/16-decisions/0014-icon-strategy.md).

Both constraints live entirely in Svelte's prop typing. Lifting them into a
Layer 2 FSM or a Layer 3 attachment factory would buy nothing — the existing
`@kumiki/machines/button` (or, equivalently, the unmachined native `<button>`
delegation in `@kumiki/components/button`) already covers click / Enter /
Space / disabled. This is the same call recorded for `Toolbar.Root` /
`Toolbar.Item` (pure DOM bookkeeping, no FSM): when no _state_ is being
tracked, a machine is the wrong abstraction.

If you need a state-bearing icon button (toggle, two-mode), use
`@kumiki/components/toggle` with an icon child instead.

## Anatomy

```
IconButton.Root  (a native <button> rendering an icon snippet)
```

`IconButton.Root` accepts a `child` snippet for render delegation per the
[`child`-snippet pattern](../design/08-typescript.md#child-snippet) (the v2
replacement for `asChild`). Pass it to render any focusable element instead
of the default `<button>`.

## Keyboard

Source: [APG Button keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/button/#keyboardinteraction).
See [`apps/docs/keyboard/icon-button.kb.ts`](../../apps/docs/keyboard/icon-button.kb.ts) (planned — track A-2).

| Key     | When    | Effect               |
| ------- | ------- | -------------------- |
| `Space` | focused | Activates the button |
| `Enter` | focused | Activates the button |

## ARIA

| Element | Role     | aria-\* attributes                                                                                             |
| ------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `Root`  | (button) | **`aria-label`** _or_ **`aria-labelledby`** (one is required at the type level), `aria-disabled` when disabled |

## API

### `IconButton.Root`

```ts
type IconButtonBaseProps = {
  /**
   * Visual icon. Consumer-supplied per ADR 0014 — no peer dep on an icon set.
   *
   * @when-to-use Any time you want an icon-only control with an SR-readable name.
   * @anti-pattern Don't put visible text in the icon snippet — use Button instead.
   * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
   */
  icon: Snippet;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onclick?: (event: MouseEvent) => void;
  /** Render delegation — see docs/design/08-typescript.md#child-snippet. */
  child?: Snippet<[payload: { props: Record<string, unknown> }]>;
};

// Accessible name is required — typed as a discriminated union so TS
// rejects `<IconButton.Root icon={…} />` without one.
type IconButtonProps =
  | (IconButtonBaseProps & { 'aria-label': string })
  | (IconButtonBaseProps & { 'aria-labelledby': string });
```

## Examples

### Basic

```svelte
<script lang="ts">
  import { IconButton } from '@kumiki/components/icon-button';
  import TrashIcon from '$lib/icons/Trash.svelte';
</script>

<IconButton.Root aria-label="Delete row" onclick={() => remove(row)}>
  {#snippet icon()}
    <TrashIcon />
  {/snippet}
</IconButton.Root>
```

### With `aria-labelledby`

```svelte
<span id="search-help" class="sr-only">Search the catalog</span>
<IconButton.Root aria-labelledby="search-help" onclick={openSearch}>
  {#snippet icon()}
    <SearchIcon />
  {/snippet}
</IconButton.Root>
```

### RTL

`IconButton` has no horizontal-direction-sensitive behavior; the wrapper inherits the document's
`dir` and any visual flip is the consumer icon's concern.

## Accessibility checklist

- [ ] APG link present.
- [ ] `aria-label | aria-labelledby` enforced at the type level (per ADR 0014).
- [ ] `axe-core` passes for every documented state in LTR + RTL.
- [ ] `:focus-visible` supported (no default `outline: none`).
- [ ] `prefers-reduced-motion` honored where the button animates (e.g. ripple).
- [ ] Screen-reader smoke test passes on macOS-VoiceOver and Windows-NVDA.

## Anti-patterns

- Don't ship an `IconButton` without an accessible name — the type system rejects it.
- Don't use `IconButton` for two-state controls (Bold/Italic toolbar buttons). Use
  `Toggle` so the pressed state is exposed via `aria-pressed`.
- Don't depend on icon shape alone to convey meaning (low-vision / cognitive
  accessibility) — pair with a tooltip or visible affordance.

## Related

- [Button](button.md) — when you have visible text, not just an icon.
- [Toggle](toggle.md) — when the control has a two-state pressed/unpressed semantic.
- [ADR 0014](../design/16-decisions/0014-icon-strategy.md) — icons are consumer-supplied.
