<script lang="ts">
  import { ui } from '$lib/i18n/store.svelte.js';
  import KumikiThemeSwitcher from '$lib/components/KumikiThemeSwitcher.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const ja = $derived(ui.locale === 'ja');

  function htmlEscape(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function code(s: string): string {
    return `<pre class="shiki"><code>${htmlEscape(s)}</code></pre>`;
  }

  const installSnippet = `pnpm add @kumiki/atelier`;
  const importDefault = `// app.css\n@import '@kumiki/atelier/themes/shu.css';`;
  const importAll = `// app.css — bundle every theme; flip at runtime\n@import '@kumiki/atelier/themes/all.css';`;
  const switchHtml = `<!-- Static: pick at render time -->\n<html data-kumiki-theme="matcha">`;
  const switchJs = `// Runtime: toggle the attribute\ndocument.documentElement.dataset.kumikiTheme = 'matcha';`;
  const overrideCss = `/* Override a single token at any scope. */\n:root {\n  --kumiki-color-accent: oklch(0.6 0.18 220);\n}\n\n.my-card {\n  --kumiki-color-accent: oklch(0.62 0.13 145);\n}`;

  const tokens = [
    {
      group: ja ? 'アクセント' : 'Accent',
      vars: [
        ['--kumiki-color-accent', ja ? '主たるアクセント色' : 'Primary accent'],
        ['--kumiki-color-accent-hover', ja ? 'ホバー' : 'Hover'],
        ['--kumiki-color-accent-active', ja ? 'プレス時' : 'Pressed / active'],
        ['--kumiki-color-accent-soft', ja ? '柔らかい背景' : 'Soft tinted background'],
        ['--kumiki-color-accent-fg', ja ? 'アクセント上の文字色' : 'Foreground on accent'],
      ],
    },
    {
      group: ja ? '面とインク' : 'Surfaces & ink',
      vars: [
        ['--kumiki-color-bg', ja ? 'ページ背景' : 'Page background'],
        ['--kumiki-color-surface', ja ? 'カード面' : 'Card / surface'],
        ['--kumiki-color-surface-raised', ja ? '浮いた面' : 'Raised surface'],
        ['--kumiki-color-fg', ja ? '本文インク' : 'Primary text'],
        ['--kumiki-color-fg-muted', ja ? '二次インク' : 'Muted text'],
        ['--kumiki-color-fg-quiet', ja ? '三次インク' : 'Quiet text'],
        ['--kumiki-color-line', ja ? '罫線' : 'Lines & borders'],
        ['--kumiki-color-line-strong', ja ? '強い罫線' : 'Strong borders'],
      ],
    },
    {
      group: ja ? 'ステータス' : 'Status',
      vars: [
        ['--kumiki-color-success', ja ? '成功' : 'Success'],
        ['--kumiki-color-warning', ja ? '警告' : 'Warning'],
        ['--kumiki-color-danger', ja ? 'エラー' : 'Danger'],
        ['--kumiki-color-info', ja ? '情報' : 'Info'],
      ],
    },
    {
      group: ja ? '形と動き' : 'Shape & motion',
      vars: [
        ['--kumiki-radius-sm/md/lg', ja ? '角丸 3 段' : 'Corner radii'],
        ['--kumiki-shadow-sm/md/lg', ja ? '影 3 段' : 'Elevation'],
        ['--kumiki-dur-fast/mid/slow', ja ? 'モーションの長さ' : 'Motion durations'],
        ['--kumiki-ease-out', ja ? 'デフォルトイージング' : 'Default easing'],
      ],
    },
  ];
</script>

<svelte:head>
  <title>{ja ? 'テーマ設定' : 'Theming'} · Kumiki</title>
  <meta
    name="description"
    content={ja
      ? 'Kumiki Atelier はセマンティック CSS 変数で構築されたテーマシステムを採用しています。組み込みの 4 プリセット(朱 / 抹茶 / 藍 / 墨)から選ぶか、変数を上書きして独自のテーマを作れます。'
      : 'Kumiki Atelier uses a semantic CSS-variable theme system. Pick one of the four bundled presets (Shu / Matcha / Ai / Sumi) or override variables to ship your own.'}
  />
</svelte:head>

<article class="page">
  <header class="hero">
    <p class="kicker" dir="ltr">/ theming</p>
    <h1>{ja ? 'テーマ設定' : 'Theming'}</h1>
    <p class="lede">
      {ja
        ? 'Kumiki Atelier はセマンティック CSS 変数で組み立てられたテーマシステムを採用しています。同梱の 4 プリセットから選ぶか、変数を上書きしてプロジェクト固有の色彩で書き換えてください。'
        : 'Kumiki Atelier ships a semantic CSS-variable theme system. Pick one of the four bundled presets — or override the variables to brand it yourself.'}
    </p>
  </header>

  <section class="block">
    <header>
      <h2>{ja ? 'プリセットを試す' : 'Try a preset'}</h2>
      <p class="muted">
        {ja
          ? '同梱の 4 プリセット。下のスイッチでこのドキュメント全体に即時反映されます。'
          : 'Four bundled themes. Toggle one below and watch this page (and every Atelier component) flip live.'}
      </p>
    </header>
    <div class="presets">
      <KumikiThemeSwitcher variant="card" />
    </div>
  </section>

  <section class="block">
    <header>
      <h2>{ja ? '導入' : 'Install'}</h2>
    </header>
    <CodeBlock
      title="package install"
      lang="bash"
      code={installSnippet}
      html={code(installSnippet)}
    />
    <p>
      {ja ? '次にスタイルシートを取り込みます。' : 'Then import the stylesheet.'}
    </p>
    <CodeBlock
      title="static — pick one theme"
      lang="ts"
      code={importDefault}
      html={code(importDefault)}
    />
    <p>
      {ja
        ? '実行時にユーザがテーマを切り替えられるようにする場合は、`all.css` を使います。'
        : 'For runtime switching (let your users pick), use the bundled `all.css` instead:'}
    </p>
    <CodeBlock title="runtime switching" lang="ts" code={importAll} html={code(importAll)} />
  </section>

  <section class="block">
    <header>
      <h2>{ja ? '切り替え方' : 'Switching themes'}</h2>
      <p class="muted">
        {ja
          ? 'ルート要素の `data-kumiki-theme` 属性で制御します。`light` / `dark` を制御する `data-theme` とは独立しています。'
          : 'Drive the `data-kumiki-theme` attribute on `<html>`. Independent of the `data-theme` light/dark toggle.'}
      </p>
    </header>
    <CodeBlock title="HTML attribute" lang="svelte" code={switchHtml} html={code(switchHtml)} />
    <CodeBlock title="JavaScript" lang="ts" code={switchJs} html={code(switchJs)} />
  </section>

  <section class="block">
    <header>
      <h2>{ja ? '変数の上書き' : 'Overriding variables'}</h2>
      <p class="muted">
        {ja
          ? '同梱パレットが好みでない場合は CSS 変数を直接書き換えてください。ルートで上書きすれば全体に、特定スコープで上書きすればその範囲のみに適用されます。'
          : 'If none of the presets fit, override the variables directly. Root scope changes everything; nested scope changes one subtree.'}
      </p>
    </header>
    <CodeBlock title="custom theme.css" lang="ts" code={overrideCss} html={code(overrideCss)} />
  </section>

  <section class="block">
    <header>
      <h2>{ja ? '主要トークン' : 'Key tokens'}</h2>
      <p class="muted">
        {ja
          ? '完全な一覧は `@kumiki/atelier/themes/shu.css` を参照してください。'
          : 'See `@kumiki/atelier/themes/shu.css` for the complete list.'}
      </p>
    </header>
    <div class="token-grid">
      {#each tokens as group (group.group)}
        <article class="token-group">
          <h3>{group.group}</h3>
          <dl>
            {#each group.vars as [name, desc] (name)}
              <dt><code dir="ltr">{name}</code></dt>
              <dd>{desc}</dd>
            {/each}
          </dl>
        </article>
      {/each}
    </div>
  </section>

  <section class="block">
    <header>
      <h2>{ja ? 'ダークモードとの関係' : 'Interaction with dark mode'}</h2>
    </header>
    <p>
      {ja
        ? '`data-theme="dark"` は light / dark を、`data-kumiki-theme` はアクセントを制御します。両者は直交し、どの組み合わせでも自動的に整合します。'
        : '`data-theme="dark"` controls light / dark; `data-kumiki-theme` controls the accent palette. The two axes are orthogonal — every combination resolves cleanly.'}
    </p>
  </section>
</article>

<style>
  .page {
    max-width: 880px;
    margin: 0 auto;
    padding: 32px 24px 72px;
  }
  .hero {
    margin-bottom: 36px;
  }
  .kicker {
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: lowercase;
    letter-spacing: 0.16em;
    color: var(--k-shu);
    margin-bottom: 8px;
  }
  h1 {
    font-family: var(--k-font-display);
    font-size: clamp(2rem, 4vw, 2.8rem);
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 14px;
    font-variation-settings:
      'opsz' 144,
      'SOFT' 30;
  }
  .lede {
    color: var(--k-ink-2);
    font-family: var(--k-font-display);
    font-size: 1.05rem;
    line-height: 1.55;
    max-width: 62ch;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }

  .block {
    margin-block-start: 40px;
    padding-block-start: 28px;
    border-block-start: 1px solid var(--k-line-1);
  }
  .block > header {
    margin-bottom: 18px;
  }
  .block h2 {
    font-family: var(--k-font-display);
    font-size: clamp(1.25rem, 2.4vw, 1.6rem);
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
    color: var(--k-ink-1);
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
  }
  .block p {
    color: var(--k-ink-2);
    font-size: 14px;
    line-height: 1.65;
    margin-block-end: 14px;
    max-width: 70ch;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .block p code {
    font-family: var(--k-font-mono);
    font-size: 12.5px;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-1);
    padding: 1px 6px;
    border-radius: 4px;
  }
  .muted {
    color: var(--k-ink-3) !important;
  }

  .presets {
    padding: 8px 0;
  }

  .token-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  }
  .token-group {
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 18px 20px;
  }
  .token-group h3 {
    font-family: var(--k-font-display);
    font-size: 14px;
    margin: 0 0 12px;
    letter-spacing: -0.005em;
    color: var(--k-ink-1);
  }
  .token-group dl {
    margin: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 6px 12px;
    font-size: 13px;
  }
  .token-group dt {
    color: var(--k-ink-1);
  }
  .token-group dt code {
    font-family: var(--k-font-mono);
    font-size: 12px;
    background: transparent;
    padding: 0;
    border: 0;
  }
  .token-group dd {
    color: var(--k-ink-3);
    margin: 0 0 6px;
  }
</style>
