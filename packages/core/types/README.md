# @kumiki/types

> Shared TypeScript type contracts. Zero runtime cost.

**Layer:** Layer 0

## Install

```bash
pnpm add @kumiki/types
```

## Use

```ts
import type { StandardSchemaV1, StandardSchemaResult } from '@kumiki/types';

function validate<T>(schema: StandardSchemaV1<T>, value: unknown) {
  return schema['~standard'].validate(value);
}
```

## What's exported

| Symbol                    | What it is                                                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `StandardSchemaV1<I,O>`   | The Standard Schema v1 validator interface (Zod 3.24+, Valibot 1.x, ArkType 2.0+, Effect Schema 3.x — anything that ships `~standard`). |
| `StandardSchemaResult<O>` | Result of a validator's `validate(value)` call.                                                                                         |

The validator implementation is **always** supplied by the consumer.
Kumiki imports zero runtime code from any validation library — Standard
Schema is a type contract.

## See also

- [Standard Schema](https://standardschema.dev/) — the spec.
- [`@kumiki/headless/form-field`](../headless) — Layer 3 attachment that drives validation.
- [`@kumiki/headless/combobox/with-validation`](../headless) — Combobox composition that wires a validator into option selection.
- [`docs/design/07-form-validation.md`](../../docs/design/07-form-validation.md) — design doc.
