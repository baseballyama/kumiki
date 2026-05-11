<!--
  @component Alert.Description — body text for the alert.

  Sets the `id` referenced by the Root's `aria-describedby` so screen
  readers announce both title and description with the live region.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { ALERT_CONTEXT_KEY, type AlertContextValue } from './context.js';

  type Props = {
    children: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();
  const { controller } = getContext<AlertContextValue>(ALERT_CONTEXT_KEY);
</script>

<div id={controller.descriptionId} data-component-part="description" {...rest}>
  {@render children()}
</div>
