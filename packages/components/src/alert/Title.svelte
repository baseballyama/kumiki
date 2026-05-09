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

{#if level === 2}
  <h2 id={controller.titleId} data-part="title" {...rest}>{@render children()}</h2>
{:else if level === 3}
  <h3 id={controller.titleId} data-part="title" {...rest}>{@render children()}</h3>
{:else if level === 4}
  <h4 id={controller.titleId} data-part="title" {...rest}>{@render children()}</h4>
{:else if level === 5}
  <h5 id={controller.titleId} data-part="title" {...rest}>{@render children()}</h5>
{:else if level === 6}
  <h6 id={controller.titleId} data-part="title" {...rest}>{@render children()}</h6>
{:else}
  <div id={controller.titleId} data-part="title" {...rest}>{@render children()}</div>
{/if}
