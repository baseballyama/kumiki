<!--
  Render an inline-or-multi-paragraph Markdown string from the parsed
  TypeDoc data. Output is sanitised in `lib/api/render.ts`; we never
  splice raw Markdown into the DOM.
-->
<script lang="ts">
  import { renderInline, renderProse, renderSignature } from '$lib/api/render.js';

  let {
    text,
    mode = 'prose',
    class: cls = '',
  }: {
    text: string | undefined;
    /** `inline` renders one line, `prose` splits on blank lines, `signature` styles as a code line. */
    mode?: 'inline' | 'prose' | 'signature';
    class?: string;
  } = $props();

  const html = $derived(
    !text
      ? ''
      : mode === 'inline'
        ? renderInline(text)
        : mode === 'signature'
          ? renderSignature(text)
          : renderProse(text),
  );
</script>

{#if html}
  {#if mode === 'signature'}
    <code class="sig {cls}">{@html html}</code>
  {:else if mode === 'inline'}
    <span class="inline {cls}">{@html html}</span>
  {:else}
    <div class="prose-block {cls}">{@html html}</div>
  {/if}
{/if}

<style>
  .prose-block :global(p) {
    margin: 0;
    color: var(--k-ink-2);
    font-size: var(--k-text-base);
    line-height: 1.65;
  }
  .prose-block :global(p + p) {
    margin-top: var(--k-space-3);
  }
  .prose-block :global(code),
  .inline :global(code) {
    font-family: var(--k-font-mono);
    font-size: 0.92em;
    background: var(--k-code-bg);
    border: 1px solid var(--k-code-line);
    border-radius: 3px;
    padding: 0 0.35em;
    color: var(--k-code-ink);
  }
  .prose-block :global(a),
  .inline :global(a) {
    color: var(--k-shu-ink);
    text-decoration: underline;
    text-decoration-color: color-mix(in oklab, var(--k-shu-ink) 35%, transparent);
    text-underline-offset: 2px;
  }
  :global([data-theme='dark']) .prose-block :global(a),
  :global([data-theme='dark']) .inline :global(a) {
    color: var(--k-shu);
    text-decoration-color: color-mix(in oklab, var(--k-shu) 45%, transparent);
  }
  .prose-block :global(a:hover),
  .inline :global(a:hover) {
    text-decoration-color: currentColor;
  }
  .prose-block :global(strong),
  .inline :global(strong) {
    color: var(--k-ink-1);
    font-weight: 600;
  }

  /* Signature renderer — used for `> readonly **type**: \`string\`` lines. */
  .sig {
    display: block;
    font-family: var(--k-font-mono);
    font-size: 13px;
    line-height: 1.65;
    color: var(--k-code-ink);
    background: var(--k-code-bg);
    border: 1px solid var(--k-code-line);
    border-radius: var(--k-radius-sm);
    padding: 12px 14px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .sig :global(.t-name) {
    color: var(--k-ink-1);
    font-weight: 600;
  }
  .sig :global(.t-token) {
    color: var(--k-shu-ink);
  }
  :global([data-theme='dark']) .sig :global(.t-token) {
    color: var(--k-shu);
  }
  .sig :global(.t-keyword) {
    color: var(--k-ai);
    font-style: normal;
  }
  .sig :global(.t-link) {
    color: var(--k-ai);
    text-decoration: underline;
    text-decoration-color: color-mix(in oklab, var(--k-ai) 40%, transparent);
    text-underline-offset: 2px;
  }
  :global([data-theme='dark']) .sig :global(.t-link) {
    color: var(--k-ai);
  }
  .sig :global(.t-link:hover) {
    text-decoration-color: currentColor;
  }
</style>
