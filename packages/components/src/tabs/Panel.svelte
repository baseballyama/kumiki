<!--
  @component Tabs.Panel — the content panel for a tab.

  The `value` prop must reference a `TabItem` from the parent's `items`.
  The panel is hidden via the `hidden` attribute when its tab is inactive;
  consumers can override visibility with CSS if they want a fade transition,
  but `hidden` removes the panel from the accessibility tree which is what
  the APG pattern asks for.

  Snippets:
  - `children` → default content of the `<div role="tabpanel">`.
  - `child`    → render delegation (ADR 0007). Receives `{ props, attachment,
                 state }`.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { TABS_CONTEXT_KEY, type TabItem, type TabsContextValue } from './context.js';

  type ChildPayload = {
    props: {
      role: 'tabpanel';
      id: string;
      'aria-labelledby': string;
      'data-state': 'active' | 'inactive';
      hidden: true | undefined;
      tabindex: 0;
    };
    state: { selected: boolean };
    /** Attach via `{@attach attachment}` to wire ARIA paint-on-change. */
    attachment: Attachment<HTMLElement>;
  };

  type Props = {
    value: TabItem;
    children?: Snippet;
    child?: Snippet<[payload: ChildPayload]>;
    [key: string]: unknown;
  };

  let { value, children, child, ...rest }: Props = $props();

  const { controller } = getContext<TabsContextValue>(TABS_CONTEXT_KEY);
  // svelte-ignore state_referenced_locally
  const attachment = controller.panel(value);

  // svelte-ignore state_referenced_locally
  const isSelected = controller.value === value.value;

  // svelte-ignore state_referenced_locally
  const childProps: ChildPayload['props'] = {
    role: 'tabpanel',
    id: controller.panelElementId(value.id),
    'aria-labelledby': controller.tabElementId(value.id),
    'data-state': isSelected ? 'active' : 'inactive',
    hidden: !isSelected || undefined,
    tabindex: 0,
  };

  const payload: ChildPayload = { props: childProps, attachment, state: { selected: isSelected } };
</script>

{#if child}
  {@render child(payload)}
{:else}
  <div {...rest} {...childProps} {@attach attachment}>
    {#if children}{@render children()}{/if}
  </div>
{/if}
