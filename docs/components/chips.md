# Chips

> Compact label / tag, with non-interactive, dismissible, and selectable variants.

| Field                               | Value                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **APG pattern**                     | none for non-interactive; [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) when dismissible |
| **Bundle (Layer 4 target, brotli)** | `1.2 kB` brotli (target)                                                                              |
| **Status**                          | `unreleased` (Phase 1.5)                                                                              |

## Anatomy

```
Chips.Root            (variant: 'static' | 'dismissible' | 'selectable')
  ├── Chips.Avatar?   (optional leading visual)
  ├── Chips.Label     (visible text — accessible name)
  └── Chips.Close?    (only when dismissible)
```

## Variants

| Variant       | Element                     | Notes                                                                                  |
| ------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| `static`      | `<span>`                    | Pure label. No interactivity.                                                          |
| `dismissible` | `<span>` + `<button>` close | Static surface with a sibling Close button. The chip itself does not receive focus.    |
| `selectable`  | `<button>` (single)         | Toggle behavior; `aria-pressed`. Used in filter-chip rows where each chip is a toggle. |

The selectable variant is **not** a Combobox option — for multi-select
combobox chip rendering, use `Combobox.SelectedItem` from
`combobox/with-multi-select`.

## ARIA

| Element / Variant  | Role / aria                                                    |
| ------------------ | -------------------------------------------------------------- |
| `static` Root      | (none)                                                         |
| `dismissible` Root | (none); Close is a Button with `aria-label` ("Remove {label}") |
| `selectable` Root  | Button; `aria-pressed`                                         |

## Keyboard

| Variant       | Key                                               | Effect  |
| ------------- | ------------------------------------------------- | ------- |
| `dismissible` | `Backspace` on Close, or `Enter`/`Space` on Close | Dismiss |
| `selectable`  | `Space` / `Enter`                                 | Toggle  |

For chip-row keyboard navigation (Left/Right between chips), wrap in
`Toolbar.Root` (Phase 1.5).

## API

```ts
type RootProps =
  | { variant?: 'static'; children: Snippet }
  | { variant: 'dismissible'; onDismiss: () => void; label: string; children: Snippet }
  | {
      variant: 'selectable';
      pressed: boolean;
      onPressedChange: (v: boolean) => void;
      children: Snippet;
    };
```

## i18n strings

| Key            | en               | ja              |
| -------------- | ---------------- | --------------- |
| `chips.remove` | `Remove {label}` | `{label}を削除` |

`@kumiki/locale/<lang>/chips`.

## Examples

```svelte
<!-- dismissible -->
<Chips.Root variant="dismissible" label="Tag: design" onDismiss={remove}>
  <Chips.Label>design</Chips.Label>
  <Chips.Close />
</Chips.Root>

<!-- selectable filter chip -->
<Chips.Root variant="selectable" bind:pressed={isActive}>
  <Chips.Label>Open</Chips.Label>
</Chips.Root>
```

## Source

- Component: [`packages/components/src/chips`](../../packages/components/src/chips)

## Anti-patterns

- Don't make the _whole_ dismissible chip clickable; users hit Close by accident. Keep the Close button as the only target.
- Don't use chips for navigation; that's `<a>` territory.
- Don't put a chip inside a button — interactive descendants.

## Related

- [Badge](badge.md) — pure non-interactive label, no avatar slot.
- [Toolbar](#) — for chip-row keyboard navigation.
