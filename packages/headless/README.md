# @kumiki/headless

Layer 3 — Svelte 5 attachments that wire `@kumiki/machines` to real DOM.

One subpath per component plus tree-shakable composition subpaths for
Combobox extras (validation, async search, multi-select, virtualization).

## Install

```bash
pnpm add @kumiki/headless
```

`@kumiki/machines` ships as a transitive dependency. Svelte ≥ 5.29 is a peer.

## Use

```ts
import { toggle } from '@kumiki/headless/toggle';
import { combobox } from '@kumiki/headless/combobox';
import { withValidation } from '@kumiki/headless/combobox/with-validation';
```

## Available subpaths

| Subpath                                         | What it ships                            |
| ----------------------------------------------- | ---------------------------------------- |
| `@kumiki/headless/accordion`                    | accordion attachment + controller        |
| `@kumiki/headless/checkbox`                     | checkbox attachment                      |
| `@kumiki/headless/combobox`                     | combobox attachment + controller         |
| `@kumiki/headless/combobox/with-validation`     | Standard Schema validator wrapper        |
| `@kumiki/headless/combobox/with-async-search`   | abort-aware fetcher wrapper              |
| `@kumiki/headless/combobox/with-multi-select`   | `selected: T[]` + toggle/selectAll/clear |
| `@kumiki/headless/combobox/with-virtualization` | fixed-row windowing                      |
| `@kumiki/headless/dialog`                       | modal dialog with focus trap             |
| `@kumiki/headless/form-field`                   | blur/typing → validation surface         |
| `@kumiki/headless/menu`                         | single-level menu                        |
| `@kumiki/headless/number-field`                 | numeric input + step/page                |
| `@kumiki/headless/popover`                      | non-modal disclosure                     |
| `@kumiki/headless/radio-group`                  | roving tabindex                          |
| `@kumiki/headless/select`                       | listbox without free text                |
| `@kumiki/headless/slider`                       | single-thumb numeric slider              |
| `@kumiki/headless/switch`                       | binary on/off                            |
| `@kumiki/headless/tabs`                         | tabbed panels (auto / manual / RTL)      |
| `@kumiki/headless/toast`                        | toaster + per-toast lifecycle            |
| `@kumiki/headless/toggle`                       | binary pressed/unpressed                 |
| `@kumiki/headless/tooltip`                      | open/close + delay policies              |

## See also

- [`@kumiki/machines`](../machines) — Layer 2 framework-agnostic FSMs.
- [`@kumiki/components`](../components) — Layer 4 ready-made Svelte components.
- [`docs/design/02-architecture.md`](../../docs/design/02-architecture.md) — layering.
