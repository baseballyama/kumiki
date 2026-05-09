<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Accessibility · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Foundations — 03"
  title="The long version of accessibility."
  lede="axe-core catches 30–40% of WCAG violations. The other 60% comes from APG keyboard tests and real screen-reader runs. Kumiki gates merges on all three."
>
  <h2>Three layers of testing</h2>

  <table class="strata">
    <thead>
      <tr>
        <th>What</th>
        <th>When</th>
        <th>Catches</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>axe-core</strong></td>
        <td>Every PR — LTR & RTL × every documented state</td>
        <td>Static violations: missing labels, contrast, role validity.</td>
      </tr>
      <tr>
        <td><strong>APG keyboard</strong></td>
        <td>Every PR — Playwright per pattern</td>
        <td>Tab order, arrow-key nav, Home / End / Page semantics, Escape.</td>
      </tr>
      <tr>
        <td><strong>Guidepup screen readers</strong></td>
        <td>Nightly schedule</td>
        <td>What VoiceOver and NVDA actually say, in actual order.</td>
      </tr>
    </tbody>
  </table>

  <h2>Required names at the type level</h2>
  <p>
    Where the WAI-ARIA APG mandates an accessible name (think dialogs), the requirement is enforced
    by TypeScript. <code>{`<Dialog.Root>`}</code> won't compile without one of
    <code>title</code>, <code>aria-label</code>, or <code>aria-labelledby</code>.
  </p>

  <pre><code
      >{`<Dialog.Root title="Confirm deletion">
  <!-- compiles -->
</Dialog.Root>

<Dialog.Root>
  <!-- type error: missing accessible name -->
</Dialog.Root>`}</code
    ></pre>

  <h2>Keyboard contracts</h2>
  <p>
    Each component documents its keymap on the component detail page (under the
    <strong>Accessibility</strong> tab). Where APG defines a pattern, Kumiki follows it verbatim — no
    creative interpretation.
  </p>

  <h2>Reduced motion, RTL, high contrast</h2>
  <ul>
    <li>
      <code>prefers-reduced-motion</code> shrinks all transitions to ~10 ms across the docs site.
    </li>
    <li>
      RTL is not an afterthought. Direction-sensitive keymaps (Tabs, Slider) read direction from
      machine context, not the DOM.
    </li>
    <li>Forced-colors mode is honoured — components avoid background-only state hints.</li>
  </ul>

  <h2>The "Kumiki-ready" checklist</h2>
  <p>
    Every component must satisfy the checklist in
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/05-accessibility.md"
      >docs/design/05-accessibility.md §5.6</a
    >
    before merge. No exceptions, no <code>--ignore</code> flags.
  </p>
</Prose>

<style>
  table.strata {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.strata th,
  table.strata td {
    padding: 12px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: top;
  }
  table.strata th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    font-weight: 500;
  }
  table.strata td {
    color: var(--k-ink-3);
  }
  table.strata td:first-child {
    color: var(--k-ink-1);
    width: 22%;
  }
  table.strata td:nth-child(2) {
    width: 32%;
  }
</style>
