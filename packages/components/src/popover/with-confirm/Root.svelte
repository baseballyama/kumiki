<!--
  @component Popconfirm.Root — owns the popover controller and the recipe context.

  Mirrors the wiring in `Popover.Root` directly (createPopover + setContext)
  so the recipe can reach the controller from within `fireConfirm` /
  `fireCancel` event handlers — `getContext` only resolves during script
  init, not inside callbacks.

  Required props:
  - `onConfirm` — called when the user activates Confirm. May return a promise.

  Optional:
  - `onCancel` — called when the user activates Cancel (or Escape closes).
  - `confirmLabel` / `cancelLabel` — override the i18n defaults.
  - `variant` — `'neutral'` (default) or `'danger'`. Atelier maps to colour.
-->
<script lang="ts">
  import { onDestroy, setContext, untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import { createPopover, type PopoverController } from '@kumiki/headless/popover';
  import { tryUseLocale } from '../../locale-provider/index.js';
  import { POPOVER_CONTEXT_KEY, type PopoverContextValue } from '../context.js';
  import { POPCONFIRM_CONTEXT_KEY, type PopconfirmContextValue } from './context.js';

  type Props = {
    open?: boolean;
    defaultOpen?: boolean;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    onOpenChange?: (open: boolean) => void;
    id?: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
    /** Defaults to the locale's `popconfirm.confirm` (English fallback: "Confirm"). */
    confirmLabel?: string;
    /** Defaults to the locale's `popconfirm.cancel` (English fallback: "Cancel"). */
    cancelLabel?: string;
    variant?: 'neutral' | 'danger';
    children: Snippet;
  };

  let {
    open = $bindable(undefined),
    defaultOpen = false,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    onOpenChange,
    id,
    onConfirm,
    onCancel,
    confirmLabel,
    cancelLabel,
    variant = 'neutral',
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

  const unsub = controller.subscribe(() => {});
  onDestroy(unsub);

  // The standard popover context — so `<Popover.*>` building blocks (Trigger,
  // Title, etc.) used inside this Root continue to function. We don't have
  // a separate Popconfirm.Trigger that *needs* anything different; it's a
  // re-export.
  setContext<PopoverContextValue>(POPOVER_CONTEXT_KEY, { controller });

  const locale = tryUseLocale();
  const resolvedConfirmLabel = $derived(
    confirmLabel ?? locale?.messages.popconfirm.confirm ?? 'Confirm',
  );
  const resolvedCancelLabel = $derived(
    cancelLabel ?? locale?.messages.popconfirm.cancel ?? 'Cancel',
  );

  setContext<PopconfirmContextValue>(POPCONFIRM_CONTEXT_KEY, {
    get variant() {
      return variant;
    },
    get confirmLabel() {
      return resolvedConfirmLabel;
    },
    get cancelLabel() {
      return resolvedCancelLabel;
    },
    async fireConfirm() {
      try {
        await onConfirm();
      } finally {
        controller.hide();
      }
    },
    fireCancel() {
      onCancel?.();
      controller.hide();
    },
    registerCancel(node) {
      // Expose via a data hook so Content's focus override can find the
      // node without crossing context boundaries from inside an attachment.
      node.setAttribute('data-popconfirm-initial-focus', '');
      return () => {
        node.removeAttribute('data-popconfirm-initial-focus');
      };
    },
  });
</script>

{@render children()}
