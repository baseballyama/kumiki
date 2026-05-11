<script lang="ts">
  import {
    Root,
    Input,
    Listbox,
    Item,
    Trigger,
    type ComboboxOption,
  } from '@kumiki/components/combobox';

  interface Framework extends ComboboxOption {
    id: string;
    label: string;
    yearOfRelease: number;
  }

  const frameworks: Framework[] = [
    { id: 'svelte', label: 'Svelte', yearOfRelease: 2016 },
    { id: 'react', label: 'React', yearOfRelease: 2013 },
    { id: 'vue', label: 'Vue', yearOfRelease: 2014 },
    { id: 'solid', label: 'Solid', yearOfRelease: 2018 },
    { id: 'qwik', label: 'Qwik', yearOfRelease: 2022 },
    { id: 'angular', label: 'Angular', yearOfRelease: 2010 },
    { id: 'preact', label: 'Preact', yearOfRelease: 2015 },
    { id: 'lit', label: 'Lit', yearOfRelease: 2019 },
  ];

  let value = $state<Framework | null>(null);
</script>

<div class="demo">
  <div class="combobox">
    <Root options={frameworks} bind:value>
      <label for="cb-input">Pick a framework</label>
      <div class="row">
        <Input id="cb-input" placeholder="Type to filter…" />
        <Trigger aria-label="Toggle options">▾</Trigger>
      </div>
      <Listbox>
        {#snippet item(fw: Framework)}
          <Item value={fw}>
            <span class="label">{fw.label}</span>
            <span class="year">{fw.yearOfRelease}</span>
          </Item>
        {/snippet}
        {#snippet empty()}
          <li class="empty">No matches.</li>
        {/snippet}
      </Listbox>
    </Root>
  </div>

  <p class="state">
    selected: <code>{value?.label ?? 'null'}</code>
    {#if value}
      · year: <code>{value.yearOfRelease}</code>
    {/if}
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 24px;
  }
  .combobox label {
    display: block;
    color: var(--k-ink-3);
    font-size: 13px;
    margin-bottom: 6px;
  }
  .row {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .row :global(input[role='combobox']) {
    flex: 1;
    padding: 8px 12px;
    background: var(--k-code-bg);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: 8px;
    font: inherit;
    outline: none;
  }
  .row :global(input[role='combobox']:focus) {
    border-color: var(--k-shu);
  }
  .row :global(button) {
    padding: 8px 12px;
    background: var(--k-surface-2);
    border: 1px solid var(--k-line-2);
    border-radius: 8px;
    color: var(--k-ink-1);
    cursor: pointer;
    font: inherit;
  }
  .combobox :global(ul[role='listbox']) {
    margin-top: 4px;
    padding: 4px;
    background: var(--k-code-bg);
    border: 1px solid var(--k-line-2);
    border-radius: 8px;
    list-style: none;
    max-height: 240px;
    overflow-y: auto;
  }
  .combobox :global(li[role='option']) {
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .combobox :global(li[role='option'][data-highlighted='true']) {
    background: var(--k-line-1);
  }
  .combobox :global(li[role='option'][aria-selected='true']) {
    color: var(--k-shu);
  }
  .label {
    color: var(--k-ink-1);
  }
  .year {
    color: var(--k-ink-3);
    font-size: 12px;
  }
  .empty {
    color: var(--k-ink-3);
    padding: 12px;
    font-style: italic;
    text-align: center;
  }
  .state {
    color: var(--k-ink-3);
    font-size: 14px;
    margin-top: 16px;
  }
  .state code {
    color: var(--k-matcha-ink);
  }
</style>
