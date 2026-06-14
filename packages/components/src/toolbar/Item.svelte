<!--
  @component Toolbar.Item — a button that joins the toolbar's roving tabindex.

  Rendered as a native `<button type="button">` by default. Provide the `child`
  snippet to render any focusable element instead — Kumiki passes the props
  you must spread on it.

  Required props:
  - `children` (or `child`) — the visible label / glyph.

  Optional:
  - `disabled` — disables this item only.
  - `onclick` — forwarded as-is.

  The Item intercepts Arrow / Home / End so the toolbar can rove focus across
  enabled siblings. Tab moves focus out of the toolbar entirely (not to the
  next item), per APG.
-->
<script lang="ts">
  import { getContext, untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import { TOOLBAR_CONTEXT_KEY, type ToolbarContextValue } from './context.js';

  type Props = {
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
    /** Extra props (`class`, `style`, `data-*`, `aria-label`, …) forwarded to `<button>`. */
    [key: string]: unknown;
  };

  let { disabled = false, onclick, children, ...rest }: Props = $props();

  const ctxOptional = getContext<ToolbarContextValue | undefined>(TOOLBAR_CONTEXT_KEY);
  if (!ctxOptional) {
    throw new Error('<Toolbar.Item> must be a descendant of <Toolbar.Root>.');
  }
  const ctx: ToolbarContextValue = ctxOptional;

  let buttonRef = $state<HTMLButtonElement | null>(null);
  const tabStop = $derived(ctx.isTabStop(buttonRef));

  function attach(node: HTMLButtonElement): () => void {
    buttonRef = node;
    return untrack(() => ctx.register(node, disabled));
  }

  $effect(() => {
    const node = buttonRef;
    const isDisabled = disabled;
    if (!node) return;
    untrack(() => ctx.setItemDisabled(node, isDisabled));
  });

  function handleKeydown(event: KeyboardEvent): void {
    if (disabled || !buttonRef) return;
    const horizontal = ctx.orientation === 'horizontal';
    switch (event.key) {
      case 'ArrowLeft':
        if (!horizontal) return;
        event.preventDefault();
        ctx.focusRelative(buttonRef, 'prev');
        return;
      case 'ArrowRight':
        if (!horizontal) return;
        event.preventDefault();
        ctx.focusRelative(buttonRef, 'next');
        return;
      case 'ArrowUp':
        if (horizontal) return;
        event.preventDefault();
        ctx.focusRelative(buttonRef, 'prev');
        return;
      case 'ArrowDown':
        if (horizontal) return;
        event.preventDefault();
        ctx.focusRelative(buttonRef, 'next');
        return;
      case 'Home':
        event.preventDefault();
        ctx.focusRelative(buttonRef, 'first');
        return;
      case 'End':
        event.preventDefault();
        ctx.focusRelative(buttonRef, 'last');
        return;
    }
  }

  function handleFocus(): void {
    if (disabled || !buttonRef) return;
    ctx.notifyFocus(buttonRef);
  }

  // aria-disabled keeps the item focusable, so activation (click / Enter /
  // Space, which dispatch click) must be suppressed in JS.
  function handleClick(event: MouseEvent): void {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onclick?.(event);
  }
</script>

<button
  {...rest}
  type="button"
  aria-disabled={disabled ? 'true' : undefined}
  data-disabled={disabled ? '' : undefined}
  tabindex={tabStop ? 0 : -1}
  onclick={handleClick}
  onkeydown={handleKeydown}
  onfocus={handleFocus}
  {@attach attach}
>
  {#if children}{@render children()}{/if}
</button>
