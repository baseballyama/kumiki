# Toolbar

> APG `toolbar` pattern — single tab stop with arrow-key roving across enabled items.

| Field                               | Value                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------- |
| **APG pattern**                     | [Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)                          |
| **Bundle (Layer 4 target, brotli)** | `1.5 kB` brotli (target — gated once the Layer 4 measurement infra in plan A-2 lands) |
| **Status**                          | `preview` (Phase 1.5)                                                                 |
| **Layer 5 preview**                 | `tailwind+vanilla`                                                                    |

## Why no machine, no Layer 3

`Toolbar.Root` owns a roving-tabindex coordinator that lives in pure DOM
bookkeeping (which item currently holds the single tab stop, which arrow
moves focus where, RTL-flipping horizontal traversal). None of that is
state in the FSM sense — it's a coordination protocol between sibling DOM
nodes. Lifting it into a Layer 2 FSM would not save bytes and would add an
indirection nobody benefits from. This matches the call recorded in the
component source (`Root.svelte`).

The plan's draft TODO listing `toolbar` under the "stateful 4 件 (FSM/L3 を持たない)"
([`v1-execution-plan` A-1](../release/v1-execution-plan.md#a-1-レイヤ欠損の補填stateful-4-件))
predates the Phase 1.5 Toolbar landing. Toolbar's roving-tabindex is
implemented in Layer 4 directly; the three remaining stateful entries
(`date-picker`, `datetime-field`, `time-field`) are the ones that genuinely
require FSM + Layer 3.

## Anatomy

```
Toolbar.Root         (role="toolbar", aria-orientation, single tab stop)
  ├── Toolbar.Item   (a focusable button, joins the roving group)
  └── Toolbar.Separator  (visual / semantic divider, not focusable)
```

`Toolbar.Root` requires an accessible name (`aria-label` or `aria-labelledby`),
enforced at the type level. The roving-tabindex coordinator decides which
single item hosts `tabindex={0}`; everyone else is `tabindex={-1}`. When the
user tabs into the toolbar, focus lands on the last interacted item (or the
first enabled one if untouched).

## Keyboard

Source: [APG Toolbar keyboard interaction](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/#keyboardinteraction).
See [`apps/docs/keyboard/toolbar.kb.ts`](../../apps/docs/keyboard/toolbar.kb.ts) (planned — track A-2).

| Key               | When                        | Effect                                                |
| ----------------- | --------------------------- | ----------------------------------------------------- |
| `Tab`             | from outside                | Focuses the current tab stop (one stop per toolbar)   |
| `Tab`             | from inside an item         | Leaves the toolbar entirely (doesn't go to next item) |
| `ArrowRight`      | horizontal, focused on item | Moves to next enabled item; RTL-inverted              |
| `ArrowLeft`       | horizontal, focused on item | Moves to previous enabled item; RTL-inverted          |
| `ArrowDown`       | vertical, focused on item   | Moves to next enabled item                            |
| `ArrowUp`         | vertical, focused on item   | Moves to previous enabled item                        |
| `Home`            | focused on item             | Moves to first enabled item                           |
| `End`             | focused on item             | Moves to last enabled item                            |
| `Space` / `Enter` | focused on item             | Activates the item (default `<button>` semantics)     |

Wrapping is enabled (Right at the last item moves to the first; Left at the first moves to the last) — matches the APG example and most native toolbars.

## ARIA

| Element     | Role               | aria-\* attributes                                                                                                                                           |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Root`      | `toolbar`          | **`aria-label`** _or_ **`aria-labelledby`** (one required); `aria-orientation` (`horizontal` / `vertical`); `aria-disabled` if the whole toolbar is disabled |
| `Item`      | (default `button`) | `aria-disabled` when disabled; `tabindex` is `0` for the current single tab stop and `-1` for everyone else (the Root rotates this on Arrow / Home / End)    |
| `Separator` | `separator`        | `aria-orientation` perpendicular to the toolbar (visual divider)                                                                                             |

## API

### `Toolbar.Root`

```ts
type ToolbarOrientation = 'horizontal' | 'vertical';

type ToolbarBaseProps = {
  orientation?: ToolbarOrientation; // default 'horizontal'
  disabled?: boolean; // disables every child item
  id?: string;
  children: Snippet;
  /** Extra props (`class`, `style`, `data-*`, …) forwarded to the wrapper. */
  [key: string]: unknown;
};

type ToolbarProps =
  | (ToolbarBaseProps & { 'aria-label': string })
  | (ToolbarBaseProps & { 'aria-labelledby': string });
```

### `Toolbar.Item`

```ts
type ToolbarItemProps = {
  disabled?: boolean;
  onclick?: (event: MouseEvent) => void;
  children?: Snippet;
  /** Render delegation — see docs/design/08-typescript.md#child-snippet. */
  child?: Snippet<[payload: { props: Record<string, unknown> }]>;
  [key: string]: unknown;
};
```

### `Toolbar.Separator`

```ts
type ToolbarSeparatorProps = {
  [key: string]: unknown; // forwarded to the <div role="separator">
};
```

## Examples

### Basic — text formatting

```svelte
<script lang="ts">
  import { Toolbar } from '@kumiki/components/toolbar';
</script>

<Toolbar.Root aria-label="Text formatting">
  <Toolbar.Item onclick={bold}>B</Toolbar.Item>
  <Toolbar.Item onclick={italic}>I</Toolbar.Item>
  <Toolbar.Item onclick={underline}>U</Toolbar.Item>
  <Toolbar.Separator />
  <Toolbar.Item onclick={undo}>Undo</Toolbar.Item>
  <Toolbar.Item onclick={redo}>Redo</Toolbar.Item>
</Toolbar.Root>
```

### Vertical

```svelte
<Toolbar.Root orientation="vertical" aria-label="Inspector">
  <Toolbar.Item onclick={selectMove}>Move</Toolbar.Item>
  <Toolbar.Item onclick={selectScale}>Scale</Toolbar.Item>
  <Toolbar.Item onclick={selectRotate}>Rotate</Toolbar.Item>
</Toolbar.Root>
```

### RTL

```svelte
<LocaleProvider locale="ar" dir="rtl">
  <Toolbar.Root aria-label="Tools">
    <!-- ArrowLeft now moves to NEXT, ArrowRight to PREV — flipped by Toolbar.Root. -->
    <Toolbar.Item>…</Toolbar.Item>
  </Toolbar.Root>
</LocaleProvider>
```

### Composing other Kumiki controls

`Toolbar.Item` defaults to `<button>`, but you can place any focusable Kumiki
control inside the toolbar — set `tabindex={-1}` on it and forward
Arrow / Home / End yourself if you want it to participate in the roving group.
The dedicated `Toolbar.Item` is the easy path.

## Accessibility checklist

- [ ] APG link present.
- [ ] All keys in the APG keyboard table are implemented and tested.
- [ ] `aria-label | aria-labelledby` required at the type level on `Toolbar.Root`.
- [ ] `axe-core` passes for every documented state in LTR + RTL.
- [ ] `:focus-visible` supported (no default `outline: none`).
- [ ] RTL inverts horizontal arrow keys (`Toolbar.Root` reads `direction` from `LocaleProvider`).
- [ ] `prefers-reduced-motion` honored where buttons animate.
- [ ] Screen-reader smoke test passes on macOS-VoiceOver and Windows-NVDA.

## Anti-patterns

- Don't put a `Toolbar` inside another widget that already provides roving
  tabindex (`Tabs`, `Menu`, `RadioGroup`) — the nested coordinators will
  fight over focus.
- Don't put non-interactive content (text, badges) as `Toolbar.Item`. Place
  it outside, or wrap it in `Toolbar.Separator` if it is a visual divider.
- Don't rely on `Toolbar.Separator` for screen-reader landmarks — it is a
  presentational divider, not a section boundary.

## Composition

No `with*` adapters yet. Toolbar's coordination protocol does not lend
itself to behavior layering; if you need richer state, lift it to the
controls you place inside the toolbar (a `Toggle` for a Bold button, a
`Menu` for a font picker, etc.).

## Related

- [Tabs](tabs.md) — when items are mutually exclusive views, not actions.
- [RadioGroup](radio-group.md) — when items are mutually exclusive selections.
- [ADR 0016](../design/16-decisions/0016-editor-dnd-out-of-scope.md) — Toolbar is the integration surface for editor consumers.
