<script lang="ts">
  import type { Component } from 'svelte';
  import { LIVE_PLAYGROUNDS } from '$lib/playgrounds/registry.js';
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import DirectionToggle from '$lib/components/DirectionToggle.svelte';
  import PreviewFrame from '$lib/components/PreviewFrame.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  let { data } = $props();
  // svelte-ignore state_referenced_locally
  const {
    entry,
    snippets,
    hasDemo,
    family,
    siblings,
    siblingSnippets,
    activeSnippet,
    machineSpec,
    machineSpecJsonUrl,
    machineSpecVizUrl,
  } = data;

  const t = $derived(dict(ui.locale).components);

  let DemoComponent: Component | undefined = $state(undefined);
  let demoError = $state<string | undefined>(undefined);
  let active = $state<'preview' | 'code' | 'a11y'>('preview');

  $effect(() => {
    if (!hasDemo) return;
    const loader = LIVE_PLAYGROUNDS[entry.slug];
    if (!loader) return;
    loader().then(
      (mod) => {
        DemoComponent = mod.default as Component;
      },
      (err) => {
        demoError = String(err);
      },
    );
  });

  function pretty(name: string): string {
    const last = name.split('/').pop() ?? name;
    return last
      .split('-')
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join('');
  }

  // Order the entire family ascending by layer, with the active entry merged in.
  const familyEntries = $derived(
    [entry, ...siblings].sort((a, b) => a.layer - b.layer || a.slug.localeCompare(b.slug)),
  );

  function snippetForSlug(slug: string) {
    if (slug === entry.slug) return activeSnippet;
    return siblingSnippets[slug] ?? null;
  }

  const showFamily = $derived(siblings.length > 0);

  let activeFamilySlug = $state(entry.slug);
  $effect(() => {
    activeFamilySlug = entry.slug;
  });

  // Keyboard reference. APG-derived where available. Effects are key-only;
  // human descriptions are localised in dict per language.
  const KEYBOARD_MAP: Record<
    string,
    ReadonlyArray<{ keys: string; effect: { en: string; ja: string } }>
  > = {
    'component-toggle': [
      {
        keys: 'Space, Enter',
        effect: { en: 'Toggles pressed state.', ja: 'pressed 状態を切り替え。' },
      },
      { keys: 'Tab', effect: { en: 'Move focus into / out.', ja: 'フォーカスの出入り。' } },
    ],
    'component-switch': [
      {
        keys: 'Space, Enter',
        effect: { en: 'Toggles checked state.', ja: 'checked 状態を切り替え。' },
      },
      { keys: 'Tab', effect: { en: 'Move focus.', ja: 'フォーカス移動。' } },
    ],
    'component-checkbox': [
      {
        keys: 'Space',
        effect: { en: 'Toggles checked / unchecked.', ja: 'checked / unchecked を切り替え。' },
      },
      { keys: 'Tab', effect: { en: 'Move focus.', ja: 'フォーカス移動。' } },
    ],
    'component-radio-group': [
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
    'component-tabs': [
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
    'component-combobox': [
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
    'component-dialog': [
      {
        keys: 'Escape',
        effect: { en: 'Close (when policy allows).', ja: '閉じる(ポリシーが許可している場合)。' },
      },
      {
        keys: 'Tab / Shift+Tab',
        effect: { en: 'Cycle focus within trap.', ja: 'トラップ内でフォーカスを循環。' },
      },
    ],
    'component-tooltip': [
      { keys: 'Focus / Hover', effect: { en: 'Open after delay.', ja: '遅延後に表示。' } },
      {
        keys: 'Escape',
        effect: { en: 'Dismiss when content is hovered.', ja: 'ホバー中なら閉じる。' },
      },
    ],
    'component-popover': [
      { keys: 'Click trigger', effect: { en: 'Toggle.', ja: 'トリガーで切り替え。' } },
      { keys: 'Escape', effect: { en: 'Dismiss (policy-aware).', ja: '閉じる(ポリシー準拠)。' } },
      { keys: 'Tab', effect: { en: 'Focus moves into content.', ja: 'コンテンツへフォーカス。' } },
    ],
    'component-menu': [
      { keys: 'Arrow ↓ / ↑', effect: { en: 'Move active item.', ja: 'アクティブ項目を移動。' } },
      { keys: 'Home / End', effect: { en: 'First / last item.', ja: '最初 / 最後の項目。' } },
      {
        keys: 'Type-ahead',
        effect: { en: 'Jump to item by initial char.', ja: '頭文字で項目へジャンプ。' },
      },
      { keys: 'Enter', effect: { en: 'Activate item.', ja: '項目を有効化。' } },
    ],
    'component-slider': [
      { keys: 'Arrow ←/→ ↑/↓', effect: { en: 'Step value by `step`.', ja: 'step ぶん値を変更。' } },
      {
        keys: 'PageUp / PageDown',
        effect: { en: 'Step by `pageStep`.', ja: 'pageStep ぶん変更。' },
      },
      { keys: 'Home / End', effect: { en: 'Jump to min / max.', ja: '最小 / 最大へジャンプ。' } },
    ],
    'component-number-field': [
      {
        keys: 'Arrow ↑ / ↓',
        effect: { en: 'Increment / decrement by step.', ja: 'step で増減。' },
      },
      {
        keys: 'PageUp / PageDown',
        effect: { en: 'Increment / decrement by pageStep.', ja: 'pageStep で増減。' },
      },
    ],
  };

  const keyboard = $derived(KEYBOARD_MAP[entry.slug] ?? []);
  const localeKey = $derived<'ja' | 'en'>(ui.locale === 'ja' ? 'ja' : 'en');
</script>

<svelte:head>
  <title>{pretty(entry.name)} · {t.title} · Kumiki</title>
  <meta name="description" content={entry.summary} />
</svelte:head>

<div class="layout">
  <nav class="crumb" aria-label="Breadcrumb">
    <a href="/components">{t.backToCatalogue}</a>
  </nav>

  <header class="hero">
    <div class="hero-main">
      <p class="layer-tag">L{entry.layer} · {t.layerLabel(entry.layer)}</p>
      <h1>
        <span class="name">{pretty(entry.name)}</span>
      </h1>
      <code class="pkg" dir="ltr">{entry.name}</code>
      <p class="summary">{entry.summary}</p>

      <ul class="meta">
        <li>
          <StatusBadge status={entry.status} />
        </li>
        {#if entry.apgUrl}
          <li>
            <a class="apg" href={entry.apgUrl} target="_blank" rel="noopener noreferrer">
              {t.apgPattern} ↗
            </a>
          </li>
        {/if}
        <li>
          <a
            class="src"
            href="https://github.com/baseballyama/kumiki/tree/main/packages"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.source} ↗
          </a>
        </li>
      </ul>
    </div>

    <aside class="hero-side">
      <div class="kanji-box" aria-hidden="true">
        {pretty(entry.name).slice(0, 1)}
      </div>
    </aside>
  </header>

  {#if hasDemo}
    <section class="stage">
      <div class="stage-head">
        <div role="tablist" aria-label="View" class="tabs">
          <button
            role="tab"
            aria-selected={active === 'preview'}
            class:on={active === 'preview'}
            onclick={() => (active = 'preview')}
          >
            {t.livePreview}
          </button>
          <button
            role="tab"
            aria-selected={active === 'code'}
            class:on={active === 'code'}
            onclick={() => (active = 'code')}
          >
            {t.code}
          </button>
          <button
            role="tab"
            aria-selected={active === 'a11y'}
            class:on={active === 'a11y'}
            onclick={() => (active = 'a11y')}
          >
            {t.a11y}
          </button>
        </div>
        <div class="stage-tools">
          <DirectionToggle />
        </div>
      </div>

      {#if active === 'preview'}
        <div role="tabpanel" class="panel">
          <PreviewFrame>
            {#if demoError}
              <p class="err">Failed to load demo: <code>{demoError}</code></p>
            {:else if DemoComponent}
              <DemoComponent />
            {:else}
              <p class="loading">Loading…</p>
            {/if}
          </PreviewFrame>

          <div class="panel-meta">
            <p>{t.panelMeta}</p>
          </div>
        </div>
      {:else if active === 'code'}
        <div role="tabpanel" class="panel">
          <div class="snips">
            {#each snippets as s, i (i)}
              <CodeBlock title={s.title} lang={s.lang} code={s.code} html={s.html} />
            {/each}
          </div>
        </div>
      {:else if active === 'a11y'}
        <div role="tabpanel" class="panel">
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
        </div>
      {/if}
    </section>
  {:else}
    <section class="stage placeholder">
      {#if machineSpec}
        <article class="machine-spec">
          <header>
            <h2>{t.machineTitle}</h2>
            <p class="machine-blurb">{machineSpec.blurb}</p>
          </header>
          <dl class="machine-meta">
            <dt>{t.machineSource}</dt>
            <dd><code dir="ltr">{machineSpec.pkg}</code></dd>
            <dt>{t.machineInitial}</dt>
            <dd><code dir="ltr">{machineSpec.initial}</code></dd>
            <dt>{t.machineStates}</dt>
            <dd>
              {#each machineSpec.states as s, i (s)}<code dir="ltr">{s}</code
                >{#if i < machineSpec.states.length - 1},
                {/if}{/each}
            </dd>
          </dl>
          <p class="machine-links">
            <a href={machineSpecJsonUrl} target="_blank" rel="noopener noreferrer">
              {t.machineJson} ↗
            </a>
            <span class="sep" aria-hidden="true">·</span>
            <a href={machineSpecVizUrl} target="_blank" rel="noopener noreferrer">
              {t.machineViz} ↗
            </a>
          </p>
        </article>
      {/if}
      <div class="snips">
        {#each snippets as s, i (i)}
          <CodeBlock title={s.title} lang={s.lang} code={s.code} html={s.html} />
        {/each}
      </div>
    </section>
  {/if}

  {#if showFamily}
    <section class="family">
      <header>
        <p class="kicker" dir="ltr">/ {family}</p>
        <h2>{t.familyTitle}</h2>
        <p class="lede">{t.familyLede}</p>
      </header>

      <div role="tablist" aria-label={t.familyTitle} class="family-tabs">
        {#each familyEntries as item (item.slug)}
          {@const isSelected = item.slug === activeFamilySlug}
          {@const isCurrent = item.slug === entry.slug}
          <button
            role="tab"
            type="button"
            id={`family-tab-${item.slug}`}
            aria-controls={`family-panel-${item.slug}`}
            aria-selected={isSelected}
            tabindex={isSelected ? 0 : -1}
            class="family-tab"
            class:on={isSelected}
            class:current={isCurrent}
            onclick={() => (activeFamilySlug = item.slug)}
          >
            <span class="num">L{item.layer}</span>
            <span class="name">{pretty(item.name)}</span>
            {#if isCurrent}<span class="dot" aria-hidden="true"></span>{/if}
          </button>
        {/each}
      </div>

      {#each familyEntries as item (item.slug)}
        {@const isSelected = item.slug === activeFamilySlug}
        {@const isCurrent = item.slug === entry.slug}
        {@const snip = snippetForSlug(item.slug)}
        <div
          role="tabpanel"
          id={`family-panel-${item.slug}`}
          aria-labelledby={`family-tab-${item.slug}`}
          class="family-panel"
          class:active={isCurrent}
          data-layer={item.layer}
          hidden={!isSelected}
        >
          <div class="family-tag">
            <span class="layer-num">L{item.layer}</span>
            {#if isCurrent}<span class="current">· {t.familyCurrent}</span>{/if}
          </div>
          <div class="family-body">
            <h3>
              {#if isCurrent}
                <span>{pretty(item.name)}</span>
              {:else}
                <a href="/components/{item.slug}">{pretty(item.name)}</a>
              {/if}
            </h3>
            <code class="pkg" dir="ltr">{item.name}</code>
            <p class="summary">{item.summary}</p>
            <p class="when">
              <span class="when-label">{t.familyWhen}:</span>
              {t.layerWhen[item.layer]}
            </p>
            {#if snip}
              <div class="layer-snip">
                <CodeBlock title={snip.title} lang={snip.lang} code={snip.code} html={snip.html} />
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </section>
  {/if}
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

  /* Hero */
  .hero {
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 32px;
    align-items: end;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--k-line-1);
    margin-bottom: 32px;
  }
  .layer-tag {
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--k-shu);
    margin-bottom: 16px;
  }
  h1 {
    font-size: clamp(2rem, 3.8vw, 3.2rem);
    line-height: 1.1;
    letter-spacing: -0.035em;
    margin-bottom: 12px;
    font-variation-settings:
      'opsz' 144,
      'SOFT' 30;
  }
  h1 .name {
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
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--k-ink-2);
    max-width: 60ch;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .meta {
    list-style: none;
    margin-top: 24px;
    display: inline-flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .meta a {
    font-family: var(--k-font-mono);
    font-size: 12px;
    color: var(--k-ink-3);
  }
  .meta a:hover {
    color: var(--k-shu-ink);
  }

  .hero-side {
    display: grid;
    place-items: end;
  }
  .kanji-box {
    width: 160px;
    height: 160px;
    border: 1px solid var(--k-line-1);
    background: var(--k-surface-1);
    display: grid;
    place-items: center;
    font-family: var(--k-font-display);
    font-size: 96px;
    color: var(--k-ink-1);
    border-radius: var(--k-radius-md);
    position: relative;
    font-variation-settings:
      'opsz' 144,
      'SOFT' 30;
    letter-spacing: -0.03em;
  }
  .kanji-box::before,
  .kanji-box::after {
    content: '';
    position: absolute;
    background: var(--k-shu);
  }
  .kanji-box::before {
    width: 8px;
    height: 8px;
    inset-block-start: 12px;
    inset-inline-end: 12px;
    border-radius: 999px;
  }
  .kanji-box::after {
    inset: auto 12px 12px auto;
    width: 32px;
    height: 1px;
  }

  @media (max-width: 720px) {
    .hero {
      grid-template-columns: 1fr;
    }
    .hero-side {
      display: none;
    }
  }

  /* Stage */
  .stage {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    overflow: hidden;
  }
  .stage-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--k-line-1);
    background: var(--k-surface-1);
    flex-wrap: wrap;
  }
  .tabs {
    display: inline-flex;
    gap: 4px;
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    padding: 3px;
  }
  .tabs button {
    background: transparent;
    border: 0;
    padding: 6px 14px;
    color: var(--k-ink-3);
    font-size: 13px;
    cursor: pointer;
    border-radius: var(--k-radius-xs);
    transition:
      background var(--k-dur-fast),
      color var(--k-dur-fast);
  }
  .tabs button:hover {
    color: var(--k-ink-1);
  }
  .tabs button.on {
    background: var(--k-ink-1);
    color: var(--k-surface-0);
  }
  .stage-tools {
    display: inline-flex;
    gap: 8px;
    align-items: center;
  }
  .panel {
    padding: 24px;
  }
  .panel-meta {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13.5px;
    line-height: 1.6;
    border-block-start: 1px dashed var(--k-line-1);
    padding-block-start: 16px;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }

  .placeholder {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .machine-spec {
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 20px 24px;
    background: var(--k-surface-1);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .machine-spec h2 {
    font-family: var(--k-font-display);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--k-ink-3);
    margin: 0;
  }
  .machine-blurb {
    color: var(--k-ink-2);
    font-size: 14px;
    line-height: 1.6;
    margin: 4px 0 0;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .machine-meta {
    display: grid;
    grid-template-columns: minmax(120px, max-content) 1fr;
    gap: 6px 16px;
    font-size: 13px;
    margin: 0;
  }
  .machine-meta dt {
    color: var(--k-ink-3);
  }
  .machine-meta dd {
    color: var(--k-ink-2);
    margin: 0;
  }
  .machine-meta code,
  .machine-spec code {
    font-family: var(--k-font-mono);
    font-size: 12.5px;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-1);
    padding: 1px 6px;
    border-radius: 4px;
  }
  .machine-links {
    font-size: 13px;
    margin: 0;
  }
  .machine-links a {
    color: var(--k-accent);
    text-decoration: none;
  }
  .machine-links a:hover {
    text-decoration: underline;
  }
  .machine-links .sep {
    color: var(--k-ink-4);
    margin: 0 8px;
  }

  /* Snippets — child <CodeBlock> components carry their own styling. */
  .snips {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* A11y panel */
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

  .err,
  .loading {
    color: var(--k-ink-3);
    padding: 24px;
  }

  /* Family / cross-Layer breakdown */
  .family {
    margin-block-start: 48px;
    padding-block-start: 32px;
    border-block-start: 1px solid var(--k-line-1);
  }
  .family > header {
    margin-bottom: 24px;
    max-width: 80ch;
  }
  .family .kicker {
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--k-ink-4);
    margin-bottom: 8px;
  }
  .family h2 {
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
  .family .lede {
    color: var(--k-ink-2);
    font-size: 14px;
    line-height: 1.65;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }

  .family-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 16px;
    border-block-end: 1px solid var(--k-line-1);
    padding-block-end: 0;
  }
  .family-tab {
    position: relative;
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
    background: transparent;
    border: 0;
    border-block-end: 2px solid transparent;
    padding: 10px 14px;
    margin-block-end: -1px;
    color: var(--k-ink-3);
    font-size: 13px;
    cursor: pointer;
    border-radius: 0;
    transition:
      color var(--k-dur-fast),
      border-color var(--k-dur-fast),
      background var(--k-dur-fast);
  }
  .family-tab:hover {
    color: var(--k-ink-1);
    background: var(--k-surface-1);
  }
  .family-tab:focus-visible {
    outline: 2px solid var(--k-shu);
    outline-offset: -2px;
  }
  .family-tab.on {
    color: var(--k-ink-1);
    border-block-end-color: var(--k-shu);
  }
  .family-tab .num {
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-shu);
    letter-spacing: 0.08em;
    font-weight: 500;
  }
  .family-tab .name {
    font-family: var(--k-font-display);
    letter-spacing: -0.01em;
  }
  .family-tab .dot {
    inline-size: 6px;
    block-size: 6px;
    border-radius: 999px;
    background: var(--k-shu);
    align-self: center;
  }
  .family-panel {
    display: grid;
    grid-template-columns: 88px 1fr;
    gap: 16px;
    padding: 16px 18px;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    background: var(--k-surface-0);
  }
  .family-panel.active {
    border-color: color-mix(in oklab, var(--k-shu) 50%, transparent);
    background: color-mix(in oklab, var(--k-shu) 5%, var(--k-surface-0));
  }
  .family-panel[hidden] {
    display: none;
  }
  .family-tag {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
  .family-tag .layer-num {
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-shu);
    letter-spacing: 0.08em;
    font-weight: 500;
  }
  .family-tag .current {
    font-family: var(--k-font-mono);
    font-size: 10px;
    color: var(--k-ink-4);
    letter-spacing: 0.05em;
  }
  .family-body h3 {
    font-family: var(--k-font-display);
    font-size: 16px;
    color: var(--k-ink-1);
    letter-spacing: -0.01em;
    margin-bottom: 4px;
  }
  .family-body h3 a {
    color: inherit;
  }
  .family-body h3 a:hover {
    color: var(--k-shu-ink);
  }
  .family-body .pkg {
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-ink-4);
    background: transparent;
    padding: 0;
    border: 0;
    display: block;
    margin-bottom: 8px;
  }
  .family-body .summary {
    color: var(--k-ink-3);
    font-size: 13.5px;
    line-height: 1.55;
    margin-bottom: 8px;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .family-body .when {
    color: var(--k-ink-2);
    font-size: 13px;
    line-height: 1.6;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .family-body .when .when-label {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    margin-inline-end: 4px;
  }
  .layer-snip {
    margin: 12px 0 0;
  }
  @media (max-width: 540px) {
    .family-panel {
      grid-template-columns: 1fr;
    }
  }
</style>
