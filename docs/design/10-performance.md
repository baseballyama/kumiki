# 10 — Performance

## 10.1 What we measure

Bundle size is one number; runtime performance is another. We track four:

| Metric                                         | What it asserts                                                                 | Target                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **First Interaction Latency** (FIL)            | Time from `mount` to the component's first interactive ARIA state being correct | ≤ 16 ms (one frame) for any single Phase 1 component                |
| **Steady-state interaction cost**              | Time between user event and DOM mutation, measured via `performance.measure`    | ≤ 4 ms per interaction (95th percentile) on M1 / mid-range hardware |
| **Memory growth** under repeated mount/unmount | Heap stable after 100 mount/unmount cycles                                      | ± 0.5 MB drift                                                      |
| **SSR HTML byte count**                        | Byte count of server-rendered HTML for a default-config component               | Documented per component; Combobox closed ≤ 1 KB HTML               |

These are non-negotiable for v1.0, but a measured failure is a discussion, not an immediate blocker — performance regressions are recorded and triaged within a sprint.

## 10.2 Where regressions are most likely

Based on competitor experience and our architecture:

| Risk                                                  | Where it shows up                                                                                                                                              |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Subscriber thundering herd** in machine `subscribe` | Layer 3 controller. Mitigate: batch subscriber notifications per microtask.                                                                                    |
| **Reactive re-evaluation** of `$derived` chains       | Layer 4 components that derive ARIA from machine context. Mitigate: prefer `$derived.by(() => …)` for compound derivations and `$state.raw` for stable arrays. |
| **Floating UI** layout thrash                         | Tooltip / Popover / Combobox. Mitigate: defer position computation to `requestAnimationFrame`, follow Floating UI's `autoUpdate` patterns.                     |
| **Unmount leaks** from event listeners                | All attachments. Mitigate: every attachment returns a teardown function; tests assert listener count returns to zero.                                          |
| **Excessive ARIA mutation**                           | Combobox open/close. Mitigate: machines emit _deltas_; controllers `setAttribute` only when value changes.                                                     |

## 10.3 Benchmark suite

`apps/docs/perf/` hosts a benchmark page per Phase 1 component. Scripts there use the [Playwright performance APIs](https://playwright.dev/docs/api/class-page#page-evaluate-handle) to capture:

- Mount time (ms).
- Time-to-first-interactive (ms).
- Interaction time per event (ms).
- Heap size before / after a 100-cycle mount/unmount loop.

Output is a JSON snapshot per component per release, kept under `apps/docs/perf/snapshots/<release>/`.

```ts
// apps/docs/perf/combobox.bench.ts (sketch)
import { test } from '@playwright/test';

test('combobox first interaction latency', async ({ page }) => {
  await page.goto('/perf/combobox');
  const { fil } = await page.evaluate(() => {
    performance.mark('mount-start');
    // mount the combobox
    performance.mark('mount-end');
    performance.measure('FIL', 'mount-start', 'mount-end');
    const entry = performance.getEntriesByName('FIL')[0];
    return { fil: entry.duration };
  });
  console.log({ fil });
  // assertions are loose pre-1.0; tightened at v1.0
});
```

Benchmarks run on a scheduled GitHub Actions job (Ubuntu, default runner). Results are not load-bearing for individual PR reviews — they are tracked over time.

## 10.4 SSR performance

SvelteKit SSR is the primary deployment target. Per-component constraints:

- **No work in module top-level scope** that depends on a DOM. The library imports cleanly under Node.
- **`getContext` only** in components that need it (don't `setContext` from Layer 1 utilities).
- **id generator** must produce stable ids across server and client. We use a request-scoped counter in SvelteKit (via `getContext`), with `crypto.randomUUID` as client fallback.
- **No `window` reads** at module load time. Where we need them (e.g., `prefersReducedMotion`), we wrap in functions and call only on the client.

## 10.5 Edge runtime support

Cloudflare Workers / Vercel Edge / Bun / Deno are supported targets. Constraints:

- No Node-only built-ins (`fs`, `path`) at runtime.
- No CommonJS imports.
- No top-level `await` of remote resources.

We test edge support by running the SSR build on Cloudflare's local emulator (via `wrangler dev`) in `apps/docs`.

## 10.6 Benchmark methodology — alternatives considered

| Alternative                           | Verdict                                                                                 |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| **JS Framework Benchmark** (krausest) | ❌ overkill; benchmarks framework, not library                                          |
| **Custom Playwright bench** (chosen)  | ✅ measures realistic user paths                                                        |
| **Lighthouse CI**                     | ⚠️ useful for full-page audits; we'll add for `apps/docs` itself, but not per-component |

## 10.7 Open questions

- **TBD:** Whether to publish a perf comparison page vs Bits UI / Melt UI at v1.0. High-signal trust artifact, but maintenance heavy. Defer to v1.1 unless we have automation.
- **TBD:** Memory profiling cadence. Currently nightly; may be enough.
- **TBD:** How to fairly compare async-fetch Combobox latency across libraries when network is in the loop.
