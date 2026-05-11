<script lang="ts">
  import { Vanilla as Dialog } from '@kumiki/atelier/dialog';
  import { Vanilla as Button } from '@kumiki/atelier/button';
</script>

<div class="demo">
  <Dialog.Root>
    <Dialog.Trigger>
      <Button.Root variant="primary">Edit profile</Button.Root>
    </Dialog.Trigger>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description
        >Update your account details. Changes save when you close this dialog.</Dialog.Description
      >
      <form class="form" onsubmit={(e) => e.preventDefault()}>
        <label>
          Name <input type="text" value="Kumiki" />
        </label>
        <label>
          Email <input type="email" value="hi@kumiki.dev" />
        </label>
      </form>
      <div class="actions">
        <Dialog.Close>
          <Button.Root variant="ghost">Cancel</Button.Root>
        </Dialog.Close>
        <Dialog.Close>
          <Button.Root variant="primary">Save</Button.Root>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  </Dialog.Root>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 16px 0;
  }
  .form label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: var(--k-ink-2);
  }
  .form input {
    padding: 8px 10px;
    border: 1px solid hsl(220 10% 80%);
    border-radius: 6px;
    font: inherit;
  }
  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
</style>
