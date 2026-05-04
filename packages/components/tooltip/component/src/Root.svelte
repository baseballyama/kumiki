<!--
  @component Tooltip.Root — owns the controller and shares it via context.

  Bindable props:
  - `open` → boolean. Bind for two-way control.

  Plain props:
  - `defaultOpen` / `openDelay` (default 700ms) / `closeDelay` (default 300ms) /
    `disableHoverableContent` (default false) / `onOpenChange`.

  Renders no DOM itself — Trigger / Content are responsible for their elements.
-->
<script lang="ts">
  import { onDestroy, setContext, untrack } from 'svelte';
  import { createTooltip, type TooltipController } from '@kumiki/attachment-tooltip';
  import type { Snippet } from 'svelte';
  import { TOOLTIP_CONTEXT_KEY, type TooltipContextValue } from './context.js';

  type Props = {
    open?: boolean;
    defaultOpen?: boolean;
    openDelay?: number;
    closeDelay?: number;
    disableHoverableContent?: boolean;
    onOpenChange?: (open: boolean) => void;
    id?: string;
    children: Snippet;
  };

  let {
    open = $bindable(undefined),
    defaultOpen = false,
    openDelay = 700,
    closeDelay = 300,
    disableHoverableContent = false,
    onOpenChange,
    id,
    children,
  }: Props = $props();

  const controller: TooltipController = untrack(() =>
    createTooltip({
      defaultOpen: open ?? defaultOpen,
      openDelay,
      closeDelay,
      disableHoverableContent,
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
    controller.setOpenDelay(openDelay);
  });
  $effect(() => {
    controller.setCloseDelay(closeDelay);
  });
  $effect(() => {
    controller.setDisableHoverableContent(disableHoverableContent);
  });

  let unsub = controller.subscribe(() => {});
  onDestroy(unsub);

  setContext<TooltipContextValue>(TOOLTIP_CONTEXT_KEY, { controller });
</script>

{@render children()}
