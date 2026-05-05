<!--
  Toast sandbox — fixture for Playwright + axe.

  Query params:
    ?dir=rtl         wrap in dir="rtl"
    ?max=N           override max (default 5)
    ?duration=N      override defaultDuration ms (default 5000)
-->
<script lang="ts">
  import { Toaster, Viewport, Item, Title, Description, Close } from '@kumiki/components/toast';
  import { page } from '$app/state';

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const max = $derived(parseInt(page.url.searchParams.get('max') ?? '5', 10));
  const duration = $derived(parseInt(page.url.searchParams.get('duration') ?? '5000', 10));

  let counter = 0;
</script>

<svelte:head>
  <title>Toast sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-testid="sandbox">
  <h1>Toast sandbox</h1>

  <div data-testid="toast-host">
    <Toaster {max} defaultDuration={duration}>
      {#snippet children({ toasts, controller })}
        <div class="controls">
          <button
            data-testid="add-info"
            type="button"
            onclick={() =>
              controller.add({
                id: `t-${++counter}`,
                title: `Info ${counter}`,
                description: 'Some helpful info',
                type: 'info',
              })}>Add info</button
          >
          <button
            data-testid="add-error"
            type="button"
            onclick={() =>
              controller.add({
                id: `e-${++counter}`,
                title: `Error ${counter}`,
                description: 'Something failed',
                type: 'error',
                politeness: 'assertive',
              })}>Add error</button
          >
          <button
            data-testid="add-sticky"
            type="button"
            onclick={() =>
              controller.add({
                id: `sticky-${++counter}`,
                title: `Sticky ${counter}`,
                description: 'Stays until dismissed',
                duration: -1,
              })}>Add sticky</button
          >
          <button data-testid="clear" type="button" onclick={() => controller.clear()}>Clear</button
          >
        </div>

        <Viewport data-testid="viewport" class="viewport">
          {#each toasts as toast (toast.id)}
            <Item {toast} class="toast" data-testid="toast" data-toast-id={toast.id}>
              <Title data-testid="toast-title">{toast.title}</Title>
              {#if toast.description}<Description data-testid="toast-description"
                  >{toast.description}</Description
                >{/if}
              <Close data-testid="toast-close" aria-label="Dismiss">×</Close>
            </Item>
          {/each}
        </Viewport>

        <p data-testid="state">
          count: <strong data-testid="count">{toasts.length}</strong>
          · dir: <strong data-testid="dir">{dir}</strong>
          · max: <strong data-testid="max">{max}</strong>
          · duration: <strong data-testid="duration">{duration}</strong>
        </p>
      {/snippet}
    </Toaster>
  </div>
</div>

<style>
  .controls {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
  .controls button {
    background: #1a1a30;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;
  }
  :global(.viewport) {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 8px;
    max-width: 400px;
  }
  :global(.toast) {
    background: #16162a;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    padding: 12px;
    color: #e0e0e0;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 4px 8px;
  }
  :global(.toast[data-type='error']) {
    border-color: #ff3e00;
  }
  :global(.toast [data-component-part='close']) {
    grid-row: 1 / span 2;
    grid-column: 2;
    align-self: start;
    background: transparent;
    color: #888;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 0 4px;
  }
  :global(.toast [data-component-part='title']) {
    font-weight: 600;
    font-size: 14px;
  }
  :global(.toast [data-component-part='description']) {
    font-size: 12px;
    color: #aaa;
  }
</style>
