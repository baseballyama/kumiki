# 12 — Testing Strategy

## 12.1 Layered testing model

Tests run at four layers, each catching what the layer above misses:

| Layer                 | Tool                                | Speed   | What it catches                        |
| --------------------- | ----------------------------------- | ------- | -------------------------------------- |
| Pure machine          | Vitest                              | ms      | State transition correctness           |
| Controller / DOM unit | Vitest + jsdom                      | ms      | Reactive sync, ARIA attribute mutation |
| Browser e2e + axe     | Playwright + `@axe-core/playwright` | seconds | Real DOM, focus management, axe rules  |
| Screen reader         | Guidepup (Playwright wrapper)       | minutes | What an SR actually announces          |

Lower layers are run on every PR; higher layers on a schedule (per [05-accessibility.md](05-accessibility.md)).

## 12.2 Where each test lives

```
packages/machine-combobox/
  src/
    index.ts
    transitions.test.ts        ← Vitest, pure machine
packages/attachment-combobox/
  src/
    index.ts
    controller.svelte.ts
    controller.test.svelte.ts  ← Vitest + jsdom; controller wiring
packages/component-combobox/
  src/
    Root.svelte
    Item.svelte
    Listbox.svelte
    component.test.svelte      ← Vitest + jsdom; minimal smoke
apps/docs/
  tests/
    combobox.e2e.test.ts       ← Playwright, e2e
    combobox.a11y.test.ts      ← Playwright + axe
    combobox.sr.test.ts        ← Guidepup, scheduled
    combobox.kb.test.ts        ← APG-driven keyboard test
```

The split keeps each kind of test fast and focused.

## 12.3 Pure machine tests

Vitest, no jsdom, no Svelte:

```ts
import { describe, it, expect } from 'vitest';
import { createComboboxMachine } from '@kumiki/machines/combobox';

describe('combobox machine', () => {
  it('opens on input change', () => {
    const m = createComboboxMachine({ options: [{ id: '1', label: 'a' }] });
    expect(m.state).toBe('closed');
    m.send({ type: 'INPUT.CHANGE', value: 'a' });
    expect(m.state).toBe('open.populated');
  });

  it('async race: stale resolution is dropped', async () => {
    /* token-based race test; see 04-state-machines.md §4.6 */
  });
});
```

Coverage target: ≥ 95% line coverage on machine packages. Machines are small and the logic is essential; we hold a high bar.

## 12.4 Controller tests (`*.test.svelte.ts`)

Tests live alongside the controller and exercise the Svelte runes layer. We use jsdom for the DOM operations (attaching to elements). The runes runtime requires the test file to be `.svelte.ts`:

```ts
// packages/attachment-combobox/src/controller.test.svelte.ts
import { describe, it, expect } from 'vitest';
import { createCombobox } from './controller.svelte';

describe('combobox controller', () => {
  it('reactive state is synced from machine', () => {
    const cb = createCombobox({ options: [] });
    expect(cb.isOpen).toBe(false);
    cb.open();
    expect(cb.isOpen).toBe(true);
  });
});
```

Coverage target: ≥ 80% on controllers. Lower than machines because some paths are jsdom-flaky.

## 12.5 Browser e2e

Playwright. The `apps/docs` SvelteKit site hosts component sandboxes at `/sandbox/<component>?state=<state>&dir=<ltr|rtl>`. Tests navigate to those:

```ts
// apps/docs/tests/combobox.e2e.test.ts
test('user can pick an option with the mouse', async ({ page }) => {
  await page.goto('/sandbox/combobox');
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Alice' }).click();
  await expect(page.getByRole('combobox')).toHaveValue('Alice');
});
```

Two Playwright projects:

- `e2e` — happy path + edge cases.
- `a11y` — same scenarios, but ending with `expect(axeResults.violations).toEqual([])`.

## 12.6 axe-core in CI

See [05-accessibility.md §5.3](05-accessibility.md#53-axe-core-in-ci-—-what-it-actually-catches) for the full story. Configuration:

- Every Phase 1 component has an a11y test file.
- Each file iterates over `STATES × DIRECTIONS`.
- Disabled rules are component-level and documented in the component's `.md`.

## 12.7 APG keyboard tests

The keyboard test harness lives at `packages/tooling-keyboard-test/` (Phase 0c, internal). It:

1. Reads `packages/component-<X>/keyboard.yaml`.
2. Compares against the published APG keyboard table — fails CI if a row is missing.
3. Emits Playwright tests that drive the sandbox page and assert state changes per row.

Adding a new key in the APG → add to YAML → tests update automatically.

## 12.8 Screen-reader tests (Guidepup)

Per [05-accessibility.md §5.5](05-accessibility.md#55-screen-reader-automation-guidepup):

- Run on a nightly schedule (`scheduled-screen-reader.yml`).
- Matrix: macOS-VoiceOver + Windows-NVDA.
- Tests are kept small and high-value (one or two assertions per critical user flow).
- Output transcripts are uploaded as artifacts.

Local development:

```bash
GUIDEPUP=1 pnpm --filter @kumiki/docs run test:sr
```

## 12.9 Visual regression (deferred)

We do **not** ship visual regression tests for the headless library — there's nothing visual to regress. For the Layer 5 Atelier, we add Chromatic or Argos in v1.1 if Atelier components prove visually fragile. Currently out of scope.

## 12.10 Distribution health tests

CI runs four distribution-health checks per package on every PR:

| Tool               | What it catches                                    |
| ------------------ | -------------------------------------------------- |
| `publint`          | `package.json` correctness — exports, types, files |
| `arethetypeswrong` | `.d.ts` resolves under node10 / node16 / bundler   |
| `agadoo`           | Tree-shake honesty — `sideEffects: false` is true  |
| `size-limit`       | Gzipped budget per entry                           |

Workflow: see [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).

## 12.11 Local development workflow

```bash
# Fast feedback (machines + controllers)
pnpm test

# Single component focus (filter by source path within a layer package)
pnpm --filter @kumiki/machines exec vitest src/combobox
pnpm --filter @kumiki/headless exec vitest src/combobox

# Full sweep (CI parity)
pnpm test && pnpm typecheck && pnpm lint && pnpm size && pnpm publint && pnpm attw && pnpm agadoo
```

A `pnpm ci:health` shortcut is registered at the root for the latter.

## 12.12 Coverage targets

| Layer      | Coverage target             | Why                                   |
| ---------- | --------------------------- | ------------------------------------- |
| Machine    | ≥ 95% lines, ≥ 90% branches | Logic is essential; cheap to test     |
| Controller | ≥ 80% lines                 | Some jsdom flakiness; slightly looser |
| Component  | smoke only                  | Real coverage comes from e2e          |
| Docs site  | 0% (no coverage gate)       | Tested via e2e only                   |

## 12.13 Mock policy

Per the brief's spirit and project's conservatism: **no mocks for code under test**. We test machines without `vi.fn()`-mocking primitives. The exception is the _fetcher_ in `withAsyncSearch` — that's user-supplied and stub-able.

We never mock `@kumiki/runtime` or `@kumiki/primitives` from tests of higher layers. Their real behavior is fast enough.

## 12.14 Open questions

- **TBD:** Whether to add `@guidepup/virtual-screen-reader` (a JSDOM-based SR simulator) to the controller-test layer. Lean: yes for Phase 1 critical components — fast feedback on what SR will say. Trial in Phase 0b.
- **TBD:** A separate "i18n" Playwright project that exercises every Phase 1 component in `ja` + `ar` locales for label/message correctness. Probably yes; deferred to Phase 0c.
