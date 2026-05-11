<!--
  Pre-highlighted code block with a clipboard copy button.

  `html` is rendered via {@html} and comes from Shiki at build time (see
  scripts/build-highlighted-snippets.mjs). `code` is the raw source that the
  copy button writes to the clipboard.
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
</script>

<article class="code-block">
  {#if title}
    <header>
      <h3>{title}</h3>
      <div class="meta">
        <span class="lang" aria-hidden="true">{lang}</span>
        <button
          type="button"
          class="copy"
          data-state={state}
          aria-label={t.copyAria(title)}
          onclick={copy}
        >
          {buttonLabel}
        </button>
      </div>
    </header>
  {:else}
    <div class="toolbar">
      <span class="lang" aria-hidden="true">{lang}</span>
      <button type="button" class="copy" data-state={state} aria-label={t.copy} onclick={copy}>
        {buttonLabel}
      </button>
    </div>
  {/if}
  <pre dir="ltr"><!-- prettier-ignore --><span class="hl">{@html html}</span></pre>
</article>

<style>
  .code-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  header h3 {
    font-family: var(--k-font-display);
    font-size: 14px;
    font-weight: 500;
    color: var(--k-ink-2);
    letter-spacing: -0.01em;
    margin: 0;
  }
  .meta,
  .toolbar {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .toolbar {
    align-self: flex-end;
  }
  .lang {
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-3);
    border: 1px solid var(--k-line-1);
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--k-surface-1);
  }
  .copy {
    appearance: none;
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-ink-2);
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: 4px;
    padding: 2px 8px;
    cursor: pointer;
    transition:
      background 120ms ease,
      color 120ms ease,
      border-color 120ms ease;
  }
  .copy:hover {
    background: var(--k-surface-2);
    color: var(--k-ink-1);
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

  pre {
    margin: 0;
    background: var(--k-code-bg);
    border: 1px solid var(--k-code-line);
    border-radius: var(--k-radius-sm);
    padding: 14px 16px;
    overflow-x: auto;
    font-family: var(--k-font-mono);
    font-size: 12.5px;
    line-height: 1.55;
  }
  /*
   * Shiki emits a dual-theme inline style on each token:
   *   style="--shiki-light:#xxx;--shiki-dark:#yyy"
   * We pick which one wins via :global(html[data-theme]) selectors so the
   * docs theme toggle and prefers-color-scheme media query both work.
   */
  .hl :global(pre.shiki) {
    background: transparent !important;
    padding: 0;
    margin: 0;
  }
  .hl :global(pre.shiki code) {
    display: block;
  }
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
