<script lang="ts">
  import { Vanilla as Popover } from '@kumiki/atelier/popover';
  import { Vanilla as Button } from '@kumiki/atelier/button';
</script>

<div class="demo">
  <Popover.Root>
    <Popover.Trigger>
      <Button.Root variant="secondary">Notifications</Button.Root>
    </Popover.Trigger>
    <Popover.Content>
      <Popover.Title>Inbox</Popover.Title>
      <Popover.Description>
        You have 3 unread items in your inbox. Open the inbox page for full details.
      </Popover.Description>
      <div class="actions">
        <Popover.Close>
          <Button.Root variant="ghost" size="sm">Dismiss</Button.Root>
        </Popover.Close>
      </div>
    </Popover.Content>
  </Popover.Root>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 400px;
    min-height: 320px;
    box-sizing: border-box;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
</style>
