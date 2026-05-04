<!--
  @component Select.Trigger — the button that opens the listbox.

  Renders a `<button>` by default. The child snippet usually shows the
  current value or a placeholder; consumers compute that from `bind:value`.
-->
<script lang="ts" generics="V">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { SELECT_CONTEXT_KEY, type SelectContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<SelectContextValue<V>>(SELECT_CONTEXT_KEY);
  const initialOpen = controller.open;
</script>

<button
  {...rest}
  type="button"
  id={controller.triggerId}
  aria-haspopup="listbox"
  aria-controls={controller.listboxId}
  aria-expanded={initialOpen ? 'true' : 'false'}
  data-component-host="select"
  data-state={initialOpen ? 'open' : 'closed'}
  {@attach controller.trigger}
>
  {#if children}{@render children()}{/if}
</button>
