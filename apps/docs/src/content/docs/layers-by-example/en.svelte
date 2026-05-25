<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const matrix = [
    { task: 'FSM (state transitions)', l2: 'Kumiki', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Svelte reactivity bridge', l2: 'You', l3: 'You*', l4: 'Kumiki', l5: 'Kumiki' },
    { task: '<button> element', l2: 'You', l3: 'You', l4: 'Kumiki', l5: 'Copied' },
    { task: 'ARIA attrs (aria-pressed, …)', l2: 'You', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'data-state output', l2: 'You', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Click / key handling', l2: 'You', l3: 'Kumiki', l4: 'Kumiki', l5: 'Kumiki' },
    { task: 'Accessible name (aria-label)', l2: 'You', l3: 'You', l4: 'You', l5: 'Kumiki' },
    { task: 'Styling', l2: 'You', l3: 'You', l4: 'You', l5: 'Copied' },
  ];
</script>

<svelte:head>
  <title>Layers by example — Toggle · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Foundations — 06"
  title="Layers by example: Toggle"
  lede="The same Toggle, written at Layer 2, 3, 4, and 5 — observed side by side. Each step down the stack hands you a little more control and a little more responsibility."
>
  <p>
    Kumiki's layers all expose <strong>the same behaviour at different levels of abstraction</strong
    >. Drop one layer and you take over more of the DOM, ARIA, and event plumbing — but you also
    gain freedom to choose the structure. Climb one layer and you write less code at the cost of
    accepting Kumiki's structural choices.
  </p>

  <p>
    We use <a href={resolve('/components/component-toggle')}>Toggle</a> as the worked example. The
    behaviour is simple (press to flip), but the implementation is present in
    <strong>all four layers</strong>, which makes it ideal for a side-by-side comparison.
  </p>

  <PreviewFrame>
    <div style="display: flex; gap: 16px; align-items: center;">
      <Toggle.Root bind:pressed aria-label="Mute">
        {pressed ? 'Muted' : 'On'}
      </Toggle.Root>
      <span style="font-family: var(--k-font-mono); font-size: 12px; color: var(--k-ink-3);">
        pressed = {pressed}
      </span>
    </div>
  </PreviewFrame>

  <h2>1. Layer 4 — Compound component (the default entry point)</h2>
  <p>
    The shortest path. <code>Toggle.Root</code> renders the <code>&lt;button&gt;</code>, manages
    ARIA, <code>data-state</code>, keyboard, and SSR. You're responsible for
    <strong>two things</strong>: receiving state via <code>bind:pressed</code>, and supplying an
    <code>aria-label</code> (or visible label).
  </p>

  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="Mute">
  {pressed ? 'Muted' : 'On'}
</Toggle.Root>`}</code
    ></pre>

  <p>Resulting DOM:</p>

  <pre><code
      >{`<button type="button" aria-pressed="false" data-state="off" id="toggle-…">
  On
</button>`}</code
    ></pre>

  <p>
    <strong>Pick this when:</strong> 90% of cases. The native <code>&lt;button&gt;</code> works, you don't
    need to override the wrapping structure.
  </p>

  <h2>2. Layer 3 — Headless attachment</h2>
  <p>
    For when you need to choose the element yourself (an <code>&lt;a&gt;</code>, a
    <code>&lt;div role="button"&gt;</code>, a custom wrapper). <code>createToggle()</code> returns a
    <code>{`{@attach}`}</code>-compatible factory that you spread on whatever element you like.
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggle } from '@kumiki/headless/toggle';

  const t = createToggle({ initial: false });

  // controller.pressed is a plain getter. To display it as text you must
  // subscribe and mirror into $state. (Not needed if CSS handles everything.)
  let pressed = $state(t.pressed);
  $effect(() => t.subscribe(({ context }) => (pressed = context.pressed)));
<\/script>

<button {@attach t.root} aria-label="Mute" class="my-btn">
  {pressed ? 'Muted' : 'On'}
</button>`}</code
    ></pre>

  <p>
    On mount, <code>{`{@attach t.root}`}</code> writes the DOM-side attributes (<code>type</code>,
    <code>aria-pressed</code>, <code>data-state</code>, <code>id</code>) and wires click + key
    (Space / Enter) listeners. <strong>What's added to your responsibilities:</strong> picking the
    element, styling, the visible label, and (only if needed) a <code>subscribe</code> to mirror state
    into reactive locals.
  </p>

  <p>
    <strong>Pick this when:</strong> Layer 4's fixed structure (<code>&lt;button&gt;</code>) doesn't
    fit. For example, when you need the toggle inside a <code>&lt;label&gt;</code>, or wrapped in a
    custom higher-order shell.
  </p>

  <h2>3. Layer 2 — Pure machine</h2>
  <p>
    No Svelte at all — a pure-TypeScript finite state machine. <strong
      >You write the DOM, ARIA, events, and keyboard yourself.</strong
    >
  </p>

  <pre><code
      >{`<script lang="ts">
  import { createToggleMachine } from '@kumiki/machines/toggle';

  const m = createToggleMachine({ initial: false });
  let pressed = $state(m.context.pressed);
  m.subscribe(({ context }) => (pressed = context.pressed));
<\/script>

<button
  type="button"
  aria-pressed={pressed ? 'true' : 'false'}
  data-state={pressed ? 'on' : 'off'}
  aria-label="Mute"
  onclick={() => m.send({ type: 'TOGGLE' })}
>
  {pressed ? 'Muted' : 'On'}
</button>`}</code
    ></pre>

  <p>
    <strong>The reason to drop to Layer 2 is usually not UI — it's logic reuse:</strong>
  </p>
  <ul>
    <li>Validate Toggle logic on the server (SvelteKit server routes / Workers).</li>
    <li>Write pure FSM unit tests in Vitest (no jsdom, ~20μs per transition).</li>
    <li>
      Visualise transitions in <a href="https://stately.ai/viz">stately.ai/viz</a> (<code
        >machine.toJSON()</code
      > emits XState-compatible JSON).
    </li>
    <li>Embed in non-Svelte hosts (vanilla JS, Web Components, another framework).</li>
  </ul>

  <h2>4. Layer 5 — Atelier (copy-paste styled variants)</h2>
  <p>
    The CLI copies sources into your repo. After copying they are <strong>your code</strong> — edit freely.
  </p>

  <pre><code
      >{`# Tailwind v4 variant
npx kumiki add toggle --variant=tailwind

# Vanilla CSS variant
npx kumiki add toggle --variant=vanilla`}</code
    ></pre>

  <p>Files added:</p>

  <pre><code
      >{`src/lib/components/Toggle.svelte   # styled wrapper around Layer 4's Toggle.Root`}</code
    ></pre>

  <p>Use it like any other Svelte component:</p>

  <pre><code
      >{`<script lang="ts">
  import Toggle from '$lib/components/Toggle.svelte';
  let pressed = $state(false);
<\/script>

<Toggle bind:pressed>Mute</Toggle>`}</code
    ></pre>

  <p>
    <strong>Pick this when:</strong> you want a working visual baseline without writing CSS first.
    Layer 5 ships under <code>0.x.x-preview</code> during the v1.0 series, so for stability-sensitive
    projects prefer Layer 4 + your own styling.
  </p>

  <h2>Responsibility matrix</h2>

  <p>What you write at each layer. "Kumiki" = library handles it; "You" = your code.</p>

  <table class="matrix">
    <thead>
      <tr>
        <th>Responsibility</th>
        <th>L2 (machine)</th>
        <th>L3 (headless)</th>
        <th>L4 (component)</th>
        <th>L5 (atelier)</th>
      </tr>
    </thead>
    <tbody>
      {#each matrix as row (row.task)}
        <tr>
          <td class="task">{row.task}</td>
          <td class:you={row.l2 === 'You'} class:them={row.l2 === 'Kumiki'}>{row.l2}</td>
          <td class:you={row.l3.startsWith('You')} class:them={row.l3 === 'Kumiki'}>{row.l3}</td>
          <td class:you={row.l4 === 'You'} class:them={row.l4 === 'Kumiki'}>{row.l4}</td>
          <td class:them={row.l5 === 'Kumiki'}>{row.l5}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <p class="note">
    * The Svelte reactivity bridge is only needed at L3 if you display <code
      >controller.pressed</code
    >
    as text. If CSS handles everything via <code>data-state</code>, no <code>subscribe</code> is required.
  </p>

  <h2>Choosing a layer — decision tree</h2>

  <ul>
    <li>
      <strong>Need it working with styles right now?</strong> → <strong>Layer 5</strong>
      (<code>npx kumiki add</code>). Note: preview-tagged during v1.0.
    </li>
    <li>
      <strong>Standard &lt;button&gt; is fine, you'll style it yourself?</strong> →
      <strong>Layer 4</strong>
      (<code>{`<Toggle.Root>`}</code>). The default entry point.
    </li>
    <li>
      <strong>Need to choose the element type or structure yourself?</strong> →
      <strong>Layer 3</strong>
      (<code>{`{@attach t.root}`}</code>). If Layer 4's <code>child</code> snippet covers your need, stay
      at Layer 4 — it's less code.
    </li>
    <li>
      <strong>Run outside Svelte / validate on the server / want just the FSM?</strong> →
      <strong>Layer 2</strong>
      (<code>createToggleMachine</code>).
    </li>
  </ul>

  <h2>What to read next</h2>
  <ul>
    <li>
      <a href={resolve('/docs/styling')}>Styling</a> — how to use <code>data-*</code>,
      <code>class</code>
      pass-through, and the <code>child</code> snippet at Layer 4.
    </li>
    <li><a href={resolve('/docs/architecture')}>Architecture</a> — the full five-layer model.</li>
    <li>
      <a href={resolve('/docs/composition')}>Composition</a> — adding optional features via
      <code>with*</code> wrappers.
    </li>
  </ul>
</Prose>

<style>
  table.matrix {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 13px;
  }
  table.matrix th,
  table.matrix td {
    padding: 10px 12px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.matrix th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.matrix .task {
    color: var(--k-ink-2);
    font-weight: 500;
  }
  table.matrix td.you {
    color: var(--k-shu);
    font-family: var(--k-font-mono);
    font-size: 12px;
  }
  table.matrix td.them {
    color: var(--k-ink-4);
    font-family: var(--k-font-mono);
    font-size: 12px;
  }
  .note {
    font-size: 13px;
    color: var(--k-ink-3);
    border-inline-start: 2px solid var(--k-line-2);
    padding-inline-start: 12px;
    margin-block: 16px;
  }
</style>
