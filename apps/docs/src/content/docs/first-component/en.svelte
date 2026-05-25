<script lang="ts">
  import { resolve } from '$app/paths';
  import Prose from '$lib/components/Prose.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import { Toggle } from '@kumiki/components';

  let pressed = $state(false);
</script>

<svelte:head>
  <title>Your first component · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Getting started — 03"
  title="Your first component"
  lede="A guided five-minute tour. We'll wire a Toggle, observe its ARIA contract, and switch its display language without touching the component."
>
  <h2>1. Drop it in</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="Mute audio">
  {pressed ? 'Muted' : 'On'}
</Toggle.Root>`}</code
    ></pre>

  <h2>2. See it react</h2>
  <p>The toggle below is wired to your local state, not the demo registry — try it.</p>

  <PreviewFrame>
    <div style="display: flex; gap: 16px; align-items: center;">
      <Toggle.Root bind:pressed aria-label="Mute audio">
        {pressed ? 'Muted' : 'On'}
      </Toggle.Root>
      <span style="font-family: var(--k-font-mono); font-size: 12px; color: var(--k-ink-3);">
        pressed = {pressed}
      </span>
    </div>
  </PreviewFrame>

  <h2>3. Inspect the contract</h2>
  <p>
    Open the inspector. The button has <code>aria-pressed</code> driven by state, plus a
    <code>data-state="on"</code> hook for CSS styling. No global CSS, no design opinions — style it any
    way you like.
  </p>
  <pre><code
      >{`<button aria-pressed="true" data-state="on" type="button">
  Muted
</button>`}</code
    ></pre>

  <h2>4. Localise it</h2>
  <p>
    Change the locale in the page header. The Toggle itself has no localised strings, but components
    like Combobox, Dialog, and FormField will switch instantly. Try the
    <a href={resolve('/components/component-combobox')}>Combobox demo</a> after switching to Japanese.
  </p>

  <h2>What now?</h2>
  <ul>
    <li>Read the <a href={resolve('/docs/architecture')}>five-layer architecture</a>.</li>
    <li>Skim the <a href={resolve('/docs/accessibility')}>accessibility model</a>.</li>
    <li>Browse <a href={resolve('/components')}>every component</a> with live demos.</li>
  </ul>
</Prose>
