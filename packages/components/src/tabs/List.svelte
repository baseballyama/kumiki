<!--
  @component Tabs.List — the `<div role="tablist">` wrapper.

  Renders a div by default. Pass `class` / `style` via `...rest`.

  Snippets:
  - `children` → default content (the `<Tabs.Tab>`s).
  - `child`    → render delegation (ADR 0007). Receives `{ props, attachment,
                 state }`.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { TABS_CONTEXT_KEY, type TabsContextValue, type TabsOrientation } from './context.js';

  type ChildPayload = {
    props: {
      role: 'tablist';
      'aria-orientation': TabsOrientation;
      'aria-disabled': 'true' | undefined;
      'data-disabled': '' | undefined;
    };
    state: { disabled: boolean; orientation: TabsOrientation };
    /** Attach via `{@attach attachment}` to wire keyboard nav + ARIA paint. */
    attachment: Attachment<HTMLElement>;
  };

  type Props = {
    children?: Snippet;
    child?: Snippet<[payload: ChildPayload]>;
    [key: string]: unknown;
  };

  let { children, child, ...rest }: Props = $props();

  const ctx = getContext<TabsContextValue>(TABS_CONTEXT_KEY);
  const { controller } = ctx;

  // svelte-ignore state_referenced_locally
  const disabled = controller.disabled;
  // svelte-ignore state_referenced_locally
  const orientation = ctx.orientation;

  const payload: ChildPayload = {
    props: {
      role: 'tablist',
      'aria-orientation': orientation,
      'aria-disabled': disabled ? 'true' : undefined,
      'data-disabled': disabled ? '' : undefined,
    },
    attachment: controller.list,
    state: { disabled, orientation },
  };
</script>

{#if child}
  {@render child(payload)}
{:else}
  <div
    {...rest}
    role="tablist"
    data-component="tabs"
    data-component-host="tabs"
    {@attach controller.list}
  >
    {#if children}{@render children()}{/if}
  </div>
{/if}
