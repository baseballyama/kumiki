<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Introduction · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Getting started — 01"
  title="Introduction"
  lede="Kumiki — 組木 — is a deeply accessible UI primitive system for Svelte 5. It exists because the question “make this component a11y-correct, internationalisable, themeable, and lean” shouldn't be answered fifty times in fifty different repos."
>
  <h2>Why Kumiki?</h2>
  <p>
    Most accessible component libraries pick one trade-off and stick with it. Some are headless and
    leave you to wire ARIA yourself. Some are styled and ship a full design system. Some lock you
    into a state machine library; some don't have one at all. Kumiki refuses the trade-off: five
    composable layers, each independently usable.
  </p>

  <ul>
    <li><strong>Layer 0 — Types.</strong> A shared TypeScript surface every layer above speaks.</li>
    <li>
      <strong>Layer 1 — Primitives.</strong> Framework-agnostic helpers (focus trap, dismissable, ID,
      locale).
    </li>
    <li>
      <strong>Layer 2 — Machines.</strong> Pure-TS finite state machines. ~1 KB runtime, fully inspectable
      JSON.
    </li>
    <li>
      <strong>Layer 3 — Attachments.</strong> <code>{'{@attach}'}</code> factories that drive ARIA
      and <code>data-state</code> on real DOM nodes.
    </li>
    <li>
      <strong>Layer 4 — Components.</strong> Compound primitives like
      <code>{`<Combobox.Root>`}</code>, ergonomic by default.
    </li>
    <li>
      <strong>Layer 5 — Atelier.</strong> Opinionated, copy-pasteable styled variants. Ships at
      <code>0.x-preview</code>.
    </li>
  </ul>

  <h2>Status</h2>
  <p>
    Kumiki is <strong>pre-alpha</strong>. The architecture is locked, the bundle budgets are
    enforced in CI, and the screen-reader nightlies are running — but no version has been published
    to npm yet. Expect the API to change. File issues at
    <a href="https://github.com/baseballyama/kumiki/issues">baseballyama/kumiki</a>.
  </p>

  <h2>Up next</h2>
  <p>
    Next stop: <a href={resolve('/docs/installation')}>installation</a> or
    <a href={resolve('/docs/architecture')}>architecture</a>. If you'd rather just look at things,
    <a href={resolve('/components')}>browse the components</a>.
  </p>
</Prose>
