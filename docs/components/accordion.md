# Accordion

> Stacked disclosure regions. Keyboard navigation across triggers via roving focus; expansion mode is `single` or `multiple` per the consumer's pick.

| Field                               | Value                                                            |
| ----------------------------------- | ---------------------------------------------------------------- |
| **APG pattern**                     | [Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) |
| **Bundle (Layer 4 target, brotli)** | `2 kB` brotli (informational)                                    |
| **Status**                          | `preview` (Phase 2)                                              |

## Anatomy

```
Accordion.Root           (owns the controller + items array)
└─ Accordion.Item        (per-disclosure section; gets the item via prop)
   ├─ Accordion.Trigger  (button that toggles the panel)
   └─ Accordion.Panel    (region with id wired to trigger's aria-controls)
```

`Root` is generic over the item value type `V`; iterate the items via the `children` snippet args so updates flow through reactively. Each `Item` is keyed by `item.id` in the consumer's `#each`.

## Keyboard

Source: [APG Accordion keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/#keyboardinteraction).

| Key               | When       | Effect                                                         |
| ----------------- | ---------- | -------------------------------------------------------------- |
| `Space` / `Enter` | on trigger | Toggle panel (and, in `single` mode, close any other open one) |
| `ArrowDown`       | on trigger | Move focus to the next trigger                                 |
| `ArrowUp`         | on trigger | Move focus to the previous trigger                             |
| `Home` / `End`    | on trigger | Move focus to the first / last trigger                         |

## ARIA

| Element   | Role     | aria-\* attributes                                |
| --------- | -------- | ------------------------------------------------- |
| `Root`    | (none)   | `data-orientation`                                |
| `Item`    | (none)   | `data-state` ∈ `'open' / 'closed'`                |
| `Trigger` | (button) | `aria-controls`, `aria-expanded`, `aria-disabled` |
| `Panel`   | `region` | `aria-labelledby`, `hidden` while collapsed       |

## Source

- Machine: [`packages/machines/src/accordion`](../../packages/machines/src/accordion)
- Headless: [`packages/headless/src/accordion`](../../packages/headless/src/accordion)
- Component: [`packages/components/src/accordion`](../../packages/components/src/accordion)
- Sandbox: [`/sandbox/accordion`](../../apps/docs/src/routes/sandbox/accordion)
