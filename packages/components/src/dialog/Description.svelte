<!--
  @component Dialog.Description — optional accessible description.
  Wires `aria-describedby` on the content automatically.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { DIALOG_CONTEXT_KEY, type DialogContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<DialogContextValue>(DIALOG_CONTEXT_KEY);
</script>

<p
  {...rest}
  id={controller.descriptionId}
  data-component-part="description"
  {@attach controller.description}
>
  {#if children}{@render children()}{/if}
</p>
