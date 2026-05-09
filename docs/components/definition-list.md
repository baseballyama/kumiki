# DefinitionList

> Semantic `<dl>` term/description list.

| Field                               | Value                    |
| ----------------------------------- | ------------------------ |
| **APG pattern**                     | (none — semantic markup) |
| **Bundle (Layer 4 target, brotli)** | `0.4 kB` brotli (target) |
| **Status**                          | `unreleased` (Phase 1.5) |

## Why ship this

`<dl>`/`<dt>`/`<dd>` is one of the most-misused semantic groups —
common errors include putting `<div>` between `<dt>` and `<dd>`
(invalid HTML), or wrapping each pair in a `<div>` without
adjusting screen-reader semantics. A typed component eliminates the
class.

## Anatomy

```
DefinitionList.Root        (<dl>)
  ├── DefinitionList.Term         (<dt>)
  └── DefinitionList.Description  (<dd>)
```

To group a pair (e.g. for CSS Grid styling) HTML allows wrapping a
single `<dt>`+`<dd>` pair in a `<div>` since HTML 5.2 — Root accepts
`grouped` to apply this; it's still valid markup.

## ARIA

Native `<dl>` semantics. No ARIA additions.

## API

```ts
type RootProps = { grouped?: boolean; children: Snippet };
type TermProps = { children: Snippet };
type DescriptionProps = { children: Snippet };
```

## Examples

```svelte
<DefinitionList.Root grouped>
  <DefinitionList.Term>Status</DefinitionList.Term>
  <DefinitionList.Description>Active</DefinitionList.Description>
  <DefinitionList.Term>Owner</DefinitionList.Term>
  <DefinitionList.Description>Erika</DefinitionList.Description>
</DefinitionList.Root>
```

## Source

- Component: [`packages/components/src/definition-list`](../../packages/components/src/definition-list)

## Anti-patterns

- Don't use this for two-column layouts of unrelated content; it asserts a term/value relationship.
- Don't put more than one `<dd>` per `<dt>` unless the values are genuinely synonymous.
