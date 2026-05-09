# Button

> Native `<button>` with loading-state and accessible-name guarantees.

| Field                               | Value                                                      |
| ----------------------------------- | ---------------------------------------------------------- |
| **APG pattern**                     | [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) |
| **Bundle (Layer 4 target, brotli)** | `0.8 kB` brotli (target)                                   |
| **Status**                          | `unreleased` (Phase 1.5)                                   |
| **Layer 5 preview**                 | `tailwind+vanilla`                                         |

## Why ship one

`Button` is the most-instantiated control in any UI; the per-app
hand-rolled equivalents have repeatedly been the source of these
regressions:

- Missing accessible name when the control is icon-only (see ADR 0014).
- `disabled` removing keyboard focus, breaking screen-reader exposure
  of _why_ it's disabled.
- Loading state that swaps the label out, losing the accessible name
  mid-press for assistive tech.

A single primitive eliminates all three. `Button` is **always** a
native `<button>` (no `role="button"` on `<div>`).

## Anatomy

```
Button.Root        (<button>)
```

The component renders a single `<button>` element. Snippets compose
the visual; the accessible name comes from the visible text or, when
icon-only, from `aria-label`.

## Keyboard

Native `<button>` semantics. No custom keyboard.

| Key     | When                 | Effect              |
| ------- | -------------------- | ------------------- |
| `Space` | focused, not loading | Activate            |
| `Enter` | focused, not loading | Activate            |
| —       | loading              | All keys are no-ops |

## ARIA

| Element | Role                   | aria-\* attributes                                                  |
| ------- | ---------------------- | ------------------------------------------------------------------- |
| `Root`  | (none — native button) | `aria-busy="true"` while `loading`; `aria-disabled` when `disabled` |

## Loading state

When `loading` is `true`:

- `aria-busy="true"` is set on the button.
- `pointerEvents` and click handlers are blocked at the controller level
  (not via CSS, so screen-reader virtual cursor still announces "busy").
- The original label remains in the accessible name. The visual swap to
  a spinner is a _visual_ change only — assistive tech reads the
  unchanged label.
- The button retains focus (we do not remove tabindex).

Disabled vs loading: `disabled` removes the button from interaction
entirely (and from the tab order in some browsers); `loading` is a
_temporary_ busy state that keeps focus and accessible-name intact.

## API

### `Button.Root`

```ts
type ButtonProps =
  | (BaseProps & { children: Snippet }) // text label
  | (BaseProps & { 'aria-label': string; icon: Snippet }) // icon-only
  | (BaseProps & { 'aria-labelledby': string; icon: Snippet });

type BaseProps = {
  /**
   * @when-to-use Apply visual semantics. Layer 4 sets only data-* hooks; atelier maps to CSS.
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  /**
   * @when-to-use Decorative leading glyph. Auto-`aria-hidden` per ADR 0014.
   */
  icon?: Snippet;
  /**
   * @when-to-use Decorative trailing glyph (e.g. dropdown chevron on a split button).
   */
  iconTrailing?: Snippet;
  onclick?: (e: MouseEvent) => void;
};
```

The discriminated union enforces an accessible name whenever `icon`
is provided without children.

## Examples

### Basic

```svelte
<Button.Root variant="primary" onclick={save}>Save</Button.Root>
```

### Icon-only (accessible name required at type level)

```svelte
<Button.Root aria-label="Close" variant="ghost">
  {#snippet icon()}<XIcon />{/snippet}
</Button.Root>
```

### Loading

```svelte
<Button.Root loading={isSubmitting} variant="primary">Save</Button.Root>
```

## i18n strings

None required at the component level; loading state does not contribute
text to the accessible name. Consumer-supplied `aria-label` for
icon-only.

## Source

- Machine: none (no FSM justified — props derive state).
- Headless: [`packages/headless/src/button`](../../packages/headless/src/button)
- Component: [`packages/components/src/button`](../../packages/components/src/button)
- Atelier: [`packages/atelier/src/button`](../../packages/atelier/src/button)

## Anti-patterns

- Don't put `role="button"` on a `<div>` to "style it like a button" — Button.Root is already a native `<button>`.
- Don't use `disabled` to communicate "loading"; use `loading` so the accessible name and focus are preserved.
- Don't pass interactive children (links, other buttons). A button-in-a-button is invalid HTML.

## Related

- [Toggle](toggle.md) — for stuck-state buttons.
- ADR 0014 — icon strategy / accessible-name enforcement.
