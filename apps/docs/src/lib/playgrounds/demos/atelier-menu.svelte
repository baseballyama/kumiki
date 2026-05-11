<script lang="ts">
  import { Vanilla as Menu } from '@kumiki/atelier/menu';
  import { Vanilla as Button } from '@kumiki/atelier/button';
  import type { MenuItem } from '@kumiki/components/menu';

  const items: MenuItem[] = [
    { id: 'save', label: 'Save' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'sep', label: '', kind: 'separator' },
    { id: 'delete', label: 'Delete' },
  ];

  let last = $state<string>('—');
</script>

<div class="demo">
  <Menu.Root {items} onSelect={(item) => (last = item.id)}>
    {#snippet children({ items: live, controller: _c })}
      <Menu.Trigger>
        <Button.Root variant="secondary">Actions ▾</Button.Root>
      </Menu.Trigger>
      <Menu.Menu>
        {#each live as item (item.id)}
          {#if item.kind === 'separator'}
            <Menu.Separator {item} />
          {:else}
            <Menu.Item {item}>{item.label}</Menu.Item>
          {/if}
        {/each}
      </Menu.Menu>
    {/snippet}
  </Menu.Root>

  <p class="state">last selection: <code>{last}</code></p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    min-height: 200px;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
    font-family: var(--k-font-mono, monospace);
  }
  .state code {
    color: var(--k-matcha-ink);
  }
</style>
