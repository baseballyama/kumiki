# Slider

> Continuous numeric input. A focusable thumb on a track; arrow keys nudge by `step`, page keys by `pageStep`, Home/End jump to the bounds.

| Field                     | Value                                                      |
| ------------------------- | ---------------------------------------------------------- |
| **APG pattern**           | [Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/) |
| **Bundle (Layer 4 gzip)** | within `2500 B` budget                                     |
| **Status**                | `preview` (Phase 2)                                        |

## Anatomy

```
Slider.Root        (the track container; pointer-down anywhere maps to a value)
└─ Slider.Thumb    (the focusable indicator with role="slider")
```

`Root` owns the controller and shares it via context. `Thumb` paints `aria-valuemin/max/now`, `aria-orientation`, and a `--kumiki-slider-pct` CSS custom property the consumer's stylesheet uses for thumb positioning (LTR + RTL handled).

## Keyboard

Source: [APG Slider keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/slider/#keyboardinteraction). See [`apps/docs/keyboard/slider.kb.ts`](../../apps/docs/keyboard/slider.kb.ts).

| Key                                | When     | Effect                              |
| ---------------------------------- | -------- | ----------------------------------- |
| `ArrowRight` / `ArrowUp` (LTR)     | on thumb | Increment by `step`                 |
| `ArrowLeft` / `ArrowDown` (LTR)    | on thumb | Decrement by `step`                 |
| `ArrowLeft` / `ArrowUp` (RTL)      | on thumb | Increment by `step` (axis inverted) |
| `ArrowRight` / `ArrowDown` (RTL)   | on thumb | Decrement by `step`                 |
| `ArrowUp` / `ArrowDown` (vertical) | on thumb | Increment / decrement               |
| `PageUp` / `PageDown`              | on thumb | Increment / decrement by `pageStep` |
| `Home` / `End`                     | on thumb | Jump to `min` / `max`               |

## ARIA

| Element | Role     | aria-\* attributes                                                                     |
| ------- | -------- | -------------------------------------------------------------------------------------- |
| `Root`  | (none)   | `data-orientation`, `data-disabled` (when applicable)                                  |
| `Thumb` | `slider` | `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-orientation`, `aria-disabled` |

## Source

- Machine: [`packages/components/slider/machine`](../../packages/components/slider/machine)
- Attachment: [`packages/components/slider/attachment`](../../packages/components/slider/attachment)
- Component: [`packages/components/slider/component`](../../packages/components/slider/component)
- Sandbox: [`/sandbox/slider`](../../apps/docs/src/routes/sandbox/slider)
