# Menu

> Action list invoked from a button. `role="menu"` popup with `role="menuitem"` rows, active-descendant cursor, full APG keyboard navigation, and optional separators. Single-level — submenus are deferred.

| Field                     | Value                                                               |
| ------------------------- | ------------------------------------------------------------------- |
| **APG pattern**           | [Menu / Menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) |
| **Bundle (Layer 4 gzip)** | within `3500 B` budget                                              |
| **Status**                | `preview` (Phase 2; submenus pending)                               |

## Anatomy

```
Menu.Root             (owns the controller; items array)
├─ Menu.Trigger       (button with aria-haspopup="menu")
└─ Menu.Menu          (the popup, role="menu")
   ├─ Menu.Item × N   (role="menuitem"; click / Enter / Space activates)
   └─ Menu.Separator  (role="separator"; skipped during navigation)
```

`Root`'s `children` snippet receives `{ items, controller }` so the consumer iterates and renders `<Item>` / `<Separator>` per `item.kind`. Activation flows through `controller.activate(id)` (or click / Enter / Space on a highlighted item) and fires the `onSelect(item)` callback configured on `Root`.

## Keyboard

Source: [APG Menubar keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/#keyboardinteraction). See [`apps/docs/keyboard/menu.kb.ts`](../../apps/docs/keyboard/menu.kb.ts).

| Key                             | When         | Effect                                                 |
| ------------------------------- | ------------ | ------------------------------------------------------ |
| `Enter` / `Space` / `ArrowDown` | on trigger   | Open menu, highlight first enabled item                |
| `ArrowUp`                       | on trigger   | Open menu, highlight last enabled item (APG)           |
| `ArrowDown` / `ArrowUp`         | on open menu | Navigate next / previous (skips separators + disabled) |
| `Home` / `End`                  | on open menu | Jump to first / last enabled item                      |
| `Enter` / `Space`               | on open menu | Activate the highlighted item, close, fire onSelect    |
| `Escape`                        | on open menu | Close the menu (no activation)                         |
| `Tab`                           | on open menu | Close + let focus advance naturally                    |
| Printable characters            | on open menu | Typeahead jumps to matching item (500 ms quiet reset)  |
| Outside click                   | document     | Close                                                  |

## ARIA

| Element     | Role        | aria-\* attributes                                                                            |
| ----------- | ----------- | --------------------------------------------------------------------------------------------- |
| `Trigger`   | (button)    | `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, `aria-activedescendant` (when open) |
| `Menu`      | `menu`      | `aria-labelledby=<trigger id>`, `tabindex="-1"`                                               |
| `Item`      | `menuitem`  | `aria-disabled` (when disabled), `data-highlighted` (cursor)                                  |
| `Separator` | `separator` | (no further attributes)                                                                       |

## Source

- Machine: [`packages/machines/src/menu`](../../packages/machines/src/menu)
- Headless: [`packages/headless/src/menu`](../../packages/headless/src/menu)
- Component: [`packages/components/src/menu`](../../packages/components/src/menu)
- Sandbox: [`/sandbox/menu`](../../apps/docs/src/routes/sandbox/menu)
