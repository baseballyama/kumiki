# Select

> Pick one option from a known set. Combobox without free-text input.

| Field                     | Value                                                                      |
| ------------------------- | -------------------------------------------------------------------------- |
| **APG pattern**           | [Listbox (collapsible)](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) |
| **Bundle (Layer 4 gzip)** | within `4500 B` budget                                                     |
| **Status**                | `preview` (Phase 1)                                                        |
| **Generics**              | `<V>` — option value type                                                  |

## Anatomy

```
Select.Root<V>
  ├── Select.Trigger
  └── Select.Listbox
      └── Select.Option       (role="option", repeated)
```

| Part      | Responsibility                                             |
| --------- | ---------------------------------------------------------- |
| `Root`    | Owns machine; mirrors `bind:value` and `bind:open`.        |
| `Trigger` | `<button aria-haspopup="listbox">`; holds focus.           |
| `Listbox` | `<ul role="listbox">`; uses active-descendant pattern.     |
| `Option`  | `<li role="option">`; `aria-selected`, `data-highlighted`. |

## Keyboard

Source: [APG Listbox keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/#keyboardinteraction). See [`apps/docs/keyboard/select.kb.ts`](../../apps/docs/keyboard/select.kb.ts).

| Key                 | When                         | Effect                                    |
| ------------------- | ---------------------------- | ----------------------------------------- |
| `Enter` / `Space`   | trigger, closed              | Open the listbox                          |
| `ArrowDown` / `Up`  | trigger, closed              | Open the listbox                          |
| Printable char      | trigger, closed              | Open + seed type-ahead buffer             |
| `ArrowDown` / `Up`  | trigger, open                | Move highlight (skip disabled)            |
| `Home` / `End`      | trigger, open                | Jump to first / last enabled              |
| Printable char      | trigger, open                | Type-ahead (debounced reset after 500 ms) |
| `Enter` / `Space`   | trigger, open && highlighted | Commit selection, close                   |
| `Escape`            | trigger, open                | Close                                     |
| `Tab` / `Shift+Tab` | trigger, open                | Close (focus advances naturally)          |

Active-descendant pattern: focus stays on the trigger while the listbox is open; the trigger's `aria-activedescendant` points at the highlighted option.

## ARIA

| Element   | Role      | aria-\* attributes                                                                   |
| --------- | --------- | ------------------------------------------------------------------------------------ |
| `Trigger` | (button)  | `aria-haspopup="listbox"`, `aria-controls`, `aria-expanded`, `aria-activedescendant` |
| `Listbox` | `listbox` | `aria-labelledby` (triggerId)                                                        |
| `Option`  | `option`  | `aria-selected`, `aria-disabled`                                                     |

## Source

- Machine: [`packages/machines/src/select`](../../packages/machines/src/select)
- Headless: [`packages/headless/src/select`](../../packages/headless/src/select)
- Component: [`packages/components/src/select`](../../packages/components/src/select)
- Sandbox: [`/sandbox/select`](../../apps/docs/src/routes/sandbox/select)
