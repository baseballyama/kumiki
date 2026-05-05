<!--
  @component Popover.Root — owns the controller and shares it via context.

  Bindable props:
  - `open` → boolean. Bind for two-way control.

  Plain props:
  - `defaultOpen` (default false) / `closeOnEscape` (default true) /
    `closeOnOutsideClick` (default true) / `onOpenChange`.

  Renders no DOM itself — leaf components (`Trigger`, `Content`, etc.)
  own their elements. This makes portal'ing the Content trivial: the
  consumer wraps it in their own `<Portal>` without the Root contributing
  extra wrappers.

  @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
-->
<script lang="ts">
  import { onDestroy, setContext, untrack } from 'svelte';
  import { createPopover, type PopoverController } from '@kumiki/headless/popover';
  import type { Snippet } from 'svelte';
  import { POPOVER_CONTEXT_KEY, type PopoverContextValue } from './context.js';

  type Props = {
    open?: boolean;
    defaultOpen?: boolean;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    onOpenChange?: (open: boolean) => void;
    id?: string;
    children: Snippet;
  };

  let {
    open = $bindable(undefined),
    defaultOpen = false,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    onOpenChange,
    id,
    children,
  }: Props = $props();

  const controller: PopoverController = untrack(() =>
    createPopover({
      defaultOpen: open ?? defaultOpen,
      closeOnEscape,
      closeOnOutsideClick,
      id,
      onOpenChange: (next) => {
        open = next;
        onOpenChange?.(next);
      },
    }),
  );

  $effect(() => {
    if (open !== undefined && open !== controller.open) {
      controller.setOpen(open);
    }
  });
  $effect(() => {
    controller.setCloseOnEscape(closeOnEscape);
  });
  $effect(() => {
    controller.setCloseOnOutsideClick(closeOnOutsideClick);
  });

  let unsub = controller.subscribe(() => {});
  onDestroy(unsub);

  setContext<PopoverContextValue>(POPOVER_CONTEXT_KEY, { controller });
</script>

{@render children()}
