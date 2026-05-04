# @kumiki/component-menu

Compound Svelte 5 components (Layer 4) for the Menu (single-level)
component — `Root` + `Trigger` + `Menu` + `Item` + `Separator`. Root
owns the controller and exposes its child as a snippet that receives
`{ items, controller }` so the consumer iterates without prop-drilling.

```svelte
<script lang="ts">
  import { Root, Trigger, Menu, Item, Separator, type MenuItem } from '@kumiki/component-menu';

  const items: MenuItem[] = [
    { id: 'new', label: 'New file' },
    { id: 'open', label: 'Open' },
    { id: 'sep1', label: '', kind: 'separator' },
    { id: 'export', label: 'Export' },
  ];
</script>

<Root {items} onSelect={(it) => console.log('selected', it.id)}>
  {#snippet children({ items })}
    <Trigger>Actions</Trigger>
    <Menu>
      {#each items as item (item.id)}
        {#if item.kind === 'separator'}
          <Separator {item} />
        {:else}
          <Item {item}>{item.label}</Item>
        {/if}
      {/each}
    </Menu>
  {/snippet}
</Root>
```

See [APG Menu / Menubar](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/).
