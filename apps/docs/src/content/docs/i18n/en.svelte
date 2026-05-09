<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
  import { LOCALES } from '$lib/i18n/dict.js';
</script>

<svelte:head>
  <title>i18n & RTL · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Foundations — 04"
  title="Languages as subpath imports."
  lede="No mega-bundle of translations. Each locale is its own subpath import at ≤ 1 KB brotli, lazy-loaded on demand. RTL inversion lives in the state machine, not in CSS."
>
  <h2>Phase 1 locales</h2>
  <ul class="locales">
    {#each LOCALES as l (l.code)}
      <li>
        <span class="native">{l.native}</span>
        <span class="meta"><code>@kumiki/locale/{l.code}</code> · {l.name}</span>
      </li>
    {/each}
  </ul>

  <h2>Switching at runtime</h2>
  <p>
    Wrap your app once, then switch the imported locale bundle at any time. Components below re-read
    messages on every change.
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import * as ja from '@kumiki/locale/ja';
  import * as en from '@kumiki/locale/en';

  let active = $state<'ja' | 'en'>('ja');
  const bundle = $derived(active === 'ja' ? ja : en);
<\/script>

<button onclick={() => (active = active === 'ja' ? 'en' : 'ja')}>
  {active.toUpperCase()}
</button>

<LocaleProvider.Root locale={active} messages={bundle.messages} dir={bundle.direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <h2>RTL is not an afterthought</h2>
  <p>
    Reading direction is propagated from <code>LocaleProvider</code> through context. Direction-
    sensitive keymaps (Tabs <code>ArrowRight</code>, Slider, RadioGroup) read direction from the
    machine context — the controller doesn't know about RTL.
  </p>

  <p>
    The <strong>direction toggle</strong> on every component detail page lets you preview RTL for any
    locale, without switching languages. Use it to verify your styling.
  </p>

  <h2>What's localised</h2>
  <p>The <code>@kumiki/locale</code> bundles cover:</p>
  <ul>
    <li><code>combobox</code>: listbox label, "no results", clear button.</li>
    <li><code>dialog</code>: close-button label.</li>
    <li><code>tabs</code>: default tablist label.</li>
    <li><code>formField</code>: required marker, "required" / "type mismatch" errors.</li>
  </ul>
  <p>
    The Validation messages composed by Form Field can be replaced wholesale or extended via
    Standard Schema — no per-validator adapters required.
  </p>
</Prose>

<style>
  ul.locales {
    list-style: none;
    margin: 24px 0;
    padding: 0;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    overflow: hidden;
  }
  ul.locales li {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
    padding: 12px 16px;
    border-block-end: 1px solid var(--k-line-1);
  }
  ul.locales li:last-child {
    border-block-end: 0;
  }
  ul.locales .native {
    font-family: var(--k-font-display);
    font-size: 17px;
    color: var(--k-ink-1);
    font-variation-settings: 'opsz' 36;
  }
  ul.locales .meta {
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-ink-3);
  }
</style>
