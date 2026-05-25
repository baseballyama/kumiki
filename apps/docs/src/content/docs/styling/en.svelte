<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);

  const stack = [
    {
      layer: 'Product baseline',
      tool: 'Global CSS [data-component*] selectors',
      use: 'Reset-style rules shared across every Dialog',
    },
    {
      layer: 'Design-system parts',
      tool: 'class pass-through to subcomponents',
      use: 'Structural styling for <MyDialog>',
    },
    {
      layer: 'Variant / theme',
      tool: 'CSS Custom Properties',
      use: 'Brand colours, dark / light switching',
    },
    {
      layer: 'State differences',
      tool: 'data-state selectors (or Tailwind data-[state=open]:)',
      use: 'Open / closed, selected, disabled, hover',
    },
    {
      layer: 'Element swap',
      tool: 'child snippet',
      use: 'Render <a> or <MyButton> as the root element',
    },
  ];
</script>

<svelte:head>
  <title>Styling · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Foundations — 07"
  title="Styling"
  lede="Kumiki Layer 4 ships zero bytes of CSS. Why we built it that way, how to dress it up, and how to navigate Svelte's scoped-style limits — five recipes and one pitfall."
>
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

  <h2>Why Kumiki ships no styles</h2>

  <p>
    Layer 4 emits only <strong>semantic DOM + ARIA + <code>data-*</code> attributes</strong>.
    Deliberate:
  </p>

  <ul>
    <li>
      <strong>Bundle budgets</strong>: Toggle 1.5 KB / Dialog 3.5 KB / Combobox 4.5 KB don't leave
      room for CSS.
    </li>
    <li>
      <strong>Design systems vary</strong>: Tailwind / UnoCSS / vanilla CSS / CSS-in-JS — by
      deciding nothing, we fit all of them.
    </li>
    <li>
      <strong>Animation is also CSS-driven</strong>: we just emit
      <code>data-state="open|closed"</code>; you decide between CSS Transitions, View Transitions,
      or a motion library.
    </li>
  </ul>

  <p>
    So you compose styling from <strong>five techniques</strong>. Listed below in order of
    preference.
  </p>

  <h2>Recipe 1: <code>data-*</code> selectors (the canonical state-styling route)</h2>

  <p>
    Read Kumiki's emitted attributes via CSS selectors. Battle-tested pattern established by Radix.
  </p>

  <table class="attrs">
    <thead>
      <tr><th>Attribute</th><th>Values</th><th>Where it appears</th></tr>
    </thead>
    <tbody>
      <tr
        ><td><code>data-state</code></td><td
          ><code>open</code> / <code>closed</code> / <code>opening</code> / <code>closing</code> /
          <code>on</code>
          / <code>off</code></td
        ><td>Dialog, Toggle, Tooltip, Popover</td></tr
      >
      <tr
        ><td><code>data-orientation</code></td><td
          ><code>horizontal</code> / <code>vertical</code></td
        ><td>Tabs, RadioGroup, Slider</td></tr
      >
      <tr
        ><td><code>data-side</code></td><td
          ><code>top</code> / <code>right</code> / <code>bottom</code> / <code>left</code></td
        ><td>Floating-positioned elements</td></tr
      >
      <tr
        ><td><code>data-direction</code></td><td><code>ltr</code> / <code>rtl</code></td><td
          >RTL inversion</td
        ></tr
      >
      <tr><td><code>data-disabled</code></td><td>(empty string)</td><td>Disabled state</td></tr>
      <tr
        ><td><code>data-checked</code></td><td
          ><code>true</code> / <code>false</code> / <code>mixed</code></td
        ><td>Checkbox / Toggle / Switch</td></tr
      >
      <tr
        ><td><code>data-component</code> / <code>data-component-host</code></td><td
          ><code>combobox</code> / <code>dialog</code> / …</td
        ><td>Identifies the component root element</td></tr
      >
      <tr
        ><td><code>data-component-part</code></td><td
          ><code>title</code> / <code>close</code> / <code>overlay</code> / …</td
        ><td>Identifies subcomponent elements</td></tr
      >
    </tbody>
  </table>

  <pre><code
      >{`/* global stylesheet */
[data-state='on'] { background: var(--ds-accent); color: white; }
[data-state='off'] { background: var(--ds-surface-2); }
[data-state='open'] { animation: fade-in 200ms; }
[data-state='closed'] { animation: fade-out 150ms; }`}</code
    ></pre>

  <p>The same in Tailwind / UnoCSS utilities:</p>

  <pre><code
      >{`<Toggle.Root class="bg-gray-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white" />`}</code
    ></pre>

  <h2>Recipe 2: <code>class</code> / <code>style</code> pass-through</h2>

  <p>
    Layer 4 subcomponents are <strong
      >thin one-element wrappers that spread <code>...rest</code></strong
    >. Anything you pass — <code>class</code>, <code>style</code>, additional <code>data-*</code>,
    extra ARIA attributes — lands on the real DOM root.
  </p>

  <pre><code
      >{`<Toggle.Root class="ds-toggle" style="--ring-color: var(--ds-accent)">
  Mute
</Toggle.Root>`}</code
    ></pre>

  <p>
    Implementation reference: <code>packages/components/src/toggle/Root.svelte</code> declares
    <code>[key: string]: unknown</code>
    in its Props type and spreads <code>...rest</code> directly on its <code>&lt;button&gt;</code>.
  </p>

  <h2>Recipe 3: CSS Custom Properties (the canonical theme-propagation route)</h2>

  <p>
    Unlike Svelte's scoped CSS, <strong>CSS variables flow through normal cascade</strong>. Declared
    on the parent, they reach DOM inside child components — completely bypassing Svelte's scope
    barrier.
  </p>

  <pre><code
      >{`<Combobox.Root style="
  --combobox-bg: var(--ds-surface);
  --combobox-border: var(--ds-line-strong);
">
  <Combobox.Input class="ds-input" />
</Combobox.Root>

<style>
  /* MyCombobox.svelte's scoped style — reaches the child's internal <input> */
  .ds-input {
    background: var(--combobox-bg);
    border: 1px solid var(--combobox-border);
  }
</style>`}</code
    ></pre>

  <p>
    <strong>Use for:</strong> brand colours, dark-mode switching, tokens that need to cross component
    boundaries.
  </p>

  <h2>Recipe 4: <code>child</code> snippet — element swap</h2>

  <p>
    By default <code>Toggle.Root</code> renders a <code>&lt;button&gt;</code>. The escape hatch for
    "I want an <code>&lt;a&gt;</code> here" or "I want my own <code>&lt;MyButton&gt;</code>".
  </p>

  <pre><code
      >{`<Toggle.Root bind:pressed>
  {#snippet child({ props, state })}
    <MyButton {...props} class="brand-btn" disabled={state.disabled}>
      {state.pressed ? 'Muted' : 'On'}
    </MyButton>
  {/snippet}
</Toggle.Root>`}</code
    ></pre>

  <p>
    <code>props</code> is fully typed: <code>type</code> / <code>aria-pressed</code> /
    <code>aria-disabled</code>
    / <code>data-state</code> / <code>onclick</code> / <code>onkeydown</code> / <code>id</code>.
    Your job is to spread it on your element.
  </p>

  <p class="note">
    <strong>Don't reach for this by default.</strong> <code>child</code> is an escape hatch, not the
    standard styling path. If a <code>class</code> pass-through covers it, prefer that — and
    remember that re-spreading <code>props</code> is on you (forgetting it loses ARIA / event wiring).
  </p>

  <h2>Recipe 5: Tailwind / UnoCSS / vanilla CSS</h2>

  <h3>Tailwind v4</h3>

  <pre><code
      >{`<Toggle.Root class="
  inline-flex items-center px-3 py-2 rounded-md
  bg-gray-200 text-gray-700
  data-[state=on]:bg-blue-600 data-[state=on]:text-white
  data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
" />`}</code
    ></pre>

  <h3>UnoCSS (default mode)</h3>
  <p>
    Identical authoring experience to Tailwind. The <code>data-[state=on]:</code> variant is built
    in via <code>@unocss/preset-mini</code> / <code>preset-wind3</code>.
  </p>

  <h3>UnoCSS svelte-scoped mode</h3>
  <p>
    <code>@unocss/svelte-scoped</code> scans each parent <code>.svelte</code>, then injects the
    generated CSS <strong>wrapped in <code>:global(...)</code></strong> into that file's
    <code>&lt;style&gt;</code>. Because the rules are global, utilities you wrote in the parent
    reach DOM inside child components without further work.
  </p>

  <h3>Vanilla CSS / CSS Modules</h3>

  <pre><code
      >{`/* app.css (global) */
.ds-toggle {
  display: inline-flex; align-items: center;
  padding: 8px 12px; border-radius: 6px;
  background: var(--ds-surface-2); color: var(--ds-ink);
}
.ds-toggle[data-state='on'] {
  background: var(--ds-accent); color: white;
}
.ds-toggle[data-disabled] { opacity: 0.5; cursor: not-allowed; }`}</code
    ></pre>

  <pre><code>{`<Toggle.Root class="ds-toggle">Mute</Toggle.Root>`}</code></pre>

  <h2>Pattern: building a design system on top</h2>

  <p>
    Wrap Kumiki in your own <code>&lt;MyToggle&gt;</code> for product-wide reuse.
  </p>

  <pre><code
      >{`<!-- src/lib/components/MyToggle.svelte -->
<script lang="ts">
  import { Toggle } from '@kumiki/components';
  import type { Snippet } from 'svelte';

  type Props = {
    pressed?: boolean;
    'aria-label': string;
    children: Snippet;
  };
  let { pressed = $bindable(false), 'aria-label': ariaLabel, children }: Props = $props();
<\/script>

<Toggle.Root bind:pressed aria-label={ariaLabel} class="ds-toggle">
  {@render children()}
</Toggle.Root>

<style>
  /* Recipe 2 — class pass-through means this scoped style reaches the real DOM */
  :global(.ds-toggle) {
    display: inline-flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    background: var(--ds-surface-2);
    transition: background 120ms;
  }
  :global(.ds-toggle[data-state='on']) {
    background: var(--ds-accent);
    color: white;
  }
</style>`}</code
    ></pre>

  <p>Consumer side:</p>

  <pre><code
      >{`<script lang="ts">
  import MyToggle from '$lib/components/MyToggle.svelte';
  let muted = $state(false);
<\/script>

<MyToggle bind:pressed={muted} aria-label="Mute">
  {muted ? 'Muted' : 'On'}
</MyToggle>`}</code
    ></pre>

  <h2>Pitfall: Svelte's scoped <code>&lt;style&gt;</code> doesn't propagate into children</h2>

  <p>
    A long-standing Svelte constraint: classes defined in a parent <code>.svelte</code>'s
    <code>&lt;style&gt;</code> <strong>do not reach DOM elements inside child components</strong>.
  </p>

  <pre><code
      >{`<!-- Doesn't work as expected -->
<Combobox.Root class="my-combo">
  <Combobox.Input />
</Combobox.Root>

<style>
  /* .my-combo isn't used in this file's template, so Svelte may strip it,
     and the descendant <input> lives in another component's scope. */
  .my-combo input { padding: 8px; }
</style>`}</code
    ></pre>

  <p>Four ways out:</p>

  <ol>
    <li>
      <strong>Use Tailwind / UnoCSS / a global stylesheet</strong> (recipes 1, 5). Not scoped to
      begin with, so the problem doesn't exist. <strong>First-line recommendation.</strong>
    </li>
    <li>
      <strong>Pass a <code>class</code> to each subcomponent</strong> (recipe 2).
      <code>&lt;Combobox.Input class="ds-input" /&gt;</code>
      lands the class on the child's root element. Inside a parent <code>&lt;style&gt;</code> you'd
      write <code>:global(.ds-input)</code> (or move the rule to <code>app.css</code>).
    </li>
    <li>
      <strong>CSS Custom Properties</strong> (recipe 3). They cascade past Svelte scoping. Best for theme
      propagation.
    </li>
    <li>
      <strong><code>:global(...)</code> piercing</strong>. Last resort.
      <pre><code
          >{`<style>
  .my-combo :global([data-component-part='item'][data-highlighted]) {
    background: var(--ds-accent-subtle);
  }
</style>`}</code
        ></pre>
      Svelte 5 also supports the<code>:global &#123; ... &#125;</code> block syntax.
    </li>
  </ol>

  <h2>Recommended stack</h2>

  <table class="stack">
    <thead>
      <tr><th>Layer</th><th>Tool</th><th>Use</th></tr>
    </thead>
    <tbody>
      {#each stack as row (row.layer)}
        <tr>
          <td class="layer">{row.layer}</td>
          <td><code>{row.tool}</code></td>
          <td class="use">{row.use}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2>What to read next</h2>
  <ul>
    <li>
      <a href={resolve('/docs/layers-by-example')}>Layers by example</a> — how user-land code differs
      at Layer 2/3/4/5.
    </li>
    <li>
      <a href={resolve('/docs/composition')}>Composition</a> — adding optional features via
      <code>with*</code> wrappers.
    </li>
    <li>
      <a href={resolve('/docs/i18n')}>i18n & RTL</a> — using <code>data-direction</code> for RTL styling.
    </li>
  </ul>
</Prose>

<style>
  table.attrs,
  table.stack {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 13px;
  }
  table.attrs th,
  table.attrs td,
  table.stack th,
  table.stack td {
    padding: 10px 12px;
    text-align: start;
    border-block-end: 1px solid var(--k-line-1);
    vertical-align: middle;
  }
  table.attrs th,
  table.stack th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    border-block-end-color: var(--k-line-2);
    font-weight: 500;
  }
  table.stack .layer {
    color: var(--k-ink-2);
    font-weight: 500;
  }
  table.stack .use,
  table.attrs td:last-child {
    color: var(--k-ink-3);
  }
  table.attrs code,
  table.stack code {
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
