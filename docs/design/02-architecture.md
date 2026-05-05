# 02 — Architecture: The Five Layers

## 2.1 Why layers at all

The brief says "the user can import only what they use; everything else tree-shakes." Tree-shaking is the _fallback_. The _plan_ is that **users import from a layer — not a barrel** — so the bundler never sees code we don't want shipped.

Layers also serve a second purpose: they decouple decisions. Replacing the FSM runtime (Layer 2 internal) doesn't break attachments (Layer 3). Adding a new compound component (Layer 4) doesn't change the machine (Layer 2).

## 2.2 Layer overview

```
┌────────────────────────────────────────────────────────────────────┐
│ Layer 5 — Recipes (preview during v1.0)                             │
│   @kumiki/recipes — subpath per recipe (./toggle, ./dialog, …)     │
│   Styled, copy-paste templates. Tailwind v4 + vanilla CSS variants.│
└──────────────┬──────────────────────────────────────────────────────┘
               │ imports from
┌──────────────▼──────────────────────────────────────────────────────┐
│ Layer 4 — Compound components                                       │
│   @kumiki/components — subpath per component (./toggle, ./dialog,…)│
│                       + dot-namespace barrel at root               │
│   <Combobox.Root> / <Combobox.Item>. The default user surface.     │
└──────────────┬──────────────────────────────────────────────────────┘
               │ imports from
┌──────────────▼──────────────────────────────────────────────────────┐
│ Layer 3 — Attachments / Builders                                    │
│   @kumiki/headless — subpath per component (./toggle, ./combobox,…)│
│   `{@attach}` factories that bind machines to DOM elements.        │
└──────────────┬──────────────────────────────────────────────────────┘
               │ imports from
┌──────────────▼──────────────────────────────────────────────────────┐
│ Layer 2 — State machines                                            │
│   @kumiki/machines — subpath per component (./toggle, ./combobox,…)│
│   @kumiki/runtime — shared minimal FSM core                        │
│   Pure TypeScript. Framework-agnostic. Vitest-testable headlessly. │
└──────────────┬──────────────────────────────────────────────────────┘
               │ imports from
┌──────────────▼──────────────────────────────────────────────────────┐
│ Layer 1 — Primitives                                                │
│   @kumiki/primitives (with subpath exports), @kumiki/locale        │
│   focus-trap, dismissable, id, locale, live-region, collection,    │
│   interactions, motion, portal.                                    │
└──────────────────────────────────────────────────────────────────────┘
```

**Strict downward dependency rule.** Layer N imports from Layer N-1, N-2, …, never from Layer N+1. This is enforced by:

1. `package.json` `dependencies` review at PR time.
2. `pnpm run check:layering` (`scripts/check-layering.mjs`) walks workspace package dependency graphs and fails if any package depends on a higher-layer package. Wired into `pnpm ci:health` and the lefthook pre-commit gate.

(With ADR 0012 the layering check operates on the 9 layer-level packages, not the 37 per-Layer×component packages from ADR 0002. Same rule, fewer nodes to traverse.)

## 2.3 Layer 1 — Primitives

Pure utilities. No component awareness. Each primitive is a subpath of `@kumiki/primitives` and individually tree-shakeable.

| Primitive      | Status        | What it does                                                                       | Approx brotli |
| -------------- | ------------- | ---------------------------------------------------------------------------------- | ------------- |
| `focus-trap`   | ✅ shipped    | Trap Tab cycle, set initial focus, restore on unmount                              | ≤ 500 B       |
| `dismissable`  | ✅ shipped    | Outside click + Escape detection                                                   | ≤ 500 B       |
| `id`           | ✅ shipped    | Stable SSR-safe id generator (uses `crypto.randomUUID` with fallback)              | ≤ 500 B       |
| `collection`   | ✅ shipped    | Roving tabindex, type-ahead, `getNextEnabled` helpers                              | ≤ 500 B       |
| `locale`       | ⏳ scaffolded | `direction()`, `formatter(locale, opts)`, `numberSystem()`                         | ≤ 500 B       |
| `live-region`  | ⏳ scaffolded | `announce(message, { politeness })`                                                | ≤ 500 B       |
| `interactions` | ⏳ scaffolded | `press(node)`, `hover(node)`, `focus(node)` — React Aria–style normalized handlers | ≤ 500 B       |
| `motion`       | ⏳ scaffolded | `prefersReducedMotion()`, `prefersContrast()`                                      | ≤ 500 B       |
| `portal`       | ⏳ scaffolded | Svelte 5 portal abstraction (renders in a target node)                             | ≤ 500 B       |

**API style:** plain functions or classes with `$state` fields where reactivity matters. No global registries.

```ts
// Layer 1 — focus-trap (sketch).
export function focusTrap(node: HTMLElement, options: FocusTrapOptions = {}): () => void {
  // Returns a teardown function. Used directly as a Svelte 5 attachment, or wrapped.
  // ...
}
```

## 2.4 Layer 2 — State machines

Pure TypeScript finite state machines. This is the **load-bearing decision** of Kumiki — see [04-state-machines.md](04-state-machines.md) for the runtime, the API, and the XState-compatible export format.

**Each machine is a subpath** of `@kumiki/machines` (`@kumiki/machines/toggle`, `@kumiki/machines/combobox`, …). The shared runtime lives in `@kumiki/runtime` (~1 KB brotli target).

A machine exports:

- `createXMachine(input): Machine<State, Event, Context>`
- `XStateConfig` — the JSON-export shape consumable by stately.ai

A machine **does not** know about Svelte. It does not import `svelte` or `$state`. It can be tested with `vitest` against a JSDOM-free environment.

```ts
// @kumiki/machines/toggle (sketch)
import { defineMachine } from '@kumiki/runtime';

export type ToggleEvent = { type: 'TOGGLE' } | { type: 'SET'; pressed: boolean };
export type ToggleContext = { pressed: boolean; disabled: boolean };

export function createToggleMachine(input: { initial?: boolean; disabled?: boolean }) {
  return defineMachine<ToggleContext, ToggleEvent>({
    id: 'toggle',
    context: { pressed: input.initial ?? false, disabled: input.disabled ?? false },
    initial: input.initial ? 'pressed' : 'unpressed',
    states: {
      pressed: {
        on: { TOGGLE: 'unpressed', SET: { target: 'unpressed', cond: (_, e) => !e.pressed } },
      },
      unpressed: {
        on: { TOGGLE: 'pressed', SET: { target: 'pressed', cond: (_, e) => e.pressed } },
      },
    },
  });
}
```

## 2.5 Layer 3 — Attachments

Layer 3 adapts a Layer 2 machine to Svelte 5's reactive model. It exports **`{@attach}`-compatible functions** that the user spreads onto their own DOM.

```svelte
<script lang="ts">
  import { createCombobox } from '@kumiki/headless/combobox';
  const cb = createCombobox({ options });
</script>

<input {@attach cb.input} />
<ul {@attach cb.listbox}>
  {#each cb.filtered as opt}
    <li {@attach cb.option(opt)}>{opt.label}</li>
  {/each}
</ul>
```

`createCombobox(input)` does three things:

1. Creates a Layer 2 machine instance.
2. Wraps machine state in `$state` / `$derived` (in a `.svelte.ts` controller class) so Svelte can track reactivity.
3. Exposes attachment factories (`input`, `listbox`, `option`, `trigger`) that wire DOM events to `machine.send(...)` and synchronize ARIA attributes from `machine.state`.

**Attachments are the right primitive here.** Per the Svelte 5 research, attachments support multiple per-element, run inside an effect context, and return optional teardown — exactly what we need for portal-and-focus-trap-and-event-listener bundles.

## 2.6 Layer 4 — Compound components

Layer 4 wraps Layer 3 in a familiar Radix-style API. It is the layer most users will touch.

```svelte
<Combobox.Root bind:value generic="User">
  <Combobox.Input />
  <Combobox.Listbox>
    {#snippet item(user)}
      <Combobox.Item value={user}>{user.name}</Combobox.Item>
    {/snippet}
  </Combobox.Listbox>
</Combobox.Root>
```

**Render delegation uses Svelte 5's `child` snippet pattern**, not `asChild`. (See [16-decisions/0007-aschild-svelte-alternative.md](16-decisions/0007-aschild-svelte-alternative.md).)

```svelte
<Combobox.Trigger>
  {#snippet child({ props })}
    <MyButton {...props}>Open</MyButton>
  {/snippet}
</Combobox.Trigger>
```

**Generic propagation:** the outermost `Combobox.Root` holds the generic, and children consume it via Svelte 5's context API (`getContext` / `setContext`). This works around the inference limits of deeply-bound generics (sveltejs/svelte#11356). See [08-typescript.md](08-typescript.md).

## 2.7 Layer 5 — Recipes (preview during v1.0)

Styled, copy-paste-friendly templates published as subpaths of `@kumiki/recipes` (`./toggle`, `./dialog`, …) with the `0.x.x-preview` dist-tag. The CLI (`@kumiki/cli`) copies recipe sources into the user's project.

```bash
npx kumiki add dialog --variant=tailwind
```

**Why preview?** Recipe API depends on Layer 4 stability. Until Layer 4 hits 1.0, we don't want to lock in copy-paste templates that users would have to re-paste.

Two variants per recipe:

- **Tailwind v4** — utility-class based, copy paste into a Tailwind project.
- **Vanilla CSS** — CSS modules with custom properties for theming.

## 2.8 Cross-cutting: animation hooks

The library never imports an animation library. Components emit `data-state` data attributes:

| Attribute          | Values                              | When                             |
| ------------------ | ----------------------------------- | -------------------------------- |
| `data-state`       | `open` `closed` `opening` `closing` | Dialog/Popover/Tooltip lifecycle |
| `data-orientation` | `horizontal` `vertical`             | Tabs, RadioGroup, Slider         |
| `data-side`        | `top` `right` `bottom` `left`       | Floating-positioned elements     |
| `data-direction`   | `ltr` `rtl`                         | Forwarded from `<html dir>`      |
| `data-disabled`    | present                             | Disabled element                 |
| `data-checked`     | `true` `false` `mixed`              | Checkbox / Toggle / Switch       |

Users author CSS / Svelte transitions / View Transitions / Motion library bindings against these. This pattern is established by Radix and battle-tested.

## 2.9 Cross-cutting: Node + browser dual targets

Kumiki is published as **isomorphic** packages — every Layer 1 / 2 / 3 / 4
package imports cleanly in both Node 22+ and modern browsers. The contract:

| Layer                  | Node import                             | Node execute                                                            | Browser execute                 |
| ---------------------- | --------------------------------------- | ----------------------------------------------------------------------- | ------------------------------- |
| 1 — primitives, locale | ✅ no DOM                               | ✅ pure logic / data                                                    | ✅                              |
| 2 — runtime, machines  | ✅ no DOM                               | ✅ FSM in Vitest, scripts, server validation                            | ✅                              |
| 3 — attachments        | ✅ DOM types only inside factory bodies | ⚠️ controller construction OK; calling `t.root(node)` requires real DOM | ✅                              |
| 4 — components         | ✅ via SvelteKit SSR                    | ✅ SSR rendering                                                        | ✅ post-hydration interactivity |

Practical implications:

- **Layer 2 machines run on the server.** Use them for non-UI logic
  (validation, simulation, batch jobs, AI agents) without dragging a Svelte
  runtime — `import { createComboboxMachine } from '@kumiki/machines/combobox'`
  in a Node worker is a supported path.
- **Layer 3 attachments import cleanly on Node** but their `root(node)` call
  will throw if invoked without a real DOM. Use them only in browsers (or
  with a JSDOM fixture, as our jsdom-mode Vitest tests do).
- **Layer 4 SSR works through SvelteKit's `adapter-cloudflare` /
  `adapter-node`.** Hydration on the browser then takes over interaction.

CI gate: `pnpm check:node-compat` (`scripts/check-node-compat.mjs`)
imports every published `dist/index.mjs` of Layer 1 / 2 / 3 packages in a
fresh Node process _with `document`, `window`, and `HTMLElement` deleted
from `globalThis`_ — any source that secretly reads a DOM global at import
time fails the gate.

## 2.10 Cross-cutting: SSR

All Layer 4 components must SSR cleanly. The **stable id** primitive (`@kumiki/primitives/id`) uses `getContext` to maintain a per-request id counter under SvelteKit, falling back to `crypto.randomUUID` client-side.

ARIA attributes that depend on knowing whether the popover is open server-side (e.g. `aria-expanded`) emit their default closed-state values during SSR. Users that want server-rendered open state pass `defaultOpen` to `Root`.

## 2.11 Architecture alternatives we considered

| Alternative                                                                                        | Why we didn't pick it                                                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **One package per component, no Layer split** (Bits UI shape)                                      | Conflates the FSM with the render adapter. Forces every consumer to pull in the Svelte runtime, even when they want to reuse the machine in a worker / test / non-Svelte tool.                                    |
| **One mega-package** (`kumiki`) with subpath exports for each Layer × component                    | Reduces install ceremony, but ships every layer's surface in one dep tree. A pure-FSM consumer would still get DOM-touching code in their `node_modules`.                                                         |
| **Two layers** (just machines + components, no separate attachments)                               | Loses the "want maximum DOM control" surface. Some users (custom DOM, accessibility audit consumers) want machine + builders without Layer 4 abstractions.                                                        |
| **Six layers** (split Layer 1 into "primitives" and "locale" formally)                             | Locale is conceptually data, not behavior. We treat it as Layer 1-adjacent and ship it as `@kumiki/locale` — a separate package — but the architectural diagram keeps it within Layer 1.                          |
| **One package per Layer × component, ~37 packages total** (ADR 0002, _now superseded by ADR 0012_) | Initial v1.0 plan. Six months in, install ceremony and per-component scaffolding cost dominated actual work; collapsed to one package per layer with subpaths per component while keeping the same 5-layer model. |

The chosen 5-layer design balances (a) tree-shake-friendliness, (b) separation of concerns, (c) coherent versioning, and (d) approachable mental model for new contributors. ADR 0012 collapsed the **packaging** of those layers to one package each (with subpaths per component), keeping the layered design intact at the source level.

## 2.12 Open questions

- **TBD: should `@kumiki/runtime` be merged into `@kumiki/primitives`?** Currently they're separate because the FSM runtime is Layer 2 conceptually and `primitives` is Layer 1. Phase 0b will measure whether splitting them costs duplicate-bundling enough to warrant a merge.
- **Resolved by ADR 0012:** the "single Layer 4 install" question — `@kumiki/components` IS the unified install (subpaths + dot-namespace barrel). No separate meta-package needed.
