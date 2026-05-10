# ADR 0021 — Split form-field validation wiring into a `with-validation` subpath

**Status:** Proposed (post-v1.0; supersedes the architectural-reduction
row for `@kumiki/components/form-field` in
[ADR 0018](0018-l4-bundle-budget-revision.md))
**Date:** 2026-05-10
**Implementation target:** v1.x (post-v1.0)
**Touches versioned contracts:** Yes — `@kumiki/components` `package.json`
`exports` map. **Requires maintainer review before merge** per
[CLAUDE.md](../../../CLAUDE.md) "Things to NOT do without confirmation".

## Context

[ADR 0018](0018-l4-bundle-budget-revision.md) measured
`@kumiki/components/form-field` at **2.58 kB brotli**, +32 % over the
declared **1.95 kB** target. The same ADR set the v1.0 gate at `2_800 B`
(post-`+5 %` envelope) and recorded **1_950 B** as the reduction target,
contingent on this follow-on ADR.

Reading
[`packages/components/src/form-field/Root.svelte`](../../../packages/components/src/form-field/Root.svelte):
the field root currently inlines a Standard Schema validator pump
(parse → race-token-cancel → translate issues → expose `errors`) even
when the consumer hasn't provided a validator. That code path is dead
weight for the consumers that **only** want the labelled-input
plumbing (label / description / errors slots / required marker).

The same situation, addressed by an existing pattern: the
`@kumiki/headless/combobox/with-*` subpaths (per
[`docs/design/11-composition.md`](../11-composition.md)) split optional
behaviors out so consumers tree-shake them away. We have the precedent.

## Decision

Split the validation wiring into a sibling subpath:

```
@kumiki/components/form-field                  (default — Root + Label + Input + Description + Errors)
@kumiki/components/form-field/with-validation  (Root that accepts `validator` + race-token + Errors render)
```

Internally:

- Default subpath ships a `<Root>` with no validator awareness; `errors`
  becomes a consumer-driven prop.
- `with-validation` subpath ships an enhanced `<Root>` that internally
  composes the default Root plus the validator pump, and re-exports the
  rest of the parts unchanged.

Consumer migration:

```svelte
<!-- before -->
import * as FormField from '@kumiki/components/form-field';
<FormField.Root validator={schema}> … </FormField.Root>

<!-- after — explicit composition -->
import * as FormField from '@kumiki/components/form-field/with-validation';
<FormField.Root validator={schema}> … </FormField.Root>

<!-- consumers without a validator -->
import * as FormField from '@kumiki/components/form-field';
<FormField.Root> … </FormField.Root>
```

### `package.json` `exports` change

```jsonc
"./form-field": {
  "types": "./dist/form-field/index.d.ts",
  "svelte": "./dist/form-field/index.js",
  "import": "./dist/form-field/index.js"
},
"./form-field/with-validation": {
  "types": "./dist/form-field/with-validation/index.d.ts",
  "svelte": "./dist/form-field/with-validation/index.js",
  "import": "./dist/form-field/with-validation/index.js"
}
```

This is **breaking** for the consumers who currently pass
`validator={…}` to the default subpath. Mitigated by:

- Default `<Root>` continues to **accept** a `validator` prop at the
  type level for one minor cycle, but logs a `console.warn` in dev that
  it is a no-op. Removed in the next major.
- Migration is mechanical: change the import path. A codemod is provided
  alongside the changeset.

Marked `Source change (with deprecation window)` per
[`docs/design/14-versioning-release.md`](../14-versioning-release.md).

### Bundle target

Per ADR 0018: default subpath drops to ≤ **1_950 B** brotli. The
`with-validation` subpath gets its own budget (estimated ≤ 2_300 B
because it composes the default + validator pump; to be measured at
first build). Both gate via `measure:svelte-size:check`.

## Alternatives

| Option                                                                   | Verdict                                                                                                                                                      |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Subpath-split (this ADR)**                                             | ✅ Mirrors the `combobox/with-*` precedent. Tree-shakes for the (likely majority) of consumers without a validator.                                          |
| **Keep one subpath; rely on tree-shaking dead branches**                 | ❌ The validator pump is reachable from `Root.svelte` regardless of whether `validator` is passed at runtime; bundlers can't dead-code-eliminate it.         |
| **Move validator wiring into a separate `<FormField.Validator />` part** | ❌ Same module graph; doesn't help the bundle. The user-visible API is also more confusing (two parts that interact through context for one piece of logic). |
| **Defer to v2.0**                                                        | ❌ Locks the 2.58 kB gate, leaves Form-field's "Standard Schema integration" pitch (per ADR 0004) without a measured competitive size.                       |

## Consequences

### Easier

- Form-without-validation consumers (likely the majority of layout-only
  forms in flyle-nexus and elsewhere) shed ~25 % of their cost.
- Composition story matches `combobox/with-*` — one mental model for the
  whole library.
- ADR 0018 §"deferred" closes for form-field.

### Harder

- One-cycle deprecation window on the default subpath's `validator`
  prop (codemod + warning).
- Form spec doc
  ([`docs/components/form-field.md`](../../components/form-field.md))
  needs updating with the new import shape.
- An additional gated subpath in `measure:svelte-size:check`.

### Reversible

- Yes, but expensive. Once consumers import the new subpath, removing
  it becomes a major bump.

## References

- [ADR 0004](0004-standard-schema.md) — Standard Schema only (validation
  surface).
- [ADR 0012](0012-package-consolidation.md) — per-layer package shape.
- [ADR 0018](0018-l4-bundle-budget-revision.md) §"Architectural reductions deferred"
- [`docs/design/11-composition.md`](../11-composition.md) — `with-*` precedent
- [`docs/components/form-field.md`](../../components/form-field.md)
- [`docs/release/v1-execution-plan.md`](../../release/v1-execution-plan.md) A-2 完了ログ
