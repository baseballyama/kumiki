# HorizontalRule

> Semantic separator (`<hr>` or `role="separator"` for non-`<hr>` use cases).

| Field                               | Value                    |
| ----------------------------------- | ------------------------ |
| **APG pattern**                     | (none)                   |
| **Bundle (Layer 4 target, brotli)** | `0.3 kB` brotli (target) |
| **Status**                          | `unreleased` (Phase 1.5) |

## Anatomy

```
HorizontalRule.Root       (<hr>)
```

Default renders `<hr>`. When the parent context is a flex/grid that
forbids `<hr>` semantics (e.g. inside a Menu), set `as="div"` and the
component applies `role="separator"` with `aria-orientation`.

## ARIA

| Variant    | Role        | aria-\* attributes |
| ---------- | ----------- | ------------------ |
| `<hr>`     | (native)    | —                  |
| non-`<hr>` | `separator` | `aria-orientation` |

## API

```ts
type Props = {
  as?: 'hr' | 'div';
  orientation?: 'horizontal' | 'vertical'; // 'vertical' implies as='div'
};
```

## Examples

```svelte
<HorizontalRule.Root />
<HorizontalRule.Root as="div" orientation="vertical" />
```

## Source

- Component: [`packages/components/src/horizontal-rule`](../../packages/components/src/horizontal-rule)

## Anti-patterns

- Don't use `<br>` for vertical spacing; use `HorizontalRule.Root` or layout CSS.
- Don't use this between menu items — Menu has `Menu.Separator` already.
