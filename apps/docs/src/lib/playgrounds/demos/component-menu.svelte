<script lang="ts">
  import { Root, Trigger, Menu, Item, Separator, type MenuItem } from '@kumiki/components/menu';

  const items: MenuItem[] = [
    { id: 'new', label: 'New file' },
    { id: 'open', label: 'Open…' },
    { id: 'sep1', label: '', kind: 'separator' },
    { id: 'save', label: 'Save', disabled: true },
    { id: 'export', label: 'Export' },
    { id: 'quit', label: 'Quit' },
  ];

  let lastSelected = $state<string | null>(null);
</script>

<div class="demo">
  <Root {items} onSelect={(it) => (lastSelected = it.label ?? it.id)}>
    {#snippet children({ items: live })}
      <Trigger class="trigger">Actions ▾</Trigger>
      <Menu class="menu">
        {#each live as item (item.id)}
          {#if item.kind === 'separator'}
            <Separator {item} class="sep" />
          {:else}
            <Item {item} class="item">{item.label}</Item>
          {/if}
        {/each}
      </Menu>
    {/snippet}
  </Root>

  <p class="state">last selected: <code>{lastSelected ?? 'none'}</code></p>
</div>

<style>
  .demo {
    background: #16162a;
    border: 1px solid #2a2a4a;
    border-radius: 12px;
    padding: 24px;
    position: relative;
  }
  .demo :global(.trigger) {
    background: #2a2a4a;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
  }
  .demo :global(.trigger:focus) {
    outline: 2px solid #4fc08d;
    outline-offset: 2px;
  }
  .demo :global([role='menu'][data-state='closed']) {
    display: none;
  }
  .demo :global(.menu) {
    background: #0e0e1c;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    padding: 4px;
    margin-top: 4px;
    min-width: 180px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
  .demo :global(.item) {
    padding: 6px 12px;
    color: #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    user-select: none;
  }
  .demo :global(.item[data-highlighted]) {
    background: #2a2a4a;
  }
  .demo :global(.item[aria-disabled='true']) {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .demo :global(.sep) {
    height: 1px;
    background: #3a3a5a;
    margin: 4px 0;
  }
  .state {
    margin-top: 16px;
    color: #888;
    font-size: 13px;
  }
  .state code {
    color: #4fc08d;
  }
</style>
