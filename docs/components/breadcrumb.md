# Breadcrumb

> Hierarchical location indicator (`nav[aria-label="Breadcrumb"]`).

| Field                               | Value                                                              |
| ----------------------------------- | ------------------------------------------------------------------ |
| **APG pattern**                     | [Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/) |
| **Bundle (Layer 4 target, brotli)** | `0.8 kB` brotli (target)                                           |
| **Status**                          | `unreleased` (Phase 1.5)                                           |

## Anatomy

```
Breadcrumb.Root         (<nav aria-label>)
  └── <ol>
        ├── Breadcrumb.Item
        │     └── Breadcrumb.Link  (or current-page text)
        ├── Breadcrumb.Separator   (decorative)
        └── …
```

Root renders `<nav>` with the `Breadcrumb` aria-label (i18n) wrapping
an `<ol>`. The current page is the **last** Item and **must not** be a
link — render plain text and the component sets `aria-current="page"`
automatically when `current={true}`.

## ARIA

| Element     | Role    | aria-\* attributes                          |
| ----------- | ------- | ------------------------------------------- |
| `Root`      | (`nav`) | `aria-label` (i18n: "Breadcrumb")           |
| `Item`      | (li)    | —                                           |
| `Link`      | (a)     | `aria-current="page"` when `current={true}` |
| `Separator` | (none)  | `aria-hidden="true"` — decorative           |

## Keyboard

Native link semantics. `Tab` cycles links; `Enter` follows. No custom
keyboard.

## API

```ts
// Breadcrumb.Root
type RootProps = {
  /** Override the default i18n aria-label. */
  'aria-label'?: string;
  children: Snippet;
};

// Breadcrumb.Link
type LinkProps =
  | { href: string; current?: false; children: Snippet }
  | { current: true; children: Snippet }; // last crumb: no href, sets aria-current

// Breadcrumb.Separator
type SeparatorProps = {
  /** Renders the separator glyph. Receives no payload. */
  children?: Snippet; // default: "/"
};
```

## i18n strings

| Key                | en           | ja               | ar            |
| ------------------ | ------------ | ---------------- | ------------- |
| `breadcrumb.label` | `Breadcrumb` | `パンくずリスト` | `مسار التنقل` |

Lives in `@kumiki/locale/<lang>/breadcrumb`.

## Examples

```svelte
<Breadcrumb.Root>
  <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item><Breadcrumb.Link href="/projects">Projects</Breadcrumb.Link></Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item><Breadcrumb.Link current>Acme</Breadcrumb.Link></Breadcrumb.Item>
</Breadcrumb.Root>
```

### RTL

Direction flips automatically via `LocaleProvider`; the separator
glyph is the consumer's snippet so the consumer mirrors any
direction-sensitive separator (e.g. `›` → `‹`).

## Source

- Component: [`packages/components/src/breadcrumb`](../../packages/components/src/breadcrumb)

## Anti-patterns

- Don't make the current page a link.
- Don't put icons in `Separator` without `aria-hidden` — the component does this for you.
- Don't omit the `<nav>` wrapping; it gives screen-reader users a navigable landmark.
