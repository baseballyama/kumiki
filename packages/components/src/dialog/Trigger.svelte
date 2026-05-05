<!--
  @component Dialog.Trigger — the button that opens the dialog.
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
  const initialOpen = controller.open;
</script>

<button
  {...rest}
  type="button"
  aria-haspopup="dialog"
  aria-expanded={initialOpen ? 'true' : 'false'}
  aria-controls={controller.contentId}
  data-state={initialOpen ? 'open' : 'closed'}
  {@attach controller.trigger}
>
  {#if children}{@render children()}{/if}
</button>
