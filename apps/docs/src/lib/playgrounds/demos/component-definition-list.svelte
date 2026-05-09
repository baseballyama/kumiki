<script lang="ts">
  import { DefinitionList } from '@kumiki/components/definition-list';

  const entries = [
    { term: 'Status', desc: 'Active' },
    { term: 'Created', desc: '2026-01-12' },
    { term: 'Owner', desc: 'baseballyama' },
    { term: 'License', desc: 'MIT' },
  ];

  let grouped = $state(true);
</script>

<div class="demo">
  <div class="controls">
    <label class="control">
      <input type="checkbox" bind:checked={grouped} /> grouped (CSS Grid friendly)
    </label>
  </div>

  <DefinitionList.Root {grouped} class={grouped ? 'dl-grid' : ''}>
    {#each entries as e (e.term)}
      <DefinitionList.Term>{e.term}</DefinitionList.Term>
      <DefinitionList.Description>{e.desc}</DefinitionList.Description>
    {/each}
  </DefinitionList.Root>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
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
