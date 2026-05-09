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
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 24px;
    position: relative;
  }
  .demo :global(.trigger) {
    background: var(--k-line-1);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
  }
  .demo :global(.trigger:focus) {
    outline: 2px solid var(--k-matcha);
    outline-offset: 2px;
  }
  .demo :global([role='menu'][data-state='closed']) {
    display: none;
  }
  .demo :global(.menu) {
    background: var(--k-code-bg);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 4px;
    margin-top: 4px;
    min-width: 180px;
    box-shadow: 0 8px 24px oklch(0 0 0 / 0.3);
  }
  .demo :global(.item) {
    padding: 6px 12px;
    color: var(--k-ink-1);
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    user-select: none;
  }
  .demo :global(.item[data-highlighted]) {
    background: var(--k-line-1);
  }
  .demo :global(.item[aria-disabled='true']) {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .demo :global(.sep) {
    height: 1px;
    background: var(--k-line-2);
    margin: 4px 0;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .state code {
    color: var(--k-matcha);
  }
</style>
