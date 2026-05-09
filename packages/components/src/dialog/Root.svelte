<!--
  @component Dialog.Root — owns the controller and shares it via context.

  Bindable props:
  - `open` → boolean. Bind for two-way control.

  Plain props:
  - `defaultOpen` / `modal` (default true) / `closeOnEscape` (default true) /
    `closeOnOutsideClick` (default true) / `onOpenChange`.

  Renders no DOM itself — leaf components (`Dialog.Trigger`, `Dialog.Content`,
  etc.) are responsible for their own elements. This makes portal'ing the
  Content trivial: the consumer wraps it in their own `<Portal>` without the
  Root contributing extra wrappers.
-->
<script lang="ts">
  import { onDestroy, setContext, untrack } from 'svelte';
  import { createDialog, type DialogController } from '@kumiki/headless/dialog';
  import type { Snippet } from 'svelte';
  import { DIALOG_CONTEXT_KEY, type DialogContextValue } from './context.js';

  import type { DialogSide } from './context.js';

  type Props = {
    open?: boolean;
    defaultOpen?: boolean;
    modal?: boolean;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    onOpenChange?: (open: boolean) => void;
    id?: string;
    /**
     * Drawer variant. `'center'` (default) is the classic modal; the four edge
     * values slide in from that edge. Layer 4 only forwards this as
     * `data-side` on `Dialog.Content` — atelier (or your own CSS) does the
     * positioning. RTL: `left`/`right` follow physical edges; flip in CSS via
     * `[dir='rtl']` if you want logical mirroring.
     */
    side?: DialogSide;
    children: Snippet;
  };

  let {
    open = $bindable(undefined),
    defaultOpen = false,
    modal = true,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    onOpenChange,
    id,
    side = 'center',
    children,
  }: Props = $props();

  const controller: DialogController = untrack(() =>
    createDialog({
      defaultOpen: open ?? defaultOpen,
      modal,
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
    controller.setModal(modal);
  });
  $effect(() => {
    controller.setCloseOnEscape(closeOnEscape);
  });
  $effect(() => {
    controller.setCloseOnOutsideClick(closeOnOutsideClick);
  });

  let unsub = controller.subscribe(() => {});
  onDestroy(unsub);

  setContext<DialogContextValue>(DIALOG_CONTEXT_KEY, {
    controller,
    get side() {
      return side;
    },
  });
</script>

{@render children()}
