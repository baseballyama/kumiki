# Autonomous `/loop` operation guide

How to keep Kumiki's implementation advancing while the maintainer is away.

## TL;DR

```text
/loop <PROMPT BELOW>
```

Use the **self-pace** form (no interval) so each firing's wake-up matches the
work just done. The prompt is at the bottom of this file — copy verbatim.

## How `/loop` actually works

- Each firing is an **independent Claude session**. Memory between firings is
  the file system: `CLAUDE.md`, `STATUS.md`, design docs, source.
- Self-pace = the model calls `ScheduleWakeup` to choose the next firing time.
  The prompt cache TTL is 5 min, so a 270 s sleep stays warm; 3600 s pays a
  fresh-context cost but saves spend when idle.
- `/loop` only runs while the **maintainer's local Claude Code instance is
  alive**. Closing the laptop stops the loop until it's reopened.

## Pre-flight checklist (run on the maintainer's machine before leaving)

- [ ] `git status` is clean and `git log` shows main fully pushed.
- [ ] `pnpm install` completes and `pnpm ci:health` is green locally.
- [ ] Branch protection on GitHub `main` is **not** so strict that direct
      pushes are blocked (the loop pushes to main, per `branch-protection.md`).
- [ ] `STATUS.md` "Blocked" section is empty (the loop writes here).
- [ ] Sleep prevention: `caffeinate -dis &` in a spare terminal (macOS) or
      Settings → Lock Screen → "Never" while plugged in.
- [ ] Power adapter is in.
- [ ] Wi-Fi is reliable for the duration (or a fallback: ethernet, tether).
- [ ] No pending interactive prompts in the Claude Code window (close
      modals, dismiss notifications).

## What gets done

The loop walks the priority list **in order**, stopping when blocked or when
all priorities are exhausted:

1. **Phase 1 components remaining** — Checkbox, RadioGroup, Tabs, Dialog,
   Tooltip, Select, Field/Form. Each lands as machine + attachment +
   component + sandbox + e2e + axe + Playground demo, mirroring the proven
   Toggle / Switch / Combobox template.
2. **Phase 0c QA gates** — APG-driven keyboard test harness, per-package
   `api-extractor.json`, TypeDoc, `llms-full.txt` builder, Lighthouse CI on
   the docs site.
3. **Phase 2 components** — Calendar, DatePicker, NumberField, Slider, Menu,
   Accordion, Popover, Toast.
4. **Phase 0b deferred composition** — `withValidation`, `withAsyncSearch`,
   `withMultiSelect`, `withVirtualization` on Combobox.

## Stop conditions

The loop self-stops (and writes to `STATUS.md` → "Blocked") when:

- The same pre-push gate fails twice with the same root cause it can't fix.
- A design decision is required that's not in `docs/design/16-decisions/`.
- All Phase 1 + 0c + Phase 2 + composition work is complete.

## After returning

1. Pull: `git pull --ff-only`.
2. Read `STATUS.md` — it has the post-loop snapshot. Look for "Blocked" if
   the loop stopped early.
3. Spot-check the docs site at `pnpm --filter @kumiki/docs dev` and click
   through the new components.
4. Review the commit log — every commit follows Conventional Commits and
   includes test + bundle measurements in the message body.

## Cost / pacing reality

- Self-pace with the recommended sleeps averages ~30 firings/day across a
  mix of "active commit" and "idle" periods.
- API spend per firing is dominated by re-reading `CLAUDE.md`, `STATUS.md`,
  and the design docs — context is large but the cache TTL helps when
  firings cluster.
- "No rest at all" (extremely short intervals) is counter-productive: each
  firing has fixed setup cost; the cache evicts; rate limits kick in. The
  prompt below caps minimum sleep at 60 s.

---

## The `/loop` prompt — copy this verbatim

```text
Continue Kumiki Phase 0/1 implementation autonomously. Working directory: /Users/baseballyama/git/kumiki on branch main, pushed to origin.

START EVERY FIRING WITH:
1. Read STATUS.md, CLAUDE.md, and docs/design/15-roadmap.md.
2. Run `git pull --ff-only origin main` (in case the maintainer pushed a hotfix while away).
3. Run `pnpm install` if pnpm-lock.yaml changed.

PICK THE NEXT SMALLEST END-TO-END DELIVERABLE in this priority order:
A. Phase 1 components remaining (in order):
   - Checkbox (machine.context.checked: 'true' | 'false' | 'mixed')
   - RadioGroup (roving tabindex via @kumiki/primitives/collection — implement that primitive too if needed)
   - Tabs (manual + automatic activation, RTL keyboard inversion, orientation)
   - Dialog (focus-trap + dismissable primitives, role=dialog, aria-modal, inert background)
   - Tooltip (open/close delays, prefers-reduced-motion, Floating UI peer)
   - Select (Combobox without free-text input)
   - Field/Form (Standard Schema validator, aria-invalid / aria-describedby / live-region wiring, race-token guarding for async)
B. Phase 0c QA gates: APG keyboard test harness reading keyboard.yaml, api-extractor.json per package, TypeDoc + typedoc-plugin-markdown integration into the docs site, llms-full.txt builder script at apps/docs/scripts/build-llms-full.ts, Lighthouse CI on docs.
C. Phase 2 components: Calendar / DatePicker (via @internationalized/date), NumberField, Slider, Menu, Accordion, Popover, Toast.
D. Phase 0b deferred composition: withValidation / withAsyncSearch / withMultiSelect / withVirtualization on Combobox.

PER COMPONENT (the proven Toggle / Switch / Combobox loop):
1. machine: pure-TS FSM, /* @__PURE__ */ on factory, tests with ≥15 cases including async race / disabled / keyboard / boundary, vitest.config.ts with coverage thresholds.
2. attachment: paint() function on every state change, attachment factories, jsdom tests with ≥10 cases.
3. component: Root.svelte + subcomponents using the `child` snippet pattern. SSR-safe attributes in template, attachment paints client-side. svelte.config.js with vitePreprocess.
4. apps/docs sandbox at /sandbox/<name> + e2e tests + axe tests (LTR / RTL × every documented state).
5. Playground demo at apps/docs/src/lib/playgrounds/demos/component-<name>.svelte with realistic styling.
6. Update registry.ts and snippets.ts.

GATES (every firing must end on a green state):
- pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm ci:health all green.
- Bundle within budget per docs/design/09-bundle-budget.md. If a budget is honestly impossible, write a new ADR raising it WITH measurement evidence; do not silently widen.
- Playwright e2e + axe pass with --workers=1.

COMMIT + PUSH (small + frequent — explicitly do NOT batch):
- Conventional Commits; scope = component name minus @kumiki/.
- Push to origin/main as soon as a logical unit completes its gates. A unit is one of:
  · One layer of one component (machine, attachment, OR component) with its tests passing.
  · One QA-gate addition.
  · One bug fix.
  · One docs / sandbox / playground demo update.
  Do NOT save up several components and push in a batch. The maintainer wants to see incremental main-branch movement; small commits are easier to review on return and easier for `git revert` if anything regresses.
- Push to origin/main when ALL gates pass — the pre-push hook verifies.
- After each successful push, update STATUS.md with the new test count, bundle measurements, and next priority. Commit STATUS.md as a follow-up `docs(status): <date> snapshot`.

STOP CONDITIONS (do not retry blindly):
- Same pre-push gate fails twice with the same root cause that you cannot resolve.
- A design decision is needed that is not in 16-decisions/.
- All of A + B + C + D are complete.
On any of these, write a clear note in STATUS.md under "Blocked" and stop the loop with a final status report.

GUARDRAILS (per CLAUDE.md):
- No --no-verify, --force, --hard, or skipping hooks.
- No widening bundle budgets without an ADR.
- No deleting submodules under references/.
- No publishing to npm (release.yml runs only on coordinated bumps).
- If unsure between two design choices, pick the simpler one and add a TBD note in the relevant docs/design/ section explaining what would unblock the other.

PACING:
- After a successful commit + push: ScheduleWakeup ~270 s (stay within cache TTL) to start the next slice.
- After a CI / test failure that you fixed: ~270 s.
- When idle (everything done, waiting for the maintainer): ~3600 s.
- Never less than 60 s between firings.
```
