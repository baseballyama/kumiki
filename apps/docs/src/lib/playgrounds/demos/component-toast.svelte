<script lang="ts">
  import { Toaster, Viewport, Item, Title, Description, Close } from '@kumiki/components/toast';

  let counter = 0;
</script>

<div class="demo">
  <Toaster defaultDuration={4000}>
    {#snippet children({ toasts, controller })}
      <div class="actions">
        <button
          type="button"
          class="btn"
          onclick={() =>
            controller.add({
              id: `s-${++counter}`,
              title: 'Saved',
              description: 'Your changes were saved.',
              type: 'success',
            })}>Saved</button
        >
        <button
          type="button"
          class="btn btn-error"
          onclick={() =>
            controller.add({
              id: `e-${++counter}`,
              title: 'Failed',
              description: 'Something went wrong.',
              type: 'error',
              politeness: 'assertive',
            })}>Trigger error</button
        >
      </div>

      <Viewport class="viewport">
        {#each toasts as toast (toast.id)}
          <Item {toast} class="toast" data-type={toast.type ?? 'info'}>
            <Title class="t-title">{toast.title}</Title>
            {#if toast.description}<Description class="t-desc">{toast.description}</Description
              >{/if}
            <Close class="t-close" aria-label="Dismiss">×</Close>
          </Item>
        {/each}
      </Viewport>
    {/snippet}
  </Toaster>
</div>

<style>
  .demo {
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 24px;
    min-height: 200px;
  }
  .actions {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
  .btn {
    background: var(--k-matcha);
    color: var(--k-code-bg);
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
  }
  .btn-error {
    background: var(--k-shu);
    color: #fff;
  }
  .demo :global(.viewport) {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 8px;
    max-width: 360px;
  }
  .demo :global(.toast) {
    background: var(--k-code-bg);
    border: 1px solid var(--k-line-2);
    border-radius: 8px;
    padding: 12px 14px;
    color: var(--k-ink-1);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 4px 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  .demo :global(.toast[data-type='success']) {
    border-left: 3px solid var(--k-matcha);
  }
  .demo :global(.toast[data-type='error']) {
    border-left: 3px solid var(--k-shu);
  }
  .demo :global(.t-title) {
    font-weight: 600;
    font-size: 14px;
  }
  .demo :global(.t-desc) {
    font-size: 12px;
    color: var(--k-ink-2);
  }
  .demo :global(.t-close) {
    grid-row: 1 / span 2;
    grid-column: 2;
    background: transparent;
    color: var(--k-ink-3);
    border: none;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    padding: 0 4px;
  }
  .demo :global(.t-close:hover) {
    color: var(--k-ink-1);
  }
</style>
