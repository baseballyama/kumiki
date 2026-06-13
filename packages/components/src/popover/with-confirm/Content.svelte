<!--
  @component Popconfirm.Content — `role="alertdialog"` panel for the recipe.

  Reuses Popover's controller + dismissable wiring (Escape, outside-click)
  but elevates the role to `alertdialog` per APG, and moves initial focus
  to the Cancel button (less-destructive default).
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { POPOVER_CONTEXT_KEY, type PopoverContextValue } from '../context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<PopoverContextValue>(POPOVER_CONTEXT_KEY);
  const initialOpen = controller.open;

  // Two attaches on the same node are allowed in Svelte 5; the order they
  // appear is the order they run. We let popover paint role="dialog" first,
  // then upgrade to "alertdialog" and re-target focus on each open.
  function elevate(node: HTMLElement): () => void {
    function applyRole(): void {
      node.setAttribute('role', 'alertdialog');
    }
    function focusCancel(): void {
      // Run twice through the microtask queue so we land *after* Popover's
      // own `queueMicrotask(() => focusFirst(node))` fires.
      queueMicrotask(() => {
        queueMicrotask(() => {
          if (controller.state !== 'open') return;
          const cancel = node.querySelector<HTMLButtonElement>('[data-popconfirm-initial-focus]');
          cancel?.focus();
        });
      });
    }

    applyRole();
    if (controller.state === 'open') focusCancel();

    const unsub = controller.subscribe(({ state }) => {
      // Popover's own subscribe re-paints role="dialog"; reapply.
      applyRole();
      if (state === 'open') focusCancel();
    });
    return unsub;
  }
</script>

<div
  {...rest}
  id={controller.contentId}
  role="alertdialog"
  aria-labelledby={controller.descriptionId}
  data-component-host="popconfirm"
  data-state={initialOpen ? 'open' : 'closed'}
  hidden={!initialOpen || undefined}
  {@attach controller.content}
  {@attach elevate}
>
  {#if children}{@render children()}{/if}
</div>
