<!--
  Kumiki landing page.

  Editorial / craft-focused — the hero is asymmetric, the type pairing
  contrasts a variable serif (Fraunces) with a humanist sans (DM Sans),
  and the "five layers" diagram visualises the architecture as
  interlocking joinery rails.

  All translatable copy is sourced from `dict()` — no per-locale branches.
-->
<script lang="ts">
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';

  const t = $derived(dict(ui.locale).landing);

  const components = [
    'Toggle',
    'Switch',
    'Checkbox',
    'RadioGroup',
    'Combobox',
    'Select',
    'Tabs',
    'Tooltip',
    'Popover',
    'Dialog',
    'Toast',
    'Menu',
    'Slider',
    'NumberField',
    'Accordion',
    'FormField',
    'Calendar',
    'DatePicker',
  ];
</script>

<svelte:head>
  <title>Kumiki — Headless UI primitives for Svelte 5</title>
  <meta
    name="description"
    content="Kumiki is a deeply accessible UI primitive library for Svelte 5. Five composable layers, twenty components, ten locales."
  />
</svelte:head>

<section class="hero">
  <div class="hero-grid">
    <div class="hero-text">
      <p class="eyebrow">
        <span class="dot" aria-hidden="true"></span>
        {t.eyebrow}
      </p>
      <h1>
        <span class="line-a">{t.titleA}</span>
        <span class="line-b">{t.titleB}</span>
      </h1>
      <p class="lede">{t.lede}</p>
      <div class="cta">
        <a class="btn primary" href="/docs/getting-started">
          {t.ctaPrimary}
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M3 7h8M8 4l3 3-3 3"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
          </svg>
        </a>
        <a class="btn ghost" href="/components">{t.ctaSecondary}</a>
      </div>

      <pre class="install" aria-label={t.installLabel} dir="ltr"><code
          >pnpm add @kumiki/components</code
        ></pre>
    </div>

    <aside class="hero-glyph" aria-hidden="true">
      <div class="glyph">
        <span class="ji ji-1">組</span>
        <span class="ji ji-2">木</span>
        <span class="rule rule-h"></span>
        <span class="rule rule-v"></span>
        <span class="seal">朱</span>
      </div>
      <div class="hero-meta">
        <p>{t.glossary}</p>
      </div>
    </aside>
  </div>

  <div class="ticker" aria-hidden="true">
    <div class="ticker-inner">
      {#each [...components, ...components] as c, i (i)}
        <span class="tk">{c}</span>
        <span class="dotc">·</span>
      {/each}
    </div>
  </div>
</section>

<section class="layers">
  <header class="section-head">
    <p class="kicker">{t.layersKicker}</p>
    <h2>{t.layersTitle}</h2>
    <p class="section-lede">{t.layersLede}</p>
  </header>

  <div class="layer-rail">
    {#each t.layers as l, idx (idx)}
      <article class="layer" style:--i={idx}>
        <header>
          <span class="ji">{l.ja}</span>
          <div>
            <p class="num">L{idx}</p>
            <h3>{l.latin}</h3>
          </div>
        </header>
        <p>{l.desc}</p>
        <span class="join" aria-hidden="true"></span>
      </article>
    {/each}
  </div>
</section>

<section class="features">
  <header class="section-head">
    <p class="kicker">{t.featuresKicker}</p>
    <h2>{t.featuresTitle}</h2>
  </header>

  <div class="feature-grid">
    {#each t.features as f, idx (idx)}
      <article class="feature">
        <p class="figure">{f.figure}</p>
        <h3>{f.title}</h3>
        <p>{f.detail}</p>
      </article>
    {/each}
  </div>
</section>

<section class="excerpt">
  <header class="section-head">
    <p class="kicker">{t.excerptKicker}</p>
    <h2>{t.excerptTitle}</h2>
  </header>

  <div class="excerpt-grid">
    <pre dir="ltr"><code
        >{`<script lang="ts">
  import Toggle from '@kumiki/components/toggle';
  let pressed = $state(false);
<\/script>

<Toggle.Root bind:pressed aria-label="Mute">
  {pressed ? 'Muted' : 'On'}
</Toggle.Root>`}</code
      ></pre>

    <ul class="checklist">
      {#each t.checklist as item, i (i)}
        <li><span aria-hidden="true">⏚</span> {item}</li>
      {/each}
    </ul>
  </div>
</section>

<style>
  /* ── Hero ─────────────────────────────────────────────────────────────── */
  .hero {
    position: relative;
    max-width: var(--k-content-max);
    margin: 0 auto;
    padding: 96px 24px 0;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr minmax(0, 360px);
    gap: 48px;
    align-items: end;
  }
  .hero-text {
    max-width: 680px;
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--k-ink-3);
    margin-bottom: 24px;
  }
  .dot {
    width: 7px;
    height: 7px;
    background: var(--k-shu);
    border-radius: 999px;
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--k-shu) 25%, transparent);
    animation: pulse 2.4s var(--k-ease-out) infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 0 0 3px color-mix(in oklab, var(--k-shu) 25%, transparent);
    }
    50% {
      box-shadow: 0 0 0 6px color-mix(in oklab, var(--k-shu) 5%, transparent);
    }
  }

  h1 {
    font-family: var(--k-font-display);
    font-size: clamp(2rem, 4.6vw, 4rem);
    line-height: 1.05;
    font-weight: 400;
    letter-spacing: -0.035em;
    margin: 0;
    font-variation-settings:
      'opsz' 144,
      'SOFT' 30;
    color: var(--k-ink-1);
  }
  h1 .line-a {
    display: block;
  }
  h1 .line-b {
    display: block;
    font-style: italic;
    color: var(--k-shu-ink);
    font-variation-settings:
      'opsz' 144,
      'SOFT' 100;
  }
  :global([data-theme='dark']) h1 .line-b {
    color: var(--k-shu);
  }

  .lede {
    font-family: var(--k-font-display);
    font-size: clamp(1rem, 1.4vw, 1.18rem);
    line-height: 1.6;
    color: var(--k-ink-2);
    margin-top: 24px;
    max-width: 56ch;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }

  .cta {
    margin-top: 32px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 18px;
    border-radius: var(--k-radius-sm);
    font-size: 14px;
    font-weight: 500;
    transition:
      transform var(--k-dur-fast),
      background var(--k-dur-fast),
      border-color var(--k-dur-fast);
  }
  .btn.primary {
    background: var(--k-ink-1);
    color: var(--k-surface-0);
    border: 1px solid var(--k-ink-1);
  }
  .btn.primary:hover {
    background: var(--k-shu);
    border-color: var(--k-shu);
    color: white;
    text-decoration: none;
    transform: translateY(-1px);
  }
  .btn.ghost {
    background: transparent;
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
  }
  .btn.ghost:hover {
    border-color: var(--k-ink-2);
    text-decoration: none;
  }
  .install {
    margin-top: 20px;
    width: max-content;
    max-width: 100%;
    border-style: dashed;
  }
  .install code::before {
    content: '$ ';
    color: var(--k-ink-4);
  }

  /* ── Hero glyph ──────────────────────────────────────────────────────── */
  .hero-glyph {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 24px;
  }
  .glyph {
    position: relative;
    aspect-ratio: 1 / 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    overflow: hidden;
  }
  .ji {
    font-family: var(--k-font-display);
    font-size: clamp(80px, 14vw, 180px);
    color: var(--k-ink-1);
    display: grid;
    place-items: center;
    font-variation-settings: 'opsz' 144;
    font-weight: 500;
    line-height: 1;
  }
  .ji-1 {
    grid-column: 1;
    grid-row: 1;
  }
  .ji-2 {
    grid-column: 2;
    grid-row: 2;
  }
  .rule {
    position: absolute;
    background: var(--k-line-2);
  }
  .rule-h {
    inset-inline: -10%;
    inset-block-start: 50%;
    height: 1px;
  }
  .rule-v {
    inset-block: -10%;
    inset-inline-start: 50%;
    width: 1px;
  }
  .seal {
    position: absolute;
    inset-block-end: 16px;
    inset-inline-end: 16px;
    width: 38px;
    height: 38px;
    background: var(--k-shu);
    color: white;
    display: grid;
    place-items: center;
    font-family: var(--k-font-display);
    font-size: 22px;
    border-radius: var(--k-radius-xs);
    transform: rotate(-3deg);
    box-shadow: var(--k-shadow-sm);
  }
  .hero-meta p {
    font-family: var(--k-font-display);
    font-size: 14px;
    color: var(--k-ink-3);
    line-height: 1.6;
    border-inline-start: 2px solid var(--k-line-2);
    padding-inline-start: 12px;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
  .hero-meta em {
    font-style: italic;
    color: var(--k-ink-1);
  }

  /* ── Ticker ──────────────────────────────────────────────────────────── */
  .ticker {
    margin-top: 96px;
    border-block: 1px solid var(--k-line-1);
    overflow: hidden;
    background: var(--k-surface-1);
    --duration: 72s;
  }
  .ticker-inner {
    display: inline-flex;
    gap: 28px;
    padding: 14px 0;
    white-space: nowrap;
    animation: scroll var(--duration) linear infinite;
  }
  :global([dir='rtl']) .ticker-inner {
    animation-direction: reverse;
  }
  .tk {
    font-family: var(--k-font-display);
    font-style: italic;
    font-size: 22px;
    color: var(--k-ink-2);
    font-variation-settings:
      'opsz' 36,
      'SOFT' 100;
  }
  .dotc {
    color: var(--k-shu);
    font-family: var(--k-font-display);
    font-size: 22px;
  }
  @keyframes scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  /* ── Section heads ───────────────────────────────────────────────────── */
  .section-head {
    max-width: var(--k-content-max);
    margin: 0 auto;
    padding: 96px 24px 32px;
  }
  .kicker {
    font-family: var(--k-font-mono);
    font-size: 11px;
    letter-spacing: 0.16em;
    color: var(--k-ink-4);
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .section-head h2 {
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    line-height: 1.2;
    letter-spacing: -0.025em;
    max-width: 24ch;
  }
  .section-lede {
    margin-top: 16px;
    color: var(--k-ink-3);
    max-width: 56ch;
    font-size: 1rem;
    line-height: 1.65;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }

  /* ── Layers ──────────────────────────────────────────────────────────── */
  .layers {
    position: relative;
  }
  .layer-rail {
    max-width: var(--k-content-max);
    margin: 0 auto;
    padding: 0 24px 48px;
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 1px;
    background: var(--k-line-1);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    overflow: hidden;
  }
  .layer {
    background: var(--k-surface-0);
    padding: 24px 18px 28px;
    position: relative;
    min-height: 200px;
    transition: background var(--k-dur-fast);
  }
  .layer:hover {
    background: var(--k-surface-1);
  }
  .layer header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 16px;
  }
  .layer .ji {
    font-family: var(--k-font-display);
    font-size: 44px;
    color: var(--k-shu);
    line-height: 1;
    font-weight: 500;
  }
  .layer .num {
    font-family: var(--k-font-mono);
    font-size: 10px;
    color: var(--k-ink-4);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .layer h3 {
    font-family: var(--k-font-display);
    font-size: 18px;
    line-height: 1;
    color: var(--k-ink-1);
    letter-spacing: -0.01em;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
  }
  .layer p {
    font-size: 13.5px;
    color: var(--k-ink-3);
    line-height: 1.55;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .layer .join {
    position: absolute;
    inset-inline-end: -4px;
    inset-block: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background: var(--k-shu);
    border-radius: 999px;
    z-index: 1;
  }
  .layer:last-child .join {
    display: none;
  }

  @media (max-width: 1080px) {
    .layer-rail {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  @media (max-width: 640px) {
    .layer-rail {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .layer .ji {
      font-size: 32px;
    }
    .layer .join {
      display: none;
    }
  }

  /* ── Features ─────────────────────────────────────────────────────────── */
  .features {
    background: var(--k-surface-1);
    border-block: 1px solid var(--k-line-1);
    margin-top: 24px;
  }
  .feature-grid {
    max-width: var(--k-content-max);
    margin: 0 auto;
    padding: 0 24px 96px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1px;
    background: var(--k-line-1);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    overflow: hidden;
  }
  .feature {
    background: var(--k-surface-0);
    padding: 32px 24px;
  }
  .feature .figure {
    font-family: var(--k-font-display);
    font-size: 36px;
    line-height: 1.05;
    letter-spacing: -0.04em;
    color: var(--k-shu-ink);
    margin-bottom: 16px;
    font-variation-settings:
      'opsz' 144,
      'SOFT' 100;
  }
  :global([data-theme='dark']) .feature .figure {
    color: var(--k-shu);
  }
  .feature h3 {
    font-family: var(--k-font-display);
    font-size: 17px;
    color: var(--k-ink-1);
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }
  .feature p {
    font-size: 13.5px;
    color: var(--k-ink-3);
    line-height: 1.6;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }

  @media (max-width: 920px) {
    .feature-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 540px) {
    .feature-grid {
      grid-template-columns: 1fr;
    }
  }

  /* ── Excerpt ─────────────────────────────────────────────────────────── */
  .excerpt-grid {
    max-width: var(--k-content-max);
    margin: 0 auto;
    padding: 0 24px 64px;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 32px;
    align-items: stretch;
  }
  .excerpt-grid pre {
    margin: 0;
    background: var(--k-code-bg);
    border-radius: var(--k-radius-md);
    padding: 24px;
    font-size: 13.5px;
    line-height: 1.7;
  }
  .checklist {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 8px 0;
  }
  .checklist li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 18px;
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    color: var(--k-ink-2);
    font-size: 14px;
    line-height: 1.6;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .checklist li span {
    color: var(--k-shu);
    font-family: var(--k-font-mono);
    font-size: 14px;
    line-height: 1.5;
  }

  @media (max-width: 920px) {
    .excerpt-grid {
      grid-template-columns: 1fr;
    }
  }

  /* ── Hero responsive ─────────────────────────────────────────────────── */
  @media (max-width: 920px) {
    .hero {
      padding: 56px 24px 0;
    }
    .hero-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }
    .hero-glyph {
      max-width: 280px;
    }
  }
</style>
