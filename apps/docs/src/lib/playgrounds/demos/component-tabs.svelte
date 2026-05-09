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
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 24px;
  }
  .controls {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    color: var(--k-ink-2);
    font-size: 13px;
  }
  .controls select {
    background: var(--k-code-bg);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 4px 8px;
    margin-left: 6px;
  }
  .tabs-wrap[data-orientation='horizontal'] :global([role='tablist']) {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid var(--k-line-1);
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
    border-right: 1px solid var(--k-line-1);
    padding-right: 8px;
  }
  .demo :global(button[role='tab']) {
    background: transparent;
    color: var(--k-ink-2);
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
    color: var(--k-ink-1);
  }
  .demo :global(button[role='tab'][aria-selected='true']) {
    color: var(--k-shu);
    background: var(--k-code-bg);
    box-shadow: inset 0 -2px 0 var(--k-shu);
  }
  .tabs-wrap[data-orientation='vertical'] :global(button[role='tab'][aria-selected='true']) {
    box-shadow: inset 2px 0 0 var(--k-shu);
  }
  .demo :global(button[role='tab'][aria-disabled='true']) {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .demo :global([role='tabpanel']) {
    padding: 16px;
    background: var(--k-code-bg);
    border-radius: 8px;
    color: var(--k-ink-2);
    line-height: 1.5;
    outline: none;
  }
  .demo :global([role='tabpanel']:focus-visible) {
    outline: 2px solid var(--k-matcha);
    outline-offset: 2px;
  }
  .demo :global([role='tabpanel'] h3) {
    font-size: 14px;
    color: var(--k-matcha);
    margin: 0 0 8px;
  }
  .demo :global([role='tabpanel'] p) {
    margin: 0;
    color: var(--k-ink-2);
    font-size: 14px;
  }
  .demo :global([role='tabpanel'] code) {
    background: var(--k-surface-2);
    color: var(--k-matcha);
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 12px;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 14px;
  }
  .state code {
    color: var(--k-matcha);
  }
</style>
