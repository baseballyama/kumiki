<script lang="ts">
  import { Vanilla as Tooltip } from '@kumiki/atelier/tooltip';
  import { Vanilla as Button } from '@kumiki/atelier/button';
</script>

<div class="demo">
  <div class="row">
    <Tooltip.Root openDelay={400}>
      <Tooltip.Trigger>
        <Button.Root variant="ghost">Save</Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>Saves the document (⌘S)</Tooltip.Content>
    </Tooltip.Root>

    <Tooltip.Root openDelay={400}>
      <Tooltip.Trigger>
        <Button.Root variant="ghost">Profile</Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>View account preferences</Tooltip.Content>
    </Tooltip.Root>
  </div>
  <p class="hint">
    Hover or focus a button. Open after a 400 ms delay (configurable). Respects
    <code>prefers-reduced-motion</code>.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 400px;
    min-height: 260px;
    box-sizing: border-box;
  }
  .row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
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
