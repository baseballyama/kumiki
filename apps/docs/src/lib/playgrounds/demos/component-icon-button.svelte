<!--
  Layer 4 IconButton demo — type-enforced accessible name + required `icon` snippet.

  L4 ships only behavior + ARIA: `loading` / `disabled`, `type`, and a typed
  guarantee that `aria-label` (or `aria-labelledby`) is present alongside the
  required `icon` snippet. Visual styling is intentionally NOT here — see
  `@kumiki/atelier/icon-button` for the styled L5 variant.
-->
<script lang="ts">
  import { IconButton } from '@kumiki/components';

  let last = $state<string>('—');
</script>

<div class="demo">
  <div class="row">
    <IconButton.Root class="raw" aria-label="Search" onclick={() => (last = 'search')}>
      {#snippet icon()}<span aria-hidden="true">⌕</span>{/snippet}
    </IconButton.Root>
    <IconButton.Root class="raw" aria-label="Settings" onclick={() => (last = 'settings')}>
      {#snippet icon()}<span aria-hidden="true">⚙</span>{/snippet}
    </IconButton.Root>
    <IconButton.Root class="raw" aria-label="More options" onclick={() => (last = 'more')}>
      {#snippet icon()}<span aria-hidden="true">⋯</span>{/snippet}
    </IconButton.Root>
    <IconButton.Root class="raw" aria-label="Delete" onclick={() => (last = 'delete')}>
      {#snippet icon()}<span aria-hidden="true">✕</span>{/snippet}
    </IconButton.Root>
  </div>

  <p class="state">last action = <code>{last}</code></p>
  <p class="hint">
    Layer 4 emits <strong>no styling</strong> — only <code>aria-label</code>,
    <code>aria-busy</code>, <code>aria-disabled</code> wiring, and the required
    <code>icon</code>
    snippet. The square outline is one line of consumer CSS in this demo's
    <code>&lt;style&gt;</code> block.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 360px;
    min-height: 220px;
    box-sizing: border-box;
  }
  .row {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
  .demo :global(.raw) {
    inline-size: 36px;
    block-size: 36px;
    display: inline-grid;
    place-items: center;
    border: 1px solid var(--k-line-2);
    border-radius: var(--k-radius-sm);
    background: var(--k-surface-1);
    color: var(--k-ink-1);
    cursor: pointer;
    font: inherit;
    font-size: 14px;
  }
  .demo :global(.raw:hover) {
    border-color: var(--k-line-3);
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 12px;
    font-family: var(--k-font-mono);
  }
  .state code {
    color: var(--k-matcha-ink);
  }
  .hint {
    margin-top: 12px;
    color: var(--k-ink-3);
    font-size: 13px;
    line-height: 1.55;
  }
  .hint code {
    font-family: var(--k-font-mono);
    color: var(--k-matcha-ink);
  }
</style>
