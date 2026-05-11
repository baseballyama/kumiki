<!--
  @component AvatarGroup.Root — stacked-avatar list with overflow.

  Children are placed inside a `role="list"` `<ul>`. The component does
  NOT enforce truncation — `max` and `total` are passed via context so a
  consumer can render the visible items + a single Overflow.

  This keeps the slicing-from-an-array decision at the consumer site
  (different apps already paginate / filter their member lists) while
  the component handles the ARIA wrapper and the overflow label.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';
  export type Props = {
    /** Maximum visible avatars before showing the overflow indicator. */
    max?: number;
    /** Override the total count for the overflow label (defaults to children-count). */
    total?: number;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    children: Snippet;
    [key: string]: unknown;
  };
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import { AVATAR_GROUP_CONTEXT_KEY, type AvatarGroupContextValue } from './context.js';

  let { max, total, children, ...rest }: Props = $props();

  setContext<AvatarGroupContextValue>(AVATAR_GROUP_CONTEXT_KEY, {
    get max() {
      return max;
    },
    get total() {
      return total;
    },
  } as AvatarGroupContextValue);
</script>

<ul role="list" {...rest} data-component-part="group">{@render children()}</ul>
