# Tabs

> Switch between mutually-exclusive panels of related content within a single page region.

| Field                               | Value                                                  |
| ----------------------------------- | ------------------------------------------------------ |
| **APG pattern**                     | [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) |
| **Bundle (Layer 4 target, brotli)** | `2.5 kB` brotli (informational)                        |
| **Status**                          | `preview` (Phase 1)                                    |
| **Activation**                      | `automatic` (default) \| `manual`                      |
| **Orientation**                     | `horizontal` (default) \| `vertical`                   |

## Anatomy

```
Tabs.Root
  ├── Tabs.List
  │   └── Tabs.Tab     (one per item, role="tab")
  └── Tabs.Panel       (one per item, role="tabpanel"; only the active is shown)
```

| Part    | Responsibility                                                     |
| ------- | ------------------------------------------------------------------ |
| `Root`  | Owns the machine; provides context; mirrors `bind:value`.          |
| `List`  | `<div role="tablist">`; orientation/RTL key handling lives here.   |
| `Tab`   | `<button role="tab">` per item; roving tabindex.                   |
| `Panel` | `<div role="tabpanel">` per item; toggles `hidden` based on state. |

## Keyboard

Source: [APG Tabs keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#keyboardinteraction). See [`apps/docs/keyboard/tabs.kb.ts`](../../apps/docs/keyboard/tabs.kb.ts) for the executable contract.

| Key               | When                     | Effect                                         |
| ----------------- | ------------------------ | ---------------------------------------------- |
| `ArrowRight`      | horizontal LTR, on a tab | Move focus to next enabled tab (skip disabled) |
| `ArrowLeft`       | horizontal LTR, on a tab | Move focus to previous enabled tab             |
| `ArrowLeft/Right` | horizontal RTL, on a tab | Inverted (`Left` = next, `Right` = prev)       |
| `ArrowDown/Up`    | vertical, on a tab       | Move focus next / previous                     |
| `Home`            | on a tab                 | Jump to first enabled tab                      |
| `End`             | on a tab                 | Jump to last enabled tab                       |
| `Enter` / `Space` | manual mode, on a tab    | Activate the focused tab (commit selection)    |

In `automatic` activation mode, focus changes also activate the tab. In `manual` mode, focus moves with arrows but only `Enter` / `Space` commits.

## ARIA

| Element | Role       | aria-\* attributes                                |
| ------- | ---------- | ------------------------------------------------- |
| `List`  | `tablist`  | `aria-orientation`, `aria-disabled`               |
| `Tab`   | `tab`      | `aria-selected`, `aria-controls`, `aria-disabled` |
| `Panel` | `tabpanel` | `aria-labelledby`, `tabindex="0"`                 |

## Source

- Machine: [`packages/machines/src/tabs`](../../packages/machines/src/tabs)
- Headless: [`packages/headless/src/tabs`](../../packages/headless/src/tabs)
- Component: [`packages/components/src/tabs`](../../packages/components/src/tabs)
- Sandbox: [`/sandbox/tabs`](../../apps/docs/src/routes/sandbox/tabs)
