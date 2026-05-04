<!--
  Menu sandbox — fixture for Playwright + axe.

  Query params:
    ?dir=rtl     wrap in dir="rtl"
    ?initial=open    start open
-->
<script lang="ts">
  import { Root, Trigger, Menu, Item, Separator, type MenuItem } from '@kumiki/component-menu';
  import { page } from '$app/state';

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const initialOpen = $derived(page.url.searchParams.get('initial') === 'open');

  const items: MenuItem[] = [
    { id: 'new', label: 'New file' },
    { id: 'open', label: 'Open…' },
    { id: 'sep1', label: '', kind: 'separator' },
    { id: 'save', label: 'Save', disabled: true },
    { id: 'export', label: 'Export' },
    { id: 'quit', label: 'Quit' },
  ];

  let log = $state<string[]>([]);
  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Menu sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-testid="sandbox">
  <h1>Menu sandbox</h1>

  <div data-testid="menu-host">
    <Root
      {items}
      defaultOpen={initialOpen}
      onSelect={(it) => append(`onSelect(${it.id})`)}
      onOpenChange={(o) => append(`onOpenChange(${o})`)}
    >
      {#snippet children({ items: live })}
        <Trigger data-testid="trigger">Actions</Trigger>
        <Menu data-testid="menu" class="menu">
          {#each live as item (item.id)}
            {#if item.kind === 'separator'}
              <Separator {item} class="sep" data-testid="sep-{item.id}" />
            {:else}
              <Item {item} class="item" data-testid="item-{item.id}">
                {item.label}
              </Item>
            {/if}
          {/each}
        </Menu>
      {/snippet}
    </Root>
  </div>

  <button data-testid="outside-button" type="button">Outside button</button>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>

<style>
  :global(.menu) {
    background: #16162a;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    padding: 4px;
    margin-top: 4px;
    min-width: 180px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
  :global([role='menu'][data-state='closed']) {
    display: none;
  }
  :global(.item) {
    padding: 6px 12px;
    color: #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
  }
  :global(.item[data-highlighted]) {
    background: #2a2a4a;
  }
  :global(.item[aria-disabled='true']) {
    opacity: 0.5;
    cursor: not-allowed;
  }
  :global(.sep) {
    height: 1px;
    background: #3a3a5a;
    margin: 4px 0;
  }
</style>
