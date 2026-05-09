# Toggle

> Two-state on/off button (`aria-pressed`).

| Field                               | Value                                                               |
| ----------------------------------- | ------------------------------------------------------------------- |
| **APG pattern**                     | [Button (toggle)](https://www.w3.org/WAI/ARIA/apg/patterns/button/) |
| **Bundle (Layer 4 target, brotli)** | `1.5 kB` brotli (informational)                                     |
| **Status**                          | `preview` (Phase 1; the Phase 0a pilot)                             |

## Anatomy

```
Toggle.Root        (a native <button> with aria-pressed)
```

`Toggle.Root` accepts a `child` snippet for render delegation per the APG-aligned pattern (replaces `asChild` from older libraries). Pass it to render any focusable element instead of the default button.

## Keyboard

Source: [APG Button keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/button/#keyboardinteraction). See [`apps/docs/keyboard/toggle.kb.ts`](../../apps/docs/keyboard/toggle.kb.ts).

| Key     | When      | Effect         |
| ------- | --------- | -------------- |
| `Space` | on toggle | Toggle pressed |
| `Enter` | on toggle | Toggle pressed |

## ARIA

| Element | Role     | aria-\* attributes                                   |
| ------- | -------- | ---------------------------------------------------- |
| `Root`  | (button) | `aria-pressed` ∈ `'true' / 'false'`, `aria-disabled` |

## Toggle.Group variant (Phase 1.5)

A row of toggle buttons sharing keyboard navigation and a single
selection model. Two modes:

| `mode`       | Semantics                                                        | ARIA                                                                  |
| ------------ | ---------------------------------------------------------------- | --------------------------------------------------------------------- |
| `'multiple'` | Each toggle is independent (`aria-pressed`). Multiple may be on. | `role="group"` on the wrapper                                         |
| `'single'`   | Radio-like: at most one toggle on at a time.                     | `role="radiogroup"`; children are `aria-checked` (not `aria-pressed`) |

Keyboard (both modes — roving tabindex):

| Key               | Effect                                            |
| ----------------- | ------------------------------------------------- |
| `Tab`             | Enter / leave the group (single tab stop)         |
| `ArrowLeft/Right` | Move roving focus to prev/next toggle (RTL-aware) |
| `Home` / `End`    | Move to first / last                              |
| `Space` / `Enter` | Toggle (multiple) or select (single)              |

Anatomy:

```
Toggle.Group           (role="group" | "radiogroup", aria-label required)
  └── Toggle.GroupItem value=…    (a child Toggle bound into the group)
```

API:

```ts
type ToggleGroupProps =
  | (BaseProps & { 'aria-label': string })
  | (BaseProps & { 'aria-labelledby': string });

type BaseProps =
  | { mode: 'multiple'; value: string[]; onValueChange?: (v: string[]) => void; children: Snippet }
  | {
      mode: 'single';
      value: string | null;
      onValueChange?: (v: string | null) => void;
      allowDeselect?: boolean;
      children: Snippet;
    };
```

```svelte
<!-- single (text-alignment style) -->
<Toggle.Group mode="single" aria-label="Text alignment" bind:value={align}>
  <Toggle.GroupItem value="left">Left</Toggle.GroupItem>
  <Toggle.GroupItem value="center">Center</Toggle.GroupItem>
  <Toggle.GroupItem value="right">Right</Toggle.GroupItem>
</Toggle.Group>
```

Bundle budget: `@kumiki/components/toggle` budget revised to **2.0 kB**
(was 1.5 kB) to absorb the Group plumbing. Logged in
`09-bundle-budget.md`.

## Source

- Machine: [`packages/machines/src/toggle`](../../packages/machines/src/toggle)
- Headless: [`packages/headless/src/toggle`](../../packages/headless/src/toggle)
- Component: [`packages/components/src/toggle`](../../packages/components/src/toggle)
- Sandbox: [`/sandbox/toggle`](../../apps/docs/src/routes/sandbox/toggle)
