<!--
  @component Alert.Title — heading text for the alert.

  Sets the `id` referenced by the Root's `aria-labelledby` so the alert's
  accessible name is the title text.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { ALERT_CONTEXT_KEY, type AlertContextValue } from './context.js';

  type Props = {
    /** Heading level. Defaults to a styled `<div>` (no implicit level). */
    level?: 2 | 3 | 4 | 5 | 6;
    children: Snippet;
    [key: string]: unknown;
  };

  let { level, children, ...rest }: Props = $props();
  const { controller } = getContext<AlertContextValue>(ALERT_CONTEXT_KEY);
</script>

<svelte:element
  this={level ? `h${level}` : 'div'}
  id={controller.titleId}
  data-part="title"
  {...rest}>{@render children()}</svelte:element
>
