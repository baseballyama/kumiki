<!--
  @component Tabs.Panel — the content panel for a tab.

  The `value` prop must reference a `TabItem` from the parent's `items`.
  The panel is hidden via the `hidden` attribute when its tab is inactive;
  consumers can override visibility with CSS if they want a fade transition,
  but `hidden` removes the panel from the accessibility tree which is what
  the APG pattern asks for.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { TABS_CONTEXT_KEY, type TabItem, type TabsContextValue } from './context.js';

  type Props = {
    value: TabItem;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { value, children, ...rest }: Props = $props();

  const { controller } = getContext<TabsContextValue>(TABS_CONTEXT_KEY);
  // svelte-ignore state_referenced_locally
  const attachment = controller.panel(value);

  // svelte-ignore state_referenced_locally
  const isSelected = controller.value === value.value;
</script>

<div
  {...rest}
  role="tabpanel"
  id={controller.panelElementId(value.id)}
  aria-labelledby={controller.tabElementId(value.id)}
  data-state={isSelected ? 'active' : 'inactive'}
  hidden={!isSelected || undefined}
  tabindex="0"
  {@attach attachment}
>
  {#if children}{@render children()}{/if}
</div>
