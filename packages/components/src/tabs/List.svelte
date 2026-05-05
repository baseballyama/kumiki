<!--
  @component Tabs.List — the `<div role="tablist">` wrapper.

  Renders a div by default. Pass `class` / `style` via `...rest`.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { TABS_CONTEXT_KEY, type TabsContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<TabsContextValue>(TABS_CONTEXT_KEY);
</script>

<div
  {...rest}
  role="tablist"
  data-component="tabs"
  data-component-host="tabs"
  {@attach controller.list}
>
  {#if children}{@render children()}{/if}
</div>
