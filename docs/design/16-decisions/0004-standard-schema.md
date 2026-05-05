# ADR 0004 — Standard Schema for validator integration

**Status:** Accepted
**Date:** 2026-05

## Context

Headless form components must integrate with validation libraries. Picking _which_ validation library to support has been a chronic pain in the React ecosystem (resolvers, adapters, hooks per library). The Svelte ecosystem inherits the problem: sveltekit-superforms supports six of them, each with its own adapter.

[Standard Schema](https://standardschema.dev/) (released 2024, stable in 2025) defines a `~standard` interface that validation libraries implement. Compliant libraries (as of May 2026):

- **Zod** 3.24+
- **Valibot** 1.x
- **ArkType** 2.0+
- **Effect Schema** 3.x
- Plus: ReScript Schema, TypeBox (via adapter), VineJS, runtypes — community packages.

Yup is **not** Standard Schema compliant out-of-the-box.

## Decision

`@kumiki/components/form-field` accepts **any `StandardSchemaV1` validator** as the `validator` prop. We do not ship per-library adapters. Yup users can write a 20-line wrapper (documented).

The library never imports `zod`, `valibot`, or any specific validator. The validation surface is purely the Standard Schema interface.

## Alternatives considered

| Option                                                     | Verdict                                                                                                      |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Standard Schema only** (chosen)                          | ✅ One integration, supports all major validators today; minimal API surface; honest about Yup               |
| Ship adapters for Zod / Valibot / ArkType / Yup separately | ❌ 4 packages × maintenance × API duplication; Standard Schema makes them redundant for compliant validators |
| Hard-couple to one validator (e.g., Valibot)               | ❌ Splits the userbase; users have strong opinions; non-starter                                              |
| No validation in the library; punt to user-land            | ❌ Form integration is a competitive differentiator (per the brief and the user's market research §4.6)      |

## Consequences

**Easier:**

- The form-field package has zero validator dependencies. Bundle stays minimal (3 KB Layer 4 budget).
- New Standard Schema-compliant validators "just work" the day they ship. No coordinated release.
- `withValidation(base, schema)` works at every layer.

**Harder:**

- Users on Yup write a 20-line wrapper. We document this with a tested example. The market is small enough that we accept the friction.
- Async validation correctness is on us — but that's true regardless of validator choice. Race-token guarding lives in the Field machine ([07-form-validation.md §7.8](../07-form-validation.md#78-async-validation-correctness)).

## What we expect from the validator

The validator must conform to `StandardSchemaV1`:

```ts
schema['~standard'].validate(value)
  → { value: T } | { issues: Array<{ message: string; path?: ReadonlyArray<...> }> }
  | Promise<...>
```

We support both sync and async returns. We do not require any specific error shape beyond what Standard Schema mandates.

## What this _doesn't_ solve

- **JSON Schema generation** — Standard Schema has a sibling `StandardJSONSchemaV1` for that. We don't need it at v1.0.
- **OpenAPI integration** — orthogonal; not Kumiki's concern.
- **Validator-specific transforms** (e.g., Zod `.transform()`) — surfaced via the `value` field in the Standard Schema result, available to consumers who care.

## References

- Standard Schema spec: https://standardschema.dev/
- Compliant libraries list: https://github.com/standard-schema/standard-schema#what-tools-and-libraries-implement-the-standard
- User's market research §4.6 calls Standard Schema out as a recommendation.
