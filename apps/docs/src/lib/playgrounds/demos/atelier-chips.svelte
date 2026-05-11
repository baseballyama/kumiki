<script lang="ts">
  import { Vanilla as Chips } from '@kumiki/atelier/chips';

  let tags = $state(['svelte', 'a11y', 'i18n']);
  let filter = $state(false);
</script>

<div class="demo">
  <div class="row">
    {#each tags as tag (tag)}
      <Chips.Root
        variant="dismissible"
        label={tag}
        onDismiss={() => (tags = tags.filter((t) => t !== tag))}
      >
        <Chips.Label>{tag}</Chips.Label>
        <Chips.Close />
      </Chips.Root>
    {:else}
      <span class="hint">No chips left.</span>
    {/each}
  </div>

  <div class="row">
    <Chips.Root tone="info" variant="static">
      <Chips.Label>Static · info</Chips.Label>
    </Chips.Root>
    <Chips.Root tone="success" variant="static">
      <Chips.Label>Static · success</Chips.Label>
    </Chips.Root>
    <Chips.Root variant="selectable" pressed={filter} onPressedChange={(v) => (filter = v)}>
      <Chips.Label>Filter (selectable)</Chips.Label>
    </Chips.Root>
  </div>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    align-items: center;
  }
  .hint {
    color: var(--k-ink-3);
    font-size: 13px;
  }
</style>
