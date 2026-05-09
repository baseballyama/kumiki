<script lang="ts">
  import { Root, Item, Trigger, Panel, type AccordionItem } from '@kumiki/components/accordion';

  const items: AccordionItem<string>[] = [
    { id: 'a-general', value: 'general', label: 'General' },
    { id: 'a-team', value: 'team', label: 'Team' },
    { id: 'a-security', value: 'security', label: 'Security' },
    { id: 'a-billing', value: 'billing', label: 'Billing' },
  ];

  let mode = $state<'single' | 'multiple'>('single');
  let value = $state<string | string[] | null>(null);
</script>

<div class="demo">
  <div class="controls">
    <label>
      Mode:
      <select bind:value={mode}>
        <option value="single">single</option>
        <option value="multiple">multiple</option>
      </select>
    </label>
  </div>

  <Root {items} bind:value {mode}>
    {#each items as item (item.id)}
      <Item value={item} class="acc-item">
        <Trigger value={item} class="acc-trigger">{item.label}</Trigger>
        <Panel value={item} class="acc-panel">
          <p>This is the <strong>{item.label}</strong> panel content.</p>
        </Panel>
      </Item>
    {/each}
  </Root>

  <p class="state">
    value: <code>{JSON.stringify(value)}</code>
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 24px;
  }
  .controls {
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
  .demo :global(.acc-item) {
    border-bottom: 1px solid var(--k-line-1);
  }
  .demo :global(.acc-item:last-child) {
    border-bottom: none;
  }
  .demo :global(.acc-trigger) {
    width: 100%;
    text-align: start;
    background: transparent;
    color: var(--k-ink-1);
    border: 0;
    padding: 12px 0;
    cursor: pointer;
    font: 600 14px inherit;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .demo :global(.acc-trigger::after) {
    content: '▾';
    color: var(--k-ink-3);
    transition: transform 200ms;
  }
  .demo :global(.acc-trigger[aria-expanded='true']::after) {
    transform: rotate(180deg);
  }
  .demo :global(.acc-panel[hidden]) {
    display: none;
  }
  .demo :global(.acc-panel:not([hidden])) {
    padding: 0 0 12px;
    color: var(--k-ink-2);
    font-size: 14px;
    line-height: 1.5;
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
