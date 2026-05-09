<!--
  @component @kumiki/atelier/dialog Tailwind — Root pass-through.
  Owns the controller; rendering is delegated to leaf components.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = {
    open?: boolean;
    defaultOpen?: boolean;
    modal?: boolean;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    onOpenChange?: (open: boolean) => void;
    id?: string;
    children: Snippet;
  };

  let {
    open = $bindable(undefined),
    defaultOpen,
    modal,
    closeOnEscape,
    closeOnOutsideClick,
    onOpenChange,
    id,
    children,
  }: Props = $props();
</script>

<Dialog.Root
  bind:open
  {defaultOpen}
  {modal}
  {closeOnEscape}
  {closeOnOutsideClick}
  {onOpenChange}
  {id}
>
  {@render children()}
</Dialog.Root>
