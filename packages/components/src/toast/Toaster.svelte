<!--
  @component Toaster — root provider that owns the toast queue controller.

  Renders no DOM itself. Exposes its child as a snippet that receives
  `{ toasts, controller }` so the consumer can iterate and call back into
  the controller without prop-drilling.

  ```svelte
  <Toaster>
    {#snippet children({ toasts, controller })}
      <Viewport>
        {#each toasts as toast (toast.id)}
          <Item {toast}>...</Item>
        {/each}
      </Viewport>
      <button onclick={() => controller.add({ title: 'Saved' })}>Notify</button>
    {/snippet}
  </Toaster>
  ```
-->
<script lang="ts">
  import { onDestroy, setContext, untrack } from 'svelte';
  import { createToast, type ToastController, type ToastItem } from '@kumiki/headless/toast';
  import type { Snippet } from 'svelte';
  import { TOASTER_CONTEXT_KEY, type ToasterContextValue } from './context.js';

  type Props = {
    /** Default 5; oldest dropped when full. */
    max?: number;
    /** Default 5000ms. */
    defaultDuration?: number;
    /** Initial toasts — useful for SSR hydration. */
    initial?: ToastItem[];
    onAdd?: (toast: ToastItem) => void;
    onRemove?: (id: string) => void;
    id?: string;
    children: Snippet<[{ toasts: readonly ToastItem[]; controller: ToastController }]>;
  };

  let { max, defaultDuration, initial, onAdd, onRemove, id, children }: Props = $props();

  const controller: ToastController = untrack(() =>
    createToast({ max, defaultDuration, initial, onAdd, onRemove, id }),
  );

  let toasts = $state.raw<readonly ToastItem[]>(controller.toasts);
  const unsub = controller.subscribe(({ context }) => {
    toasts = context.toasts;
  });
  onDestroy(unsub);

  $effect(() => {
    if (max !== undefined) controller.setMax(max);
  });

  setContext<ToasterContextValue>(TOASTER_CONTEXT_KEY, { controller });
</script>

{@render children({ toasts, controller })}
