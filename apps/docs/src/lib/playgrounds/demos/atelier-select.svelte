<script lang="ts">
  import { Vanilla as Select } from '@kumiki/atelier/select';
  import type { SelectItem } from '@kumiki/components/select';

  type Fruit = 'apple' | 'banana' | 'cherry' | 'durian';
  const items: SelectItem<Fruit>[] = [
    { id: 'apple', value: 'apple', label: 'Apple' },
    { id: 'banana', value: 'banana', label: 'Banana' },
    { id: 'cherry', value: 'cherry', label: 'Cherry' },
    { id: 'durian', value: 'durian', label: 'Durian', disabled: true },
  ];

  let value = $state<Fruit | null>(null);
</script>

<div class="demo">
  <label class="row">
    <span>Favourite fruit</span>
    <Select.Root {items} bind:value>
      <Select.Trigger>{value ?? 'Pick one'}</Select.Trigger>
      <Select.Listbox>
        {#each items as it (it.id)}
          <Select.Option value={it}>{it.label}</Select.Option>
        {/each}
      </Select.Listbox>
    </Select.Root>
  </label>
  <p class="state">value = <code>{value ?? 'null'}</code></p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    min-height: 200px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--k-ink-2);
    font-size: 14px;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
    font-family: var(--k-font-mono, monospace);
  }
  .state code {
    color: var(--k-matcha-ink);
  }
</style>
