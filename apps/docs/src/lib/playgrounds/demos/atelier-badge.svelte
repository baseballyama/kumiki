<script lang="ts">
  import { Vanilla as Badge } from '@kumiki/atelier/badge';
</script>

<div class="demo">
  <div class="row">
    <Badge.Root variant="neutral">Neutral</Badge.Root>
    <Badge.Root variant="info">Info</Badge.Root>
    <Badge.Root variant="success">Success</Badge.Root>
    <Badge.Root variant="warn">Warn</Badge.Root>
    <Badge.Root variant="error">Error</Badge.Root>
  </div>
  <div class="row">
    <Badge.Root size="sm">sm</Badge.Root>
    <Badge.Root size="md">md</Badge.Root>
    <Badge.Root aria-label="3 unread notifications">3</Badge.Root>
    <Badge.Root decorative />
  </div>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }
</style>
