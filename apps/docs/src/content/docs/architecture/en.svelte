<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';

  const layers = [
    {
      n: 0,
      ji: '型',
      name: 'Types',
      pkg: '@kumiki/types',
      role: 'Shared TypeScript surface — the only thing every other layer agrees on.',
    },
    {
      n: 1,
      ji: '基',
      name: 'Primitives',
      pkg: '@kumiki/primitives',
      role: 'Framework-agnostic helpers (focus trap, dismissable, ID, locale, motion).',
    },
    {
      n: 2,
      ji: '機',
      name: 'Machines',
      pkg: '@kumiki/machines',
      role: 'Pure-TS finite state machines. ~1 KB runtime, JSON-inspectable.',
    },
    {
      n: 3,
      ji: '装',
      name: 'Attachments',
      pkg: '@kumiki/headless',
      role: 'Svelte 5 {@attach} factories — drive ARIA + data-state on real DOM.',
    },
    {
      n: 4,
      ji: '組',
      name: 'Components',
      pkg: '@kumiki/components',
      role: 'Compound primitives. Dot-namespace ergonomic API.',
    },
    {
      n: 5,
      ji: '釉',
      name: 'Atelier',
      pkg: '@kumiki/atelier',
      role: 'Layer 5 preview — copy-pasteable styled variants.',
    },
  ];
</script>

<svelte:head>
  <title>Architecture · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Foundations — 01"
  title="Five layers, one mental model."
  lede="Each Kumiki primitive is exactly one layer. Pick the layer that matches your control needs — and ship the bytes for that layer only. Subpath exports keep tree-shaking surgical."
>
  <p>
    Names borrow from <em>Kumiki</em> joinery. Each layer is a piece that locks into the next without
    nails or glue.
  </p>

  <table class="layers">
    <thead>
      <tr>
        <th>L</th>
        <th>名 — Name</th>
        <th>Package</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      {#each layers as l (l.n)}
        <tr>
          <td class="num">L{l.n}</td>
          <td><span class="ji">{l.ji}</span><strong>{l.name}</strong></td>
          <td><code>{l.pkg}</code></td>
          <td class="role">{l.role}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2>Picking a layer</h2>
  <p>Most apps live at Layer 4. Reach down only when you need to:</p>
  <ul>
    <li>
      <strong>Layer 3 (attachments)</strong> when you control the DOM tightly — you're styling with
      native <code>&lt;button&gt;</code>, not a Svelte wrapper.
    </li>
    <li>
      <strong>Layer 2 (machines)</strong> for SSR / server-side validation, or to run the logic in a non-Svelte
      context (Cypress, Vitest, a worker).
    </li>
    <li>
      <strong>Layer 1 (primitives)</strong> when you're authoring your own component on top of the dismissable
      / focus-trap / ID engines.
    </li>
  </ul>

  <h2>Why not pull it all in?</h2>
  <p>
    Bundle budgets. Each subpath has a brotli budget enforced in CI — Toggle ships in 1.5 KB,
    Combobox in 4.5 KB. Pulling Layer 5 styled variants into a project that already owns its design
    tokens is wasted bytes; the Atelier package is opt-in, not the default.
  </p>

  <h2>Authoritative reading</h2>
  <p>
    The internal design docs live at
    <a href="https://github.com/baseballyama/kumiki/tree/main/docs/design">/docs/design</a>. Of
    particular note:
  </p>
  <ul>
    <li><code>02-architecture.md</code> — this layer model, with diagrams.</li>
    <li><code>03-package-structure.md</code> — package boundaries.</li>
    <li><code>04-state-machines.md</code> — the FSM runtime spec.</li>
    <li><code>09-bundle-budget.md</code> — the per-subpath brotli budgets.</li>
  </ul>
</Prose>

<style>
  table.layers {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 14px;
  }
  table.layers th,
  table.layers td {
    padding: 12px 14px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.layers th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.layers .num {
    color: var(--k-shu);
    font-family: var(--k-font-mono);
    font-size: 12px;
    width: 5%;
  }
  table.layers .ji {
    font-family: var(--k-font-display);
    font-size: 22px;
    color: var(--k-ink-1);
    margin-inline-end: 8px;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
  }
  table.layers .role {
    color: var(--k-ink-3);
  }
  table.layers code {
    font-size: 11px;
  }
</style>
