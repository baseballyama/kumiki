<!--
  Layer 4 DefinitionList demo — pure headless contract.

  L4 ships only the semantic compound: Root → Term / Description.
  Layout (two-column CSS Grid, stacked, etc.) is a consumer-CSS concern.
  See `@kumiki/atelier/definition-list` (Layer 5) for the styled grid preset.
-->
<script lang="ts">
  import { DefinitionList } from '@kumiki/components/definition-list';

  const entries = [
    { term: 'Status', desc: 'Active' },
    { term: 'Created', desc: '2026-01-12' },
    { term: 'Owner', desc: 'baseballyama' },
    { term: 'License', desc: 'MIT' },
  ];

  let layout = $state<'stacked' | 'grid'>('grid');
</script>

<div class="demo">
  <div class="controls">
    <label class="control">
      Layout (consumer CSS)
      <select bind:value={layout}>
        <option value="grid">two-column grid</option>
        <option value="stacked">stacked</option>
      </select>
    </label>
  </div>

  <DefinitionList.Root class={layout === 'grid' ? 'dl-grid' : ''}>
    {#each entries as e (e.term)}
      <DefinitionList.Term>{e.term}</DefinitionList.Term>
      <DefinitionList.Description>{e.desc}</DefinitionList.Description>
    {/each}
  </DefinitionList.Root>

  <p class="hint">
    Layer 4 emits a semantic <code>&lt;dl&gt;</code> only — layout is a consumer-CSS concern. The
    "two-column grid" option above is one local CSS rule (<code>.dl-grid</code>). Layer 5 (<code
      >@kumiki/atelier/definition-list</code
    >) provides a styled grid preset.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 420px;
    min-height: 360px;
    box-sizing: border-box;
  }
  .controls {
    margin-bottom: 16px;
  }
  .control {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .demo :global(dl) {
    margin: 0;
    color: var(--k-ink-1);
    font-size: 14px;
  }
  .demo :global(dl.dl-grid) {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 8px 16px;
  }
  .demo :global(dt) {
    color: var(--k-ink-3);
    font-weight: 600;
  }
  .demo :global(dd) {
    margin: 0;
  }
</style>
