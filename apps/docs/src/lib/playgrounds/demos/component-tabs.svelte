<script lang="ts">
  import { Root, List, Tab, Panel, type TabItem } from '@kumiki/components/tabs';

  const items: TabItem[] = [
    { id: 't-account', value: 'account', label: 'Account' },
    { id: 't-billing', value: 'billing', label: 'Billing' },
    { id: 't-team', value: 'team', label: 'Team' },
    { id: 't-security', value: 'security', label: 'Security' },
  ];

  let value = $state<string | null>('account');
  let activation = $state<'automatic' | 'manual'>('automatic');
  let orientation = $state<'horizontal' | 'vertical'>('horizontal');
</script>

<div class="demo">
  <div class="controls">
    <label>
      Activation:
      <select bind:value={activation}>
        <option value="automatic">automatic</option>
        <option value="manual">manual</option>
      </select>
    </label>
    <label>
      Orientation:
      <select bind:value={orientation}>
        <option value="horizontal">horizontal</option>
        <option value="vertical">vertical</option>
      </select>
    </label>
  </div>

  <div class="tabs-wrap" data-orientation={orientation}>
    <Root {items} bind:value {activation} {orientation}>
      <List>
        {#each items as item (item.id)}
          <Tab value={item}>{item.label}</Tab>
        {/each}
      </List>
      <div class="panels">
        {#each items as item (item.id)}
          <Panel value={item}>
            <h3>{item.label}</h3>
            <p>
              This is the <strong>{item.label}</strong> panel. Switch tabs to swap content; the
              non-active panels are removed from the a11y tree via the <code>hidden</code>
              attribute.
            </p>
          </Panel>
        {/each}
      </div>
    </Root>
  </div>

  <p class="state">value: <code>{value ?? 'null'}</code></p>
</div>

<style>
  .demo {
    background: #16162a;
    border: 1px solid #2a2a4a;
    border-radius: 12px;
    padding: 24px;
  }
  .controls {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    color: #aaa;
    font-size: 13px;
  }
  .controls select {
    background: #0e0e1c;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    padding: 4px 8px;
    margin-left: 6px;
  }
  .tabs-wrap[data-orientation='horizontal'] :global([role='tablist']) {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid #2a2a4a;
    margin-bottom: 16px;
  }
  .tabs-wrap[data-orientation='vertical'] {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 16px;
  }
  .tabs-wrap[data-orientation='vertical'] :global([role='tablist']) {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-right: 1px solid #2a2a4a;
    padding-right: 8px;
  }
  .demo :global(button[role='tab']) {
    background: transparent;
    color: #aaa;
    border: 0;
    padding: 8px 14px;
    font: inherit;
    cursor: pointer;
    border-radius: 6px 6px 0 0;
    transition: color 120ms;
  }
  .tabs-wrap[data-orientation='vertical'] :global(button[role='tab']) {
    border-radius: 6px;
    text-align: left;
  }
  .demo :global(button[role='tab']:hover) {
    color: #e0e0e0;
  }
  .demo :global(button[role='tab'][aria-selected='true']) {
    color: #ff3e00;
    background: #0e0e1c;
    box-shadow: inset 0 -2px 0 #ff3e00;
  }
  .tabs-wrap[data-orientation='vertical'] :global(button[role='tab'][aria-selected='true']) {
    box-shadow: inset 2px 0 0 #ff3e00;
  }
  .demo :global(button[role='tab'][aria-disabled='true']) {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .demo :global([role='tabpanel']) {
    padding: 16px;
    background: #0e0e1c;
    border-radius: 8px;
    color: #ddd;
    line-height: 1.5;
    outline: none;
  }
  .demo :global([role='tabpanel']:focus-visible) {
    outline: 2px solid #4fc08d;
    outline-offset: 2px;
  }
  .demo :global([role='tabpanel'] h3) {
    font-size: 14px;
    color: #4fc08d;
    margin: 0 0 8px;
  }
  .demo :global([role='tabpanel'] p) {
    margin: 0;
    color: #aaa;
    font-size: 14px;
  }
  .demo :global([role='tabpanel'] code) {
    background: #1a1a30;
    color: #4fc08d;
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 12px;
  }
  .state {
    margin-top: 16px;
    color: #888;
    font-size: 14px;
  }
  .state code {
    color: #4fc08d;
  }
</style>
