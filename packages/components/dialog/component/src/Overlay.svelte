<!--
  @component Dialog.Overlay — the backdrop. Clicking it dispatches
  OUTSIDE_CLICK (which closes the dialog if `closeOnOutsideClick` is true).

  Renders a `<div>` and toggles `hidden` based on dialog state. Style with
  CSS — Kumiki ships no styles.
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

<div
  {...rest}
  data-component-part="overlay"
  data-state={initialOpen ? 'open' : 'closed'}
  hidden={!initialOpen || undefined}
  {@attach controller.overlay}
>
  {#if children}{@render children()}{/if}
</div>
