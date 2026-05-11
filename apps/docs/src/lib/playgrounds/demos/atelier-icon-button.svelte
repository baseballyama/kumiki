<script lang="ts">
  import { Vanilla as IconButton } from '@kumiki/atelier/icon-button';
</script>

<div class="demo">
  <div class="row">
    <IconButton.Root variant="primary" aria-label="Search">
      {#snippet icon()}<span aria-hidden="true">⌕</span>{/snippet}
    </IconButton.Root>
    <IconButton.Root variant="secondary" aria-label="Settings">
      {#snippet icon()}<span aria-hidden="true">⚙</span>{/snippet}
    </IconButton.Root>
    <IconButton.Root variant="ghost" aria-label="More options">
      {#snippet icon()}<span aria-hidden="true">⋯</span>{/snippet}
    </IconButton.Root>
    <IconButton.Root variant="danger" aria-label="Delete">
      {#snippet icon()}<span aria-hidden="true">✕</span>{/snippet}
    </IconButton.Root>
  </div>
  <p class="hint">
    Square icon-only buttons. The accessible name comes from <code>aria-label</code> — the type checker
    enforces it.
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
    flex-wrap: wrap;
    align-items: center;
  }
  .hint {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .hint code {
    color: var(--k-matcha-ink);
  }
</style>
