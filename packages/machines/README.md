# @kumiki/machines

Pure-TypeScript finite state machines for every Kumiki component.

**Layer 2.** No DOM. No Svelte. Same code runs in browsers, Node 22+, and (via
`toJSON()`) imports cleanly into [stately.ai/viz](https://stately.ai/viz).

## Install

```bash
pnpm add @kumiki/machines
```

## Use

One subpath per component. Tree-shaking is guaranteed because each subpath is a
separate entry point compiled by tsdown.

```ts
import { createToggleMachine } from '@kumiki/machines/toggle';
import { createComboboxMachine } from '@kumiki/machines/combobox';
import { createDialogMachine } from '@kumiki/machines/dialog';
```

## Available subpaths

| Subpath                         | What it ships                             |
| ------------------------------- | ----------------------------------------- |
| `@kumiki/machines/accordion`    | accordion expand/collapse with collection |
| `@kumiki/machines/checkbox`     | tri-state checkbox (true/false/mixed)     |
| `@kumiki/machines/combobox`     | async-aware combobox + race-token guard   |
| `@kumiki/machines/dialog`       | open/close + focus-restore policies       |
| `@kumiki/machines/form-field`   | blur/typing → validation surface          |
| `@kumiki/machines/menu`         | single-level menu (submenus deferred)     |
| `@kumiki/machines/number-field` | numeric input + step/page/clamp           |
| `@kumiki/machines/popover`      | non-modal disclosure                      |
| `@kumiki/machines/radio-group`  | roving tabindex over options              |
| `@kumiki/machines/select`       | single-select listbox (no free text)      |
| `@kumiki/machines/slider`       | single-thumb numeric slider               |
| `@kumiki/machines/switch`       | binary on/off                             |
| `@kumiki/machines/tabs`         | tabbed-panel selection + manual/auto      |
| `@kumiki/machines/toast`        | per-toast lifecycle inside the toaster    |
| `@kumiki/machines/toggle`       | binary pressed/unpressed                  |
| `@kumiki/machines/tooltip`      | open/close + delay policies               |

## Convention

Each machine:

- Is a `defineMachine`-built FSM — see `@kumiki/runtime`.
- Exports `createXMachine(input)` returning `{ state, context, send, subscribe, toJSON }`.
- Lists actions as data (`{ type, exec }`) so `toJSON()` produces a stately.ai-compatible config.
- Ships its tests next to source as `*.test.ts` (vitest, environment: `node`).

## See also

- [`@kumiki/runtime`](../runtime) — the FSM core these machines build on.
- [`@kumiki/headless`](../headless) — Layer 3 attachments that wire these machines to the DOM.
- [`docs/design/04-state-machines.md`](../../docs/design/04-state-machines.md) — runtime spec.
