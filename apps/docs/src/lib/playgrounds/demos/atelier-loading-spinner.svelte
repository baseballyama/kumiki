<script lang="ts">
  import { Vanilla as Spinner } from '@kumiki/atelier/loading-spinner';
</script>

<div class="demo">
  <div class="row">
    <Spinner.Root mode="inline" size="sm">Saving…</Spinner.Root>
    <Spinner.Root mode="inline" size="md">Loading…</Spinner.Root>
    <Spinner.Root mode="inline" size="lg">Working…</Spinner.Root>
  </div>
  <p class="hint">
    The spinning glyph respects <code>prefers-reduced-motion</code>. <code>mode="region"</code>
    wraps the indicator in a polite live region for screen readers.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .row {
    display: flex;
    gap: 24px;
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
