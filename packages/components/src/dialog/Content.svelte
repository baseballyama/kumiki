<!--
  @component Dialog.Content — the panel that holds the dialog body.

  Activates focus-trap + dismissable + (when modal) sibling `inert` on open
  via the attachment. The consumer is responsible for placing `<Title>` and
  optionally `<Description>` inside.
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

  const ctx = getContext<DialogContextValue>(DIALOG_CONTEXT_KEY);
  const { controller } = ctx;
  const initialOpen = controller.open;
  const initialModal = controller.context.modal;
</script>

<div
  {...rest}
  role="dialog"
  aria-modal={initialModal ? 'true' : 'false'}
  aria-labelledby={controller.titleId}
  data-component-host="dialog"
  data-state={initialOpen ? 'open' : 'closed'}
  data-side={ctx.side}
  hidden={!initialOpen || undefined}
  {@attach controller.content}
>
  {#if children}{@render children()}{/if}
</div>
