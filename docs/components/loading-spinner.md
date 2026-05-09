# LoadingSpinner

> Visual busy-state indicator with `role="status"` semantics.

| Field                               | Value                    |
| ----------------------------------- | ------------------------ |
| **APG pattern**                     | (none — live region)     |
| **Bundle (Layer 4 target, brotli)** | `0.6 kB` brotli (target) |
| **Status**                          | `unreleased` (Phase 1.5) |

## Anatomy

```
LoadingSpinner.Root      (role="status")
  └── LoadingSpinner.Label    (visually-hidden default; or visible)
```

The Root is the live region; the Label is the accessible name. The
spinning glyph itself is consumer-supplied (snippet) per ADR 0014.

## Two modes

| Mode               | Semantics                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `inline` (default) | Replaces a chunk of content (e.g. inside a button while submitting). Label is visually hidden. |
| `region`           | Wraps a region while it loads (e.g. dashboard panel). Label is visible.                        |

## ARIA

| Element | Role     | aria-\* attributes                         |
| ------- | -------- | ------------------------------------------ |
| `Root`  | `status` | `aria-live="polite"`, `aria-atomic="true"` |
| `Label` | (none)   | When inline: `class="sr-only"`             |

The `role="status"` causes screen readers to announce the label
**once** when it appears. We do **not** use `role="alert"` — busy
states are not warnings.

## `prefers-reduced-motion`

The default atelier spinner respects `prefers-reduced-motion: reduce`
by switching from rotation to a fade pulse. Layer 4 emits no styles —
the contract is documented for atelier and consumer style sheets.

## API

```ts
type RootProps = {
  mode?: 'inline' | 'region';
  size?: 'sm' | 'md' | 'lg';
  /** Custom spinner glyph snippet. Default is provided by atelier. */
  spinner?: Snippet;
  children?: Snippet; // Label
};
```

## i18n strings

| Key                    | en         | ja            |
| ---------------------- | ---------- | ------------- |
| `loadingSpinner.label` | `Loading…` | `読み込み中…` |

`@kumiki/locale/<lang>/loading-spinner`.

## Examples

```svelte
<!-- inline (in a button) -->
<Button.Root loading={busy}>
  {#snippet icon()}{#if busy}<LoadingSpinner.Root mode="inline" />{/if}{/snippet}
  Save
</Button.Root>

<!-- region -->
{#if loading}
  <LoadingSpinner.Root mode="region">
    <LoadingSpinner.Label />
  </LoadingSpinner.Root>
{:else}
  <Dashboard />
{/if}
```

## Source

- Component: [`packages/components/src/loading-spinner`](../../packages/components/src/loading-spinner)

## Anti-patterns

- Don't render multiple `role="status"` regions simultaneously; SR announcements collide.
- Don't omit the label — silent spinners are inaccessible.
- Don't use `role="progressbar"` for indeterminate progress; use `role="status"` (this component).

## Related

- [Button](button.md) — `loading` prop pairs with this.
