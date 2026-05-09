<script lang="ts" generics="T extends ComboboxOption">
  import { Item } from '@kumiki/components/combobox';
  import type { Snippet } from 'svelte';
  import type { ComboboxOption } from '@kumiki/components/combobox';

  type Props = { value: T; children: Snippet };
  let { value, children }: Props = $props();
</script>

<Item {value}>{@render children()}</Item>
