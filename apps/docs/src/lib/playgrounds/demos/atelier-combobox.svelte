<script lang="ts">
  import { Vanilla as Combobox } from '@kumiki/atelier/combobox';
  import type { ComboboxOption } from '@kumiki/components/combobox';

  interface Framework extends ComboboxOption {
    id: string;
    label: string;
    year: number;
  }

  const frameworks: Framework[] = [
    { id: 'svelte', label: 'Svelte', year: 2016 },
    { id: 'react', label: 'React', year: 2013 },
    { id: 'vue', label: 'Vue', year: 2014 },
    { id: 'solid', label: 'Solid', year: 2018 },
    { id: 'qwik', label: 'Qwik', year: 2022 },
    { id: 'angular', label: 'Angular', year: 2010 },
  ];

  let value = $state<Framework | null>(null);
</script>

<div class="demo">
  <Combobox.Root options={frameworks} bind:value>
    <Combobox.Input aria-label="Pick a framework" placeholder="Type to filter…" />
    <Combobox.Trigger aria-label="Toggle options" />
    <Combobox.Listbox>
      {#snippet item(fw: Framework)}
        <Combobox.Item value={fw}>
          <span>{fw.label}</span>
          <span class="year">{fw.year}</span>
        </Combobox.Item>
      {/snippet}
      {#snippet empty()}
        <li class="empty">No matches.</li>
      {/snippet}
    </Combobox.Listbox>
  </Combobox.Root>

  <p class="state">selected = <code>{value?.label ?? 'null'}</code></p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    min-height: 280px;
  }
  .demo :global(li[role='option']) {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }
  .year {
    color: hsl(220 10% 50%);
    font-size: 12px;
  }
  .empty {
    padding: 12px;
    color: hsl(220 10% 50%);
    font-style: italic;
    text-align: center;
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
