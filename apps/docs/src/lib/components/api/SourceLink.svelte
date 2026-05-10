<!--
  "Defined in" link — small mono label with a notch arrow. Discreet by
  default; gains a vermillion accent on hover.
-->
<script lang="ts">
  import type { ApiSource } from '$lib/api/types.js';

  let { source }: { source: ApiSource } = $props();

  const tail = $derived(source.file.split('/').slice(-2).join('/'));
</script>

<a class="src" href={source.url} target="_blank" rel="noopener noreferrer">
  <span class="path">{tail}</span>
  <span class="sep">·</span>
  <span class="line">L{source.line}</span>
  <svg class="arrow" width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
    <path d="M2 7L7 2M3 2h4v4" stroke="currentColor" stroke-width="1.2" fill="none" />
  </svg>
</a>

<style>
  .src {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--k-font-mono);
    font-size: 10.5px;
    color: var(--k-ink-4);
    text-decoration: none;
    line-height: 1;
    transition: color var(--k-dur-fast);
  }
  .src:hover {
    color: var(--k-shu-ink);
  }
  :global([data-theme='dark']) .src:hover {
    color: var(--k-shu);
  }
  .path {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 32ch;
  }
  .sep {
    opacity: 0.5;
  }
  .arrow {
    color: currentColor;
    flex-shrink: 0;
  }
</style>
