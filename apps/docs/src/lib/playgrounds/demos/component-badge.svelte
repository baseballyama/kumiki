<script lang="ts">
  import { Badge, type BadgeVariant, type BadgeSize } from '@kumiki/components/badge';

  let variant = $state<BadgeVariant>('neutral');
  let size = $state<BadgeSize>('md');
</script>

<div class="demo">
  <div class="controls">
    <label class="control">
      Variant
      <select bind:value={variant}>
        <option value="neutral">neutral</option>
        <option value="info">info</option>
        <option value="success">success</option>
        <option value="warn">warn</option>
        <option value="error">error</option>
      </select>
    </label>
    <label class="control">
      Size
      <select bind:value={size}>
        <option value="sm">sm</option>
        <option value="md">md</option>
      </select>
    </label>
  </div>

  <div class="row">
    <Badge.Root {variant} {size}>New</Badge.Root>
    <Badge.Root {variant} {size} aria-label="3 unread notifications">3</Badge.Root>
    <Badge.Root decorative {variant} />
  </div>

  <p class="hint">
    Three accessible-name shapes: text content, count + <code>aria-label</code>, decorative.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .controls {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }
  .control {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .control select {
    background: var(--k-code-bg);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 4px 8px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .row :global(span) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    padding: 2px 10px;
    border-radius: 12px;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    font-size: 12px;
    font-weight: 600;
  }
  .row :global(span[data-size='sm']) {
    font-size: 10px;
    padding: 1px 8px;
  }
  .row :global(span[data-variant='info']) {
    background: #1e3a8a;
    color: #dbeafe;
  }
  .row :global(span[data-variant='success']) {
    background: #166534;
    color: #dcfce7;
  }
  .row :global(span[data-variant='warn']) {
    background: #b8860b;
    color: #fef3c7;
  }
  .row :global(span[data-variant='error']) {
    background: #b91c1c;
    color: #fee2e2;
  }
  .row :global(span[data-decorative]) {
    width: 10px;
    min-width: 10px;
    height: 10px;
    padding: 0;
    border-radius: 50%;
  }
  .hint {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .hint code {
    color: var(--k-matcha);
  }
</style>
