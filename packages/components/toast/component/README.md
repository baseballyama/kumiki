# @kumiki/component-toast

Compound Svelte 5 components (Layer 4) for the Toast (toaster queue)
component — `Toaster` + `Viewport` + `Item` + `Title` + `Description` +
`Close`.

```svelte
<script lang="ts">
  import {
    Toaster,
    Viewport,
    Item,
    Title,
    Description,
    Close,
  } from '@kumiki/component-toast';
</script>

<Toaster>
  {#snippet children({ toasts, controller })}
    <Viewport>
      {#each toasts as toast (toast.id)}
        <Item {toast}>
          <Title>{toast.title}</Title>
          {#if toast.description}<Description>{toast.description}</Description>{/if}
          <Close>×</Close>
        </Item>
      {/each}
    </Viewport>

    <button onclick={() => controller.add({ title: 'Saved' })}>Notify</button>
  {/snippet}
</Toaster>
```

See the [WAI-ARIA Live Region pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#live).
