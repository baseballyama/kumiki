<!--
  @component Toolbar.Separator — visual + semantic divider between item groups.

  Renders a `<div role="separator">` with `aria-orientation` perpendicular to
  the toolbar (a vertical bar in a horizontal toolbar, and vice versa). Pure
  presentational — does not register with the roving-tabindex coordinator.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import { TOOLBAR_CONTEXT_KEY, type ToolbarContextValue } from './context.js';

  type Props = {
    [key: string]: unknown;
  };

  let { ...rest }: Props = $props();

  const ctx = getContext<ToolbarContextValue | undefined>(TOOLBAR_CONTEXT_KEY);
  // Separator is purely visual; it is allowed (but unusual) outside a Toolbar.
  // Default to "vertical" inside a horizontal toolbar — the bar visually
  // separates left/right groups.
  const orientation = $derived(ctx?.orientation === 'vertical' ? 'horizontal' : 'vertical');
</script>

<div {...rest} role="separator" aria-orientation={orientation} data-orientation={orientation}></div>
