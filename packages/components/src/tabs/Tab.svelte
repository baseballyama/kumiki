<!--
  @component Tabs.Tab — a single tab button inside `<Tabs.List>`.

  The `value` prop is the matching `TabItem` from the parent's `items`. The
  child snippet receives the rendered label (typically `value.label`).
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
  const attachment = controller.tab(value);

  // SSR-safe initial attribute snapshot — captured once. The attachment
  // repaints these post-hydration. value.id is constant for an instance.
  // svelte-ignore state_referenced_locally
  const isSelected = controller.value === value.value;
</script>

<button
  {...rest}
  type="button"
  role="tab"
  id={controller.tabElementId(value.id)}
  aria-controls={controller.panelElementId(value.id)}
  aria-selected={isSelected ? 'true' : 'false'}
  aria-disabled={value.disabled ? 'true' : undefined}
  data-state={isSelected ? 'active' : 'inactive'}
  tabindex={isSelected ? 0 : -1}
  {@attach attachment}
>
  {#if children}{@render children()}{/if}
</button>
