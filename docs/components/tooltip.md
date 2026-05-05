# Tooltip

> Brief, non-interactive hint shown on hover or focus of a focusable trigger.

| Field                               | Value                                                        |
| ----------------------------------- | ------------------------------------------------------------ |
| **APG pattern**                     | [Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) |
| **Bundle (Layer 4 target, brotli)** | within `3500 B` budget (Floating UI not bundled)             |
| **Status**                          | `preview` (Phase 1)                                          |
| **Delays**                          | `openDelay: 700ms`, `closeDelay: 300ms` (defaults)           |

## Anatomy

```
Tooltip.Root
  ├── Tooltip.Trigger        (the focusable element the tooltip describes)
  └── Tooltip.Content        (role="tooltip"; hidden when closed)
```

## Keyboard

Source: [APG Tooltip keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/#keyboardinteraction). See [`apps/docs/keyboard/tooltip.kb.ts`](../../apps/docs/keyboard/tooltip.kb.ts).

| Key      | When    | Effect                                  |
| -------- | ------- | --------------------------------------- |
| (focus)  | trigger | Opens tooltip after `openDelay`         |
| (blur)   | trigger | Closes tooltip after `closeDelay`       |
| `Escape` | open    | Closes immediately, regardless of delay |

`prefers-reduced-motion: reduce` short-circuits both delays to 0 — the tooltip opens / closes immediately. Pointer transit from trigger to content keeps the tooltip alive (`disableHoverableContent: false`, default).

## ARIA

| Element   | Role      | aria-\* attributes                |
| --------- | --------- | --------------------------------- |
| `Trigger` | (button)  | `aria-describedby` (contentId)    |
| `Content` | `tooltip` | (role only; visibility via state) |

Per APG: tooltip content is descriptive and non-interactive. Don't put buttons, links, or focusables inside — that's Popover / Dialog territory.

## Source

- Machine: [`packages/machines/src/tooltip`](../../packages/machines/src/tooltip)
- Headless: [`packages/headless/src/tooltip`](../../packages/headless/src/tooltip)
- Component: [`packages/components/src/tooltip`](../../packages/components/src/tooltip)
- Sandbox: [`/sandbox/tooltip`](../../apps/docs/src/routes/sandbox/tooltip)
