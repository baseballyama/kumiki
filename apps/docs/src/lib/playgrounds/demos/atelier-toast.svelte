<script lang="ts">
  import { Vanilla as Toast } from '@kumiki/atelier/toast';
  import { Vanilla as Button } from '@kumiki/atelier/button';

  let counter = 0;
</script>

<div class="demo">
  <Toast.Toaster defaultDuration={4000}>
    {#snippet children({ toasts, controller })}
      <div class="actions">
        <Button.Root
          variant="primary"
          onclick={() =>
            controller.add({
              id: `s-${++counter}`,
              title: 'Saved',
              description: 'Your changes were saved.',
              type: 'success',
            })}
        >
          Show success
        </Button.Root>
        <Button.Root
          variant="danger"
          onclick={() =>
            controller.add({
              id: `e-${++counter}`,
              title: 'Failed',
              description: 'Something went wrong.',
              type: 'error',
              politeness: 'assertive',
            })}
        >
          Show error
        </Button.Root>
      </div>

      <Toast.Viewport>
        {#each toasts as toast (toast.id)}
          <Toast.Item {toast}>
            <Toast.Title>{toast.title}</Toast.Title>
            {#if toast.description}<Toast.Description>{toast.description}</Toast.Description>{/if}
            <Toast.Close aria-label="Dismiss" />
          </Toast.Item>
        {/each}
      </Toast.Viewport>
    {/snippet}
  </Toast.Toaster>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 420px;
    min-height: 380px;
    box-sizing: border-box;
  }
  .actions {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
</style>
