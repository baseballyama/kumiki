<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';

  const budgets = [
    { name: '@kumiki/primitives/<each>', limit: '500 B' },
    { name: '@kumiki/runtime', limit: '1 KB' },
    { name: '@kumiki/machines/toggle', limit: '800 B' },
    { name: '@kumiki/machines/combobox', limit: '3 KB' },
    { name: '@kumiki/components/toggle', limit: '1.5 KB' },
    { name: '@kumiki/components/dialog', limit: '3.5 KB' },
    { name: '@kumiki/components/combobox', limit: '4.5 KB' },
    { name: '@kumiki/locale/<lang>', limit: '1 KB' },
  ];
</script>

<svelte:head>
  <title>Bundle budgets · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Foundations — 05"
  title="Bytes are a feature."
  lede="Every component subpath has a brotli budget. CI fails if a PR drifts over. Adjusting a budget upward requires a new ADR with measurement evidence — never a casual increment."
>
  <h2>The numbers</h2>
  <table class="budgets">
    <thead>
      <tr><th>Subpath</th><th class="num">Brotli</th></tr>
    </thead>
    <tbody>
      {#each budgets as b (b.name)}
        <tr><td><code>{b.name}</code></td><td class="num">{b.limit}</td></tr>
      {/each}
    </tbody>
  </table>

  <p>
    The full table — every subpath, every reasoning — lives at
    <a href="https://github.com/baseballyama/kumiki/blob/main/docs/design/09-bundle-budget.md"
      >docs/design/09-bundle-budget.md</a
    >. The current measured numbers are visible at
    <a href={resolve('/sizes')}>/sizes</a>; competitor comparisons live at
    <a href={resolve('/sizes/compare')}>/sizes/compare</a>.
  </p>

  <h2>How budgets are enforced</h2>
  <ol>
    <li><code>size-limit</code> measures every subpath on every CI run.</li>
    <li>If a measurement exceeds the limit, the build fails. No <code>--ignore</code>.</li>
    <li>
      <code>agadoo</code> verifies tree-shaking — every package declares
      <code>sideEffects: false</code> and is checked.
    </li>
    <li>
      <code>publint</code> + <code>arethetypeswrong</code> verify the published shape matches the
      declared <code>exports</code>.
    </li>
  </ol>

  <h2>Why this is in the docs</h2>
  <p>
    Because reviewers should know. A pull request that bumps Combobox from 4.5 KB to 4.8 KB is not a
    small change — it's a decision that requires a corresponding ADR. The number is visible to
    consumers; the discipline must be visible too.
  </p>
</Prose>

<style>
  table.budgets {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.budgets th,
  table.budgets td {
    padding: 10px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
  }
  table.budgets th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    font-weight: 500;
  }
  table.budgets .num {
    text-align: end;
    font-family: var(--k-font-mono);
    color: var(--k-shu-ink);
  }
  :global([data-theme='dark']) table.budgets .num {
    color: var(--k-shu);
  }
  table.budgets code {
    font-size: 12px;
    background: transparent;
    border: 0;
    padding: 0;
  }
</style>
