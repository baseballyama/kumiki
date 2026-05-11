<script lang="ts">
  import { Chips } from '@kumiki/components/chips';

  let tags = $state<string[]>(['design', 'svelte', 'a11y']);
  let pressed = $state(false);

  function dismiss(label: string) {
    tags = tags.filter((t) => t !== label);
  }
</script>

<div class="demo">
  <h4 class="grp">Static</h4>
  <div class="row">
    <Chips.Root>
      <Chips.Label>open-source</Chips.Label>
    </Chips.Root>
    <Chips.Root>
      <Chips.Label>v1.0</Chips.Label>
    </Chips.Root>
  </div>

  <h4 class="grp">Dismissible</h4>
  <div class="row">
    {#each tags as tag (tag)}
      <Chips.Root variant="dismissible" label={tag} onDismiss={() => dismiss(tag)}>
        <Chips.Label>{tag}</Chips.Label>
        <Chips.Close>×</Chips.Close>
      </Chips.Root>
    {/each}
    {#if tags.length === 0}
      <p class="hint">
        All chips dismissed.
        <button type="button" class="ext" onclick={() => (tags = ['design', 'svelte', 'a11y'])}>
          Reset
        </button>
      </p>
    {/if}
  </div>

  <h4 class="grp">Selectable (filter)</h4>
  <div class="row">
    <Chips.Root variant="selectable" {pressed} onPressedChange={(v) => (pressed = v)}>
      <Chips.Label>Only mine</Chips.Label>
    </Chips.Root>
    <span class="hint">pressed = <code>{pressed}</code></span>
  </div>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .grp {
    margin: 18px 0 8px;
    color: var(--k-ink-3);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .grp:first-child {
    margin-top: 0;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .demo :global([data-part='root']) {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: var(--k-surface-2);
    border: 1px solid var(--k-line-2);
    border-radius: 16px;
    color: var(--k-ink-1);
    font-size: 13px;
  }
  .demo :global(button[data-part='root']) {
    cursor: pointer;
    font: inherit;
  }
  .demo :global(button[data-part='root'][aria-pressed='true']) {
    background: var(--k-shu);
    border-color: var(--k-shu);
    color: white;
  }
  .demo :global([data-part='close']) {
    background: transparent;
    border: 0;
    color: var(--k-ink-3);
    font-size: 16px;
    cursor: pointer;
    padding: 0 2px;
  }
  .ext {
    background: transparent;
    color: var(--k-ink-2);
    border: 1px dashed var(--k-line-2);
    border-radius: var(--k-radius-sm);
    padding: 4px 10px;
    font: inherit;
    cursor: pointer;
    margin-left: 8px;
  }
  .hint {
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .hint code {
    color: var(--k-matcha-ink);
  }
</style>
