<script lang="ts">
  import { Vanilla as Button } from '@kumiki/atelier/button';

  let busy = $state(false);
</script>

<div class="demo">
  <div class="row">
    <Button.Root variant="primary" loading={busy} onclick={() => (busy = !busy)}>Save</Button.Root>
    <Button.Root variant="secondary">Cancel</Button.Root>
    <Button.Root variant="ghost">Ghost</Button.Root>
    <Button.Root variant="danger">Delete</Button.Root>
  </div>
  <div class="row">
    <Button.Root size="sm">Small</Button.Root>
    <Button.Root size="md">Medium</Button.Root>
    <Button.Root size="lg">Large</Button.Root>
    <Button.Root disabled>Disabled</Button.Root>
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
    width: 360px;
    min-height: 240px;
    box-sizing: border-box;
  }
  .row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }
</style>
