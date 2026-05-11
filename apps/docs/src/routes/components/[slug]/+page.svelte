<script lang="ts">
  import type { Component } from 'svelte';
  import { LIVE_PLAYGROUNDS } from '$lib/playgrounds/registry.js';
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';
  import DirectionToggle from '$lib/components/DirectionToggle.svelte';
  import KumikiThemeSwitcher from '$lib/components/KumikiThemeSwitcher.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import LiveThumb from '$lib/components/LiveThumb.svelte';
  import { localizedSummary } from '$lib/playgrounds/summaries.js';

  let { data } = $props();
  // svelte-ignore state_referenced_locally
  const { entry, heroEntry, family, layers } = data;

  const t = $derived(dict(ui.locale).components);

  function pretty(name: string): string {
    const last = name.split('/').pop() ?? name;
    return last
      .split('-')
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join('');
  }

  function prettyFromFamily(fam: string): string {
    return fam
      .split('-')
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join('');
  }

  /**
   * Split a string on backtick-delimited spans so we can render `code` inline
   * without falling back to `{@html}`. Returns alternating segments where
   * odd indices are code and even indices are plain text.
   */
  function tokenizeInlineCode(text: string): ReadonlyArray<{ code: boolean; text: string }> {
    const out: { code: boolean; text: string }[] = [];
    const parts = text.split('`');
    parts.forEach((p, i) => {
      if (p === '') return;
      out.push({ code: i % 2 === 1, text: p });
    });
    return out;
  }

  // Default to L5 (Atelier) when present, otherwise step down through L4 / L3 / L2.
  // The URL slug determines the canonical entry, but the most polished view
  // (styled L5 demo) leads — visitors arriving on any layer's URL still see
  // the friendliest entry first and can drill down through the tabs.
  function pickDefault(): string {
    const l5 = layers.find((l) => l.entry.layer === 5);
    if (l5) return l5.entry.slug;
    const l4 = layers.find((l) => l.entry.layer === 4);
    if (l4) return l4.entry.slug;
    return layers[layers.length - 1]?.entry.slug ?? entry.slug;
  }

  let activeSlug = $state(pickDefault());
  const activeLayer = $derived(layers.find((l) => l.entry.slug === activeSlug) ?? layers[0]);

  // Per-slug demo cache. Each slug's lazy module is loaded at most once.
  const demoCache = new Map<string, Promise<Component>>();
  let activeDemo = $state<Component | undefined>(undefined);
  let demoError = $state<string | undefined>(undefined);

  function ensureDemo(slug: string): Promise<Component> | undefined {
    const loader = LIVE_PLAYGROUNDS[slug];
    if (!loader) return undefined;
    const cached = demoCache.get(slug);
    if (cached) return cached;
    const p = loader().then((m) => m.default as Component);
    demoCache.set(slug, p);
    return p;
  }

  $effect(() => {
    const slug = activeSlug;
    activeDemo = undefined;
    demoError = undefined;
    const p = ensureDemo(slug);
    if (!p) return;
    p.then(
      (c) => {
        if (activeSlug === slug) activeDemo = c;
      },
      (err) => {
        if (activeSlug === slug) demoError = String(err);
      },
    );
  });

  // APG-derived keyboard tables, keyed by family name so all layer URLs share.
  const KEYBOARD_MAP: Record<
    string,
    ReadonlyArray<{ keys: string; effect: { en: string; ja: string } }>
  > = {
    toggle: [
      {
        keys: 'Space, Enter',
        effect: { en: 'Toggles pressed state.', ja: 'pressed 状態を切り替え。' },
      },
      { keys: 'Tab', effect: { en: 'Move focus into / out.', ja: 'フォーカスの出入り。' } },
    ],
    switch: [
      {
        keys: 'Space, Enter',
        effect: { en: 'Toggles checked state.', ja: 'checked 状態を切り替え。' },
      },
      { keys: 'Tab', effect: { en: 'Move focus.', ja: 'フォーカス移動。' } },
    ],
    checkbox: [
      {
        keys: 'Space',
        effect: { en: 'Toggles checked / unchecked.', ja: 'checked / unchecked を切り替え。' },
      },
      { keys: 'Tab', effect: { en: 'Move focus.', ja: 'フォーカス移動。' } },
    ],
    'radio-group': [
      {
        keys: 'Arrow ↑/↓ ←/→',
        effect: { en: 'Move focus and select adjacent item.', ja: '隣接項目へ移動し選択。' },
      },
      { keys: 'Home / End', effect: { en: 'First / last item.', ja: '最初 / 最後の項目へ。' } },
      {
        keys: 'Tab',
        effect: { en: 'Move focus into / out of the group.', ja: 'グループへ出入り。' },
      },
    ],
    tabs: [
      {
        keys: 'Arrow ←/→',
        effect: { en: 'Move focus to adjacent tab.', ja: '隣のタブへフォーカス移動。' },
      },
      { keys: 'Home / End', effect: { en: 'First / last tab.', ja: '最初 / 最後のタブへ。' } },
      {
        keys: 'Enter, Space',
        effect: {
          en: 'Activate the focused tab (manual mode).',
          ja: 'フォーカス中のタブを有効化(手動モード)。',
        },
      },
    ],
    combobox: [
      { keys: 'Type', effect: { en: 'Filters listbox.', ja: 'リストを絞り込む。' } },
      {
        keys: 'Arrow ↓ / ↑',
        effect: { en: 'Move active option.', ja: 'アクティブなオプションを移動。' },
      },
      {
        keys: 'Enter',
        effect: { en: 'Commit active option.', ja: 'アクティブなオプションを確定。' },
      },
      {
        keys: 'Escape',
        effect: { en: 'Close listbox; clear if open.', ja: 'リストを閉じる。開いていればクリア。' },
      },
    ],
    dialog: [
      {
        keys: 'Escape',
        effect: { en: 'Close (when policy allows).', ja: '閉じる(ポリシーが許可している場合)。' },
      },
      {
        keys: 'Tab / Shift+Tab',
        effect: { en: 'Cycle focus within trap.', ja: 'トラップ内でフォーカスを循環。' },
      },
    ],
    tooltip: [
      { keys: 'Focus / Hover', effect: { en: 'Open after delay.', ja: '遅延後に表示。' } },
      {
        keys: 'Escape',
        effect: { en: 'Dismiss when content is hovered.', ja: 'ホバー中なら閉じる。' },
      },
    ],
    popover: [
      { keys: 'Click trigger', effect: { en: 'Toggle.', ja: 'トリガーで切り替え。' } },
      { keys: 'Escape', effect: { en: 'Dismiss (policy-aware).', ja: '閉じる(ポリシー準拠)。' } },
      { keys: 'Tab', effect: { en: 'Focus moves into content.', ja: 'コンテンツへフォーカス。' } },
    ],
    menu: [
      { keys: 'Arrow ↓ / ↑', effect: { en: 'Move active item.', ja: 'アクティブ項目を移動。' } },
      { keys: 'Home / End', effect: { en: 'First / last item.', ja: '最初 / 最後の項目。' } },
      {
        keys: 'Type-ahead',
        effect: { en: 'Jump to item by initial char.', ja: '頭文字で項目へジャンプ。' },
      },
      { keys: 'Enter', effect: { en: 'Activate item.', ja: '項目を有効化。' } },
    ],
    slider: [
      { keys: 'Arrow ←/→ ↑/↓', effect: { en: 'Step value by `step`.', ja: 'step ぶん値を変更。' } },
      {
        keys: 'PageUp / PageDown',
        effect: { en: 'Step by `pageStep`.', ja: 'pageStep ぶん変更。' },
      },
      { keys: 'Home / End', effect: { en: 'Jump to min / max.', ja: '最小 / 最大へジャンプ。' } },
    ],
    'number-field': [
      {
        keys: 'Arrow ↑ / ↓',
        effect: { en: 'Increment / decrement by step.', ja: 'step で増減。' },
      },
      {
        keys: 'PageUp / PageDown',
        effect: { en: 'Increment / decrement by pageStep.', ja: 'pageStep で増減。' },
      },
    ],
    accordion: [
      {
        keys: 'Arrow ↑ / ↓',
        effect: {
          en: 'Move focus to previous / next trigger.',
          ja: '前/次のトリガーへフォーカス移動。',
        },
      },
      {
        keys: 'Home / End',
        effect: { en: 'First / last trigger.', ja: '最初 / 最後のトリガーへ。' },
      },
      {
        keys: 'Space, Enter',
        effect: {
          en: 'Toggle the focused panel.',
          ja: 'フォーカス中のパネルを開閉。',
        },
      },
      {
        keys: 'Tab',
        effect: {
          en: 'Move focus out of the accordion.',
          ja: 'アコーディオン外へフォーカス。',
        },
      },
    ],
  };

  const keyboard = $derived(KEYBOARD_MAP[family] ?? []);
  const localeKey = $derived<'ja' | 'en'>(ui.locale === 'ja' ? 'ja' : 'en');

  function layerRole(n: 0 | 1 | 2 | 3 | 4 | 5): { ja: string; en: string } {
    return (
      [
        { ja: '型', en: 'Types' },
        { ja: 'プリミティブ', en: 'Primitives' },
        { ja: 'マシン', en: 'Machine' },
        { ja: 'ヘッドレス', en: 'Headless' },
        { ja: 'コンポーネント', en: 'Compound' },
        { ja: 'アトリエ', en: 'Atelier' },
      ][n] ?? { ja: `Layer ${n}`, en: `Layer ${n}` }
    );
  }

  // Active layer info for the panel header / when-to-use copy.
  const activeWhen = $derived(activeLayer ? (t.layerWhen[activeLayer.entry.layer] ?? '') : '');

  const heroSummary = $derived(localizedSummary(entry.slug, entry.summary, ui.locale));
</script>

<svelte:head>
  <title>{pretty(entry.name)} · {t.title} · Kumiki</title>
  <meta name="description" content={entry.summary} />
</svelte:head>

<div class="layout">
  <nav class="crumb" aria-label="Breadcrumb">
    <a href="/components">{t.backToCatalogue}</a>
  </nav>

  <!-- Hero: large showcase thumbnail + family identity -->
  <header class="hero">
    <div class="hero-thumb" aria-hidden="true">
      <div class="thumb-frame">
        <LiveThumb slug={heroEntry.slug} maxScale={1.0} pad={20} />
      </div>
      <span class="thumb-tag" dir="ltr">L{heroEntry.layer}</span>
    </div>
    <div class="hero-meta">
      <p class="kicker" dir="ltr">/ {family}</p>
      <h1>
        <span class="display">{prettyFromFamily(family)}</span>
      </h1>
      <code class="pkg" dir="ltr">{entry.name}</code>
      <p class="summary">
        {#each tokenizeInlineCode(heroSummary) as part, i (i)}
          {#if part.code}<code dir="ltr">{part.text}</code>{:else}{part.text}{/if}
        {/each}
      </p>

      <ul class="meta">
        {#if entry.apgUrl}
          <li>
            <a class="link" href={entry.apgUrl} target="_blank" rel="noopener noreferrer">
              {t.apgPattern} <span aria-hidden="true">↗</span>
            </a>
          </li>
        {/if}
        <li>
          <a
            class="link"
            href="https://github.com/baseballyama/kumiki/tree/main/packages"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.source} <span aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>
    </div>
  </header>

  <!-- Layer view: top-level tabs (L2 / L3 / L4 / L5) with split panels -->
  <section class="layers" aria-labelledby="layer-stage-title">
    <div class="layer-head">
      <h2 id="layer-stage-title" class="sr-only">{t.familyTitle}</h2>
      <div role="tablist" class="layer-tabs" aria-label={t.familyTitle}>
        {#each layers as l (l.entry.slug)}
          {@const isOn = activeSlug === l.entry.slug}
          {@const role = layerRole(l.entry.layer)}
          <button
            role="tab"
            type="button"
            id={`layer-tab-${l.entry.slug}`}
            aria-controls={`layer-panel-${l.entry.slug}`}
            aria-selected={isOn}
            tabindex={isOn ? 0 : -1}
            class="layer-tab"
            class:on={isOn}
            onclick={() => (activeSlug = l.entry.slug)}
          >
            <span class="tab-num" dir="ltr">L{l.entry.layer}</span>
            <span class="tab-role">{role[localeKey]}</span>
          </button>
        {/each}
      </div>
    </div>

    {#each layers as l (l.entry.slug)}
      {@const isOn = activeSlug === l.entry.slug}
      <div
        role="tabpanel"
        id={`layer-panel-${l.entry.slug}`}
        aria-labelledby={`layer-tab-${l.entry.slug}`}
        class="layer-panel"
        hidden={!isOn}
      >
        <p class="panel-when">
          {#each tokenizeInlineCode(t.layerWhen[l.entry.layer] ?? '') as part, i (i)}
            {#if part.code}<code dir="ltr">{part.text}</code>{:else}{part.text}{/if}
          {/each}
        </p>

        <div class="split" class:single={!l.hasLive && !l.machineSpec}>
          <!-- Left pane: live preview, machine spec card, or a "you write the markup" note -->
          {#if l.hasLive}
            <div class="pane pane-preview">
              <div class="pane-bar">
                <span class="pane-label">{t.livePreview}</span>
                <div class="pane-tools">
                  {#if l.entry.layer === 5}
                    <KumikiThemeSwitcher />
                  {/if}
                  <DirectionToggle />
                </div>
              </div>
              <div class="pane-body preview-body">
                <PreviewFrame>
                  {#if isOn}
                    {#if demoError}
                      <p class="err">Failed to load demo: <code>{demoError}</code></p>
                    {:else if activeDemo}
                      {@const Demo = activeDemo}
                      <Demo />
                    {:else}
                      <p class="loading">{t.livePreview}…</p>
                    {/if}
                  {/if}
                </PreviewFrame>
              </div>
            </div>
          {:else if l.machineSpec}
            <div class="pane pane-spec">
              <div class="pane-bar">
                <span class="pane-label">{t.machineTitle}</span>
              </div>
              <div class="pane-body spec-body">
                <p class="spec-blurb">{l.machineSpec.blurb}</p>
                <dl class="spec-meta">
                  <dt>{t.machineSource}</dt>
                  <dd><code dir="ltr">{l.machineSpec.pkg}</code></dd>
                  <dt>{t.machineInitial}</dt>
                  <dd><code dir="ltr">{l.machineSpec.initial}</code></dd>
                  <dt>{t.machineStates}</dt>
                  <dd>
                    {#each l.machineSpec.states as s, i (s)}<code dir="ltr">{s}</code
                      >{#if i < l.machineSpec.states.length - 1},
                      {/if}{/each}
                  </dd>
                </dl>
                <p class="spec-links">
                  <a
                    href={`/machine-specs/${l.machineSpec.name}.json`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.machineJson} <span aria-hidden="true">↗</span>
                  </a>
                  <span class="sep" aria-hidden="true">·</span>
                  <a
                    href={`https://stately.ai/viz?source=${encodeURIComponent(`https://kumiki.dev/machine-specs/${l.machineSpec.name}.json`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.machineViz} <span aria-hidden="true">↗</span>
                  </a>
                </p>
              </div>
            </div>
          {/if}

          <!-- Right pane: code snippets -->
          <div class="pane pane-code">
            <div class="pane-body code-body">
              <div class="snips">
                {#each l.snippets as s, i (i)}
                  <CodeBlock title={s.title} lang={s.lang} code={s.code} html={s.html} />
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </section>

  <!-- Accessibility showcase: trust signal for kumiki's a11y commitment -->
  <section class="a11y-section" aria-labelledby="a11y-title">
    <header class="a11y-head">
      <p class="a11y-kicker" dir="ltr">/ accessibility</p>
      <h2 id="a11y-title">{t.a11y}</h2>
      <p class="a11y-lede">{t.testItems[0]}</p>
    </header>

    <div class="a11y-grid">
      <article class="a11y-card">
        <h3>{t.keyboardTitle}</h3>
        {#if keyboard.length}
          <table>
            <thead>
              <tr>
                <th>{t.keyboardKey}</th>
                <th>{t.keyboardEffect}</th>
              </tr>
            </thead>
            <tbody>
              {#each keyboard as row, i (i)}
                <tr>
                  <td><kbd dir="ltr">{row.keys}</kbd></td>
                  <td>{row.effect[localeKey]}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        {:else}
          <p class="muted">{t.keyboardEmpty}</p>
        {/if}
      </article>

      <article class="a11y-card">
        <h3>{t.testTitle}</h3>
        <ul>
          {#each t.testItems as item, i (i)}
            <li>{item}</li>
          {/each}
        </ul>
        {#if entry.apgUrl}
          <a class="more" href={entry.apgUrl} target="_blank" rel="noopener noreferrer">
            {t.apgRead}
          </a>
        {/if}
      </article>
    </div>
  </section>
</div>

<style>
  .layout {
    max-width: var(--k-content-max);
    margin: 0 auto;
    padding: 24px 24px 64px;
  }
  .crumb {
    font-family: var(--k-font-mono);
    font-size: 12px;
    margin-bottom: 24px;
  }
  .crumb a {
    color: var(--k-ink-3);
  }
  .crumb a:hover {
    color: var(--k-ink-1);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* ─── Hero ──────────────────────────────────────────────────────────── */
  .hero {
    display: grid;
    grid-template-columns: minmax(320px, 0.95fr) 1fr;
    gap: 40px;
    align-items: center;
    padding-block: 8px 36px;
    border-bottom: 1px solid var(--k-line-1);
    margin-bottom: 32px;
  }
  .hero-thumb {
    position: relative;
    width: 100%;
    max-width: 460px;
  }
  .thumb-frame {
    width: 100%;
    aspect-ratio: 4 / 3;
    border: 1px solid var(--k-line-2);
    background: var(--k-surface-1);
    border-radius: var(--k-radius-lg);
    overflow: hidden;
    position: relative;
    box-shadow:
      0 1px 0 color-mix(in oklab, var(--k-ink-1) 4%, transparent),
      0 18px 40px -22px color-mix(in oklab, var(--k-ink-1) 22%, transparent);
  }
  .thumb-frame :global(.thumb) {
    aspect-ratio: 4 / 3;
    background: var(--k-surface-1);
    border-radius: 0;
  }
  .thumb-tag {
    position: absolute;
    inset-block-end: 12px;
    inset-inline-end: 12px;
    font-family: var(--k-font-mono);
    font-size: 10.5px;
    letter-spacing: 0.12em;
    color: var(--k-ink-3);
    background: color-mix(in oklab, var(--k-surface-0) 92%, transparent);
    border: 1px solid var(--k-line-1);
    padding: 3px 8px;
    border-radius: 999px;
    backdrop-filter: blur(6px);
  }
  .hero-meta {
    min-width: 0;
  }
  .kicker {
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: lowercase;
    letter-spacing: 0.16em;
    color: var(--k-shu);
    margin-bottom: 10px;
  }
  h1 {
    font-size: clamp(2.2rem, 4.4vw, 3.6rem);
    line-height: 1;
    letter-spacing: -0.035em;
    margin-bottom: 14px;
    font-variation-settings:
      'opsz' 144,
      'SOFT' 30;
  }
  h1 .display {
    color: var(--k-ink-1);
  }
  .pkg {
    font-family: var(--k-font-mono);
    font-size: 13px;
    color: var(--k-ink-3);
    background: transparent;
    border: 0;
    padding: 0;
    display: block;
    margin-bottom: 16px;
  }
  .summary {
    font-family: var(--k-font-display);
    font-size: 1.05rem;
    line-height: 1.55;
    color: var(--k-ink-2);
    max-width: 56ch;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .summary code {
    font-family: var(--k-font-mono);
    font-size: 0.86em;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-1);
    padding: 1px 6px;
    border-radius: 4px;
    margin-inline: 2px;
    letter-spacing: 0;
  }
  .meta {
    list-style: none;
    margin-top: 20px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
  }
  .meta .link {
    font-family: var(--k-font-mono);
    font-size: 12px;
    color: var(--k-ink-3);
    text-decoration: none;
    border-block-end: 1px solid transparent;
    padding-block-end: 1px;
    transition:
      color var(--k-dur-fast),
      border-color var(--k-dur-fast);
  }
  .meta .link:hover {
    color: var(--k-shu-ink);
    border-block-end-color: color-mix(in oklab, var(--k-shu) 40%, transparent);
  }

  @media (max-width: 880px) {
    .hero {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .hero-thumb {
      max-width: 100%;
    }
    .thumb-frame {
      aspect-ratio: 16 / 9;
    }
  }

  /* ─── Layer stage ───────────────────────────────────────────────────── */
  .layers {
    margin-block-start: 8px;
  }
  .layer-head {
    border-block-end: 1px solid var(--k-line-1);
    margin-block-end: 20px;
  }
  .layer-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
  }
  .pane-tools {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .layer-tab {
    position: relative;
    display: inline-flex;
    align-items: baseline;
    gap: 10px;
    background: transparent;
    border: 0;
    border-block-end: 2px solid transparent;
    padding: 14px 20px 12px;
    margin-block-end: -1px;
    color: var(--k-ink-3);
    cursor: pointer;
    border-radius: 0;
    transition:
      color var(--k-dur-fast),
      border-color var(--k-dur-fast),
      background var(--k-dur-fast);
  }
  .layer-tab:hover {
    color: var(--k-ink-1);
    background: var(--k-surface-1);
  }
  .layer-tab:focus-visible {
    outline: 2px solid var(--k-shu);
    outline-offset: -2px;
    border-radius: 2px;
  }
  .layer-tab.on {
    color: var(--k-ink-1);
    border-block-end-color: var(--k-shu);
  }
  .layer-tab .tab-num {
    font-family: var(--k-font-mono);
    font-size: 13px;
    letter-spacing: 0.04em;
    color: var(--k-shu);
    font-weight: 600;
  }
  .layer-tab .tab-role {
    font-family: var(--k-font-display);
    font-size: 14.5px;
    letter-spacing: -0.005em;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
  }

  .layer-panel[hidden] {
    display: none;
  }
  .panel-when {
    color: var(--k-ink-3);
    font-size: 13.5px;
    line-height: 1.5;
    margin: 0 0 14px;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .panel-when code {
    font-family: var(--k-font-mono);
    font-size: 12px;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-1);
    padding: 1px 5px;
    border-radius: 4px;
    margin-inline: 2px;
  }

  /* Split view */
  .split {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: 16px;
    align-items: stretch;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    background: var(--k-surface-0);
    overflow: hidden;
  }
  .split.single {
    grid-template-columns: 1fr;
  }
  .split.single .pane-code {
    border-inline-start: 0;
  }
  @media (max-width: 960px) {
    .split {
      grid-template-columns: 1fr;
    }
    .split .pane-code {
      border-inline-start: 0 !important;
      border-block-start: 1px solid var(--k-line-1);
    }
  }
  .pane {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .pane-code {
    border-inline-start: 1px solid var(--k-line-1);
    background: var(--k-surface-0);
  }
  .pane-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    background: var(--k-surface-1);
    border-block-end: 1px solid var(--k-line-1);
    min-height: 48px;
  }
  .pane-label {
    font-family: var(--k-font-mono);
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--k-ink-4);
  }
  .pane-body {
    flex: 1 1 auto;
    min-width: 0;
  }
  .preview-body {
    padding: 16px;
  }
  .preview-body :global(.frame) {
    min-height: 320px;
    border-radius: var(--k-radius-sm);
  }
  .code-body {
    padding: 16px;
    max-height: 640px;
    overflow-y: auto;
  }
  .snips {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* L2 machine-spec pane */
  .spec-body {
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .spec-blurb {
    color: var(--k-ink-2);
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .spec-meta {
    display: grid;
    grid-template-columns: minmax(120px, max-content) 1fr;
    gap: 6px 16px;
    font-size: 13px;
    margin: 0;
  }
  .spec-meta dt {
    color: var(--k-ink-4);
    font-family: var(--k-font-mono);
    font-size: 10.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .spec-meta dd {
    color: var(--k-ink-2);
    margin: 0;
  }
  .spec-meta code {
    font-family: var(--k-font-mono);
    font-size: 12.5px;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-1);
    padding: 1px 6px;
    border-radius: 4px;
    margin-inline-end: 6px;
  }
  .spec-links {
    font-size: 13px;
    margin: 0;
    font-family: var(--k-font-mono);
  }
  .spec-links a {
    color: var(--k-shu-ink);
    text-decoration: none;
  }
  :global([data-theme='dark']) .spec-links a {
    color: var(--k-shu);
  }
  .spec-links a:hover {
    text-decoration: underline;
  }
  .spec-links .sep {
    color: var(--k-ink-4);
    margin: 0 8px;
  }

  .err,
  .loading {
    color: var(--k-ink-3);
    padding: 24px;
    font-family: var(--k-font-mono);
    font-size: 12.5px;
  }

  /* ─── Accessibility section ─────────────────────────────────────────── */
  .a11y-section {
    margin-block-start: 56px;
    padding-block-start: 36px;
    border-block-start: 1px solid var(--k-line-1);
  }
  .a11y-head {
    margin-bottom: 24px;
    max-width: 80ch;
  }
  .a11y-kicker {
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: lowercase;
    letter-spacing: 0.16em;
    color: var(--k-ink-4);
    margin-bottom: 8px;
  }
  .a11y-section h2 {
    font-family: var(--k-font-display);
    font-size: clamp(1.4rem, 2.6vw, 1.8rem);
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
    color: var(--k-ink-1);
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
  }
  .a11y-lede {
    color: var(--k-ink-2);
    font-size: 14px;
    line-height: 1.65;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }

  .a11y-grid {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 720px) {
    .a11y-grid {
      grid-template-columns: 1fr;
    }
  }
  .a11y-card {
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    padding: 18px 20px;
  }
  .a11y-card h3 {
    font-family: var(--k-font-display);
    font-size: 16px;
    color: var(--k-ink-1);
    margin-bottom: 12px;
    letter-spacing: -0.01em;
  }
  .a11y-card table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .a11y-card th,
  .a11y-card td {
    text-align: start;
    padding: 8px 0;
    border-block-end: 1px dashed var(--k-line-1);
  }
  .a11y-card th {
    font-family: var(--k-font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--k-ink-4);
  }
  .a11y-card td:first-child {
    width: 38%;
    color: var(--k-ink-2);
  }
  .a11y-card td:last-child {
    color: var(--k-ink-3);
  }
  .a11y-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: var(--k-ink-3);
    font-size: 13px;
    line-height: 1.6;
  }
  .a11y-card ul li {
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .a11y-card ul li::before {
    content: '— ';
    color: var(--k-shu);
  }
  .a11y-card .more {
    margin-top: 12px;
    display: inline-block;
    font-family: var(--k-font-mono);
    font-size: 12px;
    color: var(--k-shu-ink);
  }
  :global([data-theme='dark']) .a11y-card .more {
    color: var(--k-shu);
  }
  .a11y-card .muted {
    color: var(--k-ink-4);
    font-size: 13px;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
</style>
