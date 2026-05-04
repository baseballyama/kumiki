# RadioGroup

> Mutually-exclusive option group with arrow-key navigation.

| Field                     | Value                                                    |
| ------------------------- | -------------------------------------------------------- |
| **APG pattern**           | [Radio](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) |
| **Bundle (Layer 4 gzip)** | within `2000 B` budget                                   |
| **Status**                | `preview` (Phase 1)                                      |
| **Generics**              | `<V>` — item value type                                  |

## Anatomy

```
RadioGroup.Root<V>
  └── RadioGroup.Item     (role="radio", repeated; one per item)
```

## Keyboard

Source: [APG Radio keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/radio/#keyboardinteraction). See [`apps/docs/keyboard/radio-group.kb.ts`](../../apps/docs/keyboard/radio-group.kb.ts).

| Key                   | When     | Effect                                           |
| --------------------- | -------- | ------------------------------------------------ |
| `ArrowDown` / `Right` | on radio | Move focus + select next enabled (axis-agnostic) |
| `ArrowUp` / `Left`    | on radio | Move focus + select previous enabled             |
| `Home`                | on radio | Jump to first enabled                            |
| `End`                 | on radio | Jump to last enabled                             |
| `Space`               | on radio | Commit (idempotent if already selected)          |

Per APG: arrow keys move focus AND select (select-on-focus). Disabled items are skipped. Tabbing into the group lands on the _selected_ item if any, else the first enabled.

## ARIA

| Element | Role         | aria-\* attributes                          |
| ------- | ------------ | ------------------------------------------- |
| `Root`  | `radiogroup` | `aria-disabled`                             |
| `Item`  | `radio`      | `aria-checked`, `aria-disabled`, `tabindex` |

## Source

- Machine: [`packages/components/radio-group/machine`](../../packages/components/radio-group/machine)
- Attachment: [`packages/components/radio-group/attachment`](../../packages/components/radio-group/attachment)
- Component: [`packages/components/radio-group/component`](../../packages/components/radio-group/component)
- Sandbox: [`/sandbox/radio-group`](../../apps/docs/src/routes/sandbox/radio-group)
