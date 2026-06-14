<!--
  @component Tabs.Tab — a single tab button inside `<Tabs.List>`.

  The `value` prop is the matching `TabItem` from the parent's `items`. The
  child snippet receives the rendered label (typically `value.label`).

  Snippets:
  - `children` → default content of the `<button role="tab">`.
  - `child`    → render delegation (ADR 0007). Receives `{ props, attachment,
                 state }`. Common use: a router `<a>` tab (allowed by APG).
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { TABS_CONTEXT_KEY, type TabItem, type TabsContextValue } from './context.js';

  type ChildPayload = {
    props: {
      type: 'button';
      role: 'tab';
      id: string;
      'aria-controls': string;
      'aria-selected': 'true' | 'false';
      'aria-disabled': 'true' | undefined;
      'data-state': 'active' | 'inactive';
      tabindex: 0 | -1;
    };
    state: { selected: boolean; disabled: boolean };
    /** Attach via `{@attach attachment}` to wire interactions + ARIA paint. */
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
  const attachment = controller.tab(value);

  // SSR-safe initial attribute snapshot — captured once. The attachment
  // repaints these post-hydration. value.id is constant for an instance.
  // svelte-ignore state_referenced_locally
  const isSelected = controller.value === value.value;

  // svelte-ignore state_referenced_locally
  const childProps: ChildPayload['props'] = {
    type: 'button',
    role: 'tab',
    id: controller.tabElementId(value.id),
    'aria-controls': controller.panelElementId(value.id),
    'aria-selected': isSelected ? 'true' : 'false',
    'aria-disabled': value.disabled ? 'true' : undefined,
    'data-state': isSelected ? 'active' : 'inactive',
    tabindex: isSelected ? 0 : -1,
  };

  // svelte-ignore state_referenced_locally
  const payload: ChildPayload = {
    props: childProps,
    attachment,
    state: { selected: isSelected, disabled: !!value.disabled },
  };
</script>

{#if child}
  {@render child(payload)}
{:else}
  <button {...rest} {...childProps} {@attach attachment}>
    {#if children}{@render children()}{/if}
  </button>
{/if}
