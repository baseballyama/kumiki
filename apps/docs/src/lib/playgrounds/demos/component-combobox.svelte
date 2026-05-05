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
    background: #16162a;
    border: 1px solid #2a2a4a;
    border-radius: 12px;
    padding: 24px;
  }
  .combobox label {
    display: block;
    color: #888;
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
    background: #0e0e1c;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    border-radius: 8px;
    font: inherit;
    outline: none;
  }
  .row :global(input[role='combobox']:focus) {
    border-color: #ff3e00;
  }
  .row :global(button) {
    padding: 8px 12px;
    background: #1a1a2e;
    border: 1px solid #3a3a5a;
    border-radius: 8px;
    color: #e0e0e0;
    cursor: pointer;
    font: inherit;
  }
  .combobox :global(ul[role='listbox']) {
    margin-top: 4px;
    padding: 4px;
    background: #0e0e1c;
    border: 1px solid #3a3a5a;
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
    background: #2a2a4a;
  }
  .combobox :global(li[role='option'][aria-selected='true']) {
    color: #ff3e00;
  }
  .label {
    color: #e0e0e0;
  }
  .year {
    color: #666;
    font-size: 12px;
  }
  .empty {
    color: #666;
    padding: 12px;
    font-style: italic;
    text-align: center;
  }
  .state {
    color: #888;
    font-size: 14px;
    margin-top: 16px;
  }
  .state code {
    color: #4fc08d;
  }
</style>
