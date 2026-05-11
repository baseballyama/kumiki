<!--
  Pre-highlighted code block with a clipboard copy button, line numbers,
  and a filename-style header. `html` is rendered via {@html} and comes
  from Shiki at build time (see scripts/build-highlighted-snippets.mjs).
  `code` is the raw source that the copy button writes to the clipboard.
-->
<script lang="ts">
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';

  type Props = {
    title?: string;
    lang: string;
    code: string;
    html: string;
  };
  let { title, lang, code, html }: Props = $props();

  const t = $derived(dict(ui.locale).codeBlock);

  let state = $state<'idle' | 'copied' | 'error'>('idle');
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      state = 'copied';
    } catch {
      state = 'error';
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      state = 'idle';
    }, 1500);
  }

  const buttonLabel = $derived(
    state === 'copied' ? t.copied : state === 'error' ? t.copyError : t.copy,
  );

  const lineCount = $derived(code.split('\n').length);
  const lineNumbers = $derived(Array.from({ length: lineCount }, (_, i) => i + 1));
</script>

<figure class="code-block" data-lang={lang}>
  <header class="head">
    <div class="head-left">
      <span class="dots" aria-hidden="true">
        <span></span><span></span><span></span>
      </span>
      <span class="filename">
        {title ?? `snippet.${lang}`}
      </span>
    </div>
    <div class="head-right">
      <button
        type="button"
        class="copy"
        data-state={state}
        aria-label={title ? t.copyAria(title) : t.copy}
        onclick={copy}
      >
        <svg viewBox="0 0 14 14" width="11" height="11" aria-hidden="true" fill="none">
          {#if state === 'copied'}
            <path
              d="M3 7.5 l2.5 2.5 L11 4"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          {:else}
            <rect
              x="3.5"
              y="3.5"
              width="7"
              height="7"
              rx="1.4"
              stroke="currentColor"
              stroke-width="1.2"
            />
            <path
              d="M5.5 1.5 h5 a1.5 1.5 0 0 1 1.5 1.5 v5"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              fill="none"
            />
          {/if}
        </svg>
        <span>{buttonLabel}</span>
      </button>
    </div>
  </header>

  <div class="body" dir="ltr">
    <ol class="gutter" aria-hidden="true">
      {#each lineNumbers as n (n)}
        <li>{n}</li>
      {/each}
    </ol>
    <div class="hl">
      <!-- prettier-ignore --><!-- eslint-disable-next-line svelte/no-at-html-tags -->{@html html}
    </div>
  </div>
</figure>

<style>
  .code-block {
    margin: 0;
    background: var(--k-code-bg);
    border: 1px solid var(--k-code-line);
    border-radius: var(--k-radius-md);
    overflow: hidden;
    box-shadow:
      0 0 0 1px color-mix(in oklab, var(--k-ink-1) 0%, transparent),
      0 1px 2px color-mix(in oklab, var(--k-ink-1) 6%, transparent);
  }

  /* Header — terminal-window-meets-filename */
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    background: var(--k-surface-1);
    border-block-end: 1px solid var(--k-code-line);
  }
  .head-left {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .dots {
    display: inline-flex;
    gap: 4px;
    flex-shrink: 0;
  }
  .dots span {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: var(--k-line-3);
    opacity: 0.6;
  }
  .dots span:first-child {
    background: var(--k-shu);
    opacity: 0.8;
  }
  .filename {
    font-family: var(--k-font-mono);
    font-size: 12px;
    color: var(--k-ink-2);
    letter-spacing: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .head-right {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .copy {
    appearance: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-ink-2);
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: 4px;
    padding: 3px 8px;
    cursor: pointer;
    transition:
      background 120ms ease,
      color 120ms ease,
      border-color 120ms ease;
  }
  .copy:hover {
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    border-color: var(--k-line-2);
  }
  .copy:focus-visible {
    outline: 2px solid var(--k-focus);
    outline-offset: 2px;
  }
  .copy[data-state='copied'] {
    background: var(--k-matcha-soft);
    color: var(--k-matcha-ink);
    border-color: color-mix(in oklab, var(--k-matcha-ink) 30%, transparent);
  }
  .copy[data-state='error'] {
    background: var(--k-shu-soft);
    color: var(--k-shu-ink);
    border-color: color-mix(in oklab, var(--k-shu-ink) 30%, transparent);
  }

  /* Body */
  .body {
    display: flex;
    align-items: stretch;
    overflow-x: auto;
    font-family: var(--k-font-mono);
    font-size: 13px;
    line-height: 1.6;
  }
  .gutter {
    list-style: none;
    padding: 14px 10px 14px 14px;
    margin: 0;
    text-align: end;
    border-inline-end: 1px solid color-mix(in oklab, var(--k-code-line) 60%, transparent);
    color: color-mix(in oklab, var(--k-ink-3) 55%, transparent);
    font-size: 11.5px;
    user-select: none;
    background: color-mix(in oklab, var(--k-code-bg) 96%, var(--k-ink-1));
    min-width: 36px;
    flex-shrink: 0;
  }
  .gutter li {
    line-height: 1.6;
    font-feature-settings: 'tnum';
  }
  .hl {
    flex: 1 1 auto;
    padding: 14px 16px;
    min-width: 0;
  }
  /* Shiki output overrides */
  .hl :global(pre.shiki) {
    background: transparent !important;
    padding: 0;
    margin: 0;
    border: 0;
    border-radius: 0;
  }
  .hl :global(pre.shiki code) {
    display: block;
    white-space: pre;
  }
  /* Pick theme by data-theme; honour prefers-color-scheme as a fallback. */
  .hl :global(.shiki),
  .hl :global(.shiki span) {
    color: var(--shiki-light);
  }
  :global(html[data-theme='dark']) .hl :global(.shiki),
  :global(html[data-theme='dark']) .hl :global(.shiki span) {
    color: var(--shiki-dark);
  }
  @media (prefers-color-scheme: dark) {
    :global(html:not([data-theme='light'])) .hl :global(.shiki),
    :global(html:not([data-theme='light'])) .hl :global(.shiki span) {
      color: var(--shiki-dark);
    }
  }
</style>
