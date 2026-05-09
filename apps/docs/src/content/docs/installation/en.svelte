<script lang="ts">
  import Prose from '$lib/components/Prose.svelte';
</script>

<svelte:head>
  <title>Installation · Kumiki</title>
</svelte:head>

<Prose
  kicker="/ Getting started — 02"
  title="Installation"
  lede="Kumiki ships as a set of independently versioned packages on npm. Install only the layer you need; subpath imports keep tree-shaking ruthless."
>
  <h2>Requirements</h2>
  <ul>
    <li>Node.js 22 or later.</li>
    <li>Svelte 5.29+ (for the <code>{'{@attach}'}</code> directive).</li>
    <li>An ESM-aware bundler — Vite 5+, Rollup 4+, esbuild 0.25+. CJS is not shipped.</li>
  </ul>

  <h2>Pick your layer</h2>
  <p>Most users want Layer 4 — compound components — and a locale bundle:</p>
  <pre><code>pnpm add @kumiki/components @kumiki/locale</code></pre>

  <p>Need full DOM control? Skip the components and consume Layer 3 attachments directly:</p>
  <pre><code>pnpm add @kumiki/headless</code></pre>

  <p>Building your own primitives? You can use any state machine standalone:</p>
  <pre><code>pnpm add @kumiki/machines</code></pre>

  <h2>Provide a locale</h2>
  <p>
    Wrap your app in <code>LocaleProvider</code> once. Every Kumiki component below it picks up the messages
    and reading direction.
  </p>
  <pre><code
      >{`<script lang="ts">
  import { LocaleProvider } from '@kumiki/components';
  import { messages, direction } from '@kumiki/locale/ja';

  let { children } = $props();
<\/script>

<LocaleProvider.Root locale="ja" {messages} dir={direction}>
  {@render children()}
</LocaleProvider.Root>`}</code
    ></pre>

  <p>
    The locale bundles are subpath imports — each weighs ≤ 1 KB brotli. Switch language at runtime
    by swapping the <code>messages</code> bundle; the components recompute their ARIA text automatically.
  </p>

  <h2>Verify the install</h2>
  <pre><code
      >{`<script lang="ts">
  import { Toggle } from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="Mute audio">
  {pressed ? 'Muted' : 'On'}
</Toggle.Root>`}</code
    ></pre>

  <p>That's it. Go and check the <a href="/components">component catalogue</a>.</p>
</Prose>
