<script lang="ts" generics="T extends ComboboxOption">
  import { Listbox } from '@kumiki/components/combobox';
  import type { Snippet } from 'svelte';
  import type { ComboboxOption } from '@kumiki/components/combobox';

  type Props = {
    item?: Snippet<[T, number]>;
    empty?: Snippet;
    loading?: Snippet;
    children?: Snippet;
  };

  let { item, empty, loading, children }: Props = $props();
</script>

<Listbox {item} {empty} {loading}>
  {#if children}{@render children()}{/if}
</Listbox>
