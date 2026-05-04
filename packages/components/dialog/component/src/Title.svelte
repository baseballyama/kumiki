<!--
  @component Dialog.Title — accessible name for the dialog. REQUIRED for
  modal dialogs per APG (the content's `aria-labelledby` already points at
  this element's id).

  Renders an `<h2>` by default. Override with `as`:

      <Dialog.Title as="h1">Settings</Dialog.Title>

  (Default `<h2>` matches the typical visual hierarchy: H1 = page title,
  H2 = dialog title.)
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

<h2 {...rest} id={controller.titleId} data-component-part="title" {@attach controller.title}>
  {#if children}{@render children()}{/if}
</h2>
