# Switch

> On/off setting (`role="switch"`, `aria-checked`).

| Field                     | Value                                                      |
| ------------------------- | ---------------------------------------------------------- |
| **APG pattern**           | [Switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) |
| **Bundle (Layer 4 gzip)** | within `1500 B` budget                                     |
| **Status**                | `preview` (Phase 1)                                        |

## Anatomy

```
Switch.Root        (role="switch", aria-checked)
```

Switch is semantically distinct from Toggle: a switch represents an immediate setting that's either on or off (e.g. "Wi-Fi"), while a toggle is a button that produces a state. Use Switch when the user-perceived action is "flipping a setting", and Toggle for "pressing a control that has a stuck state".

## Keyboard

Source: [APG Switch keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/switch/#keyboardinteraction). See [`apps/docs/keyboard/switch.kb.ts`](../../apps/docs/keyboard/switch.kb.ts).

| Key     | When      | Effect         |
| ------- | --------- | -------------- |
| `Space` | on switch | Toggle checked |
| `Enter` | on switch | Toggle checked |

## ARIA

| Element | Role     | aria-\* attributes                                   |
| ------- | -------- | ---------------------------------------------------- |
| `Root`  | `switch` | `aria-checked` ∈ `'true' / 'false'`, `aria-disabled` |

## Source

- Machine: [`packages/components/switch/machine`](../../packages/components/switch/machine)
- Attachment: [`packages/components/switch/attachment`](../../packages/components/switch/attachment)
- Component: [`packages/components/switch/component`](../../packages/components/switch/component)
- Sandbox: [`/sandbox/switch`](../../apps/docs/src/routes/sandbox/switch)
